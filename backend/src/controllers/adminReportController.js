import User from '../models/User.js'
import ServiceRequest from '../models/ServiceRequest.js'
import Order from '../models/Order.js'
import Dispute from '../models/Dispute.js'
import Product from '../models/Product.js'
import { successResponse } from '../utils/apiResponse.js'

// @desc    Full admin reports (for AdminReports page)
// @route   GET /api/admin/reports
export const getReports = async (req, res, next) => {
  try {
    // ============ USER COUNTS ============
    const [totalUsers, totalDrivers, totalMechanics, totalSellers] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'driver' }),
        User.countDocuments({ role: 'mechanic' }),
        User.countDocuments({ role: 'seller' }),
      ])

    // ============ SERVICE STATS ============
    const [totalServices, completedServices, cancelledServices, pendingServices] =
      await Promise.all([
        ServiceRequest.countDocuments(),
        ServiceRequest.countDocuments({ status: 'Completed' }),
        ServiceRequest.countDocuments({ status: 'Cancelled' }),
        ServiceRequest.countDocuments({
          status: { $in: ['Requested', 'Accepted', 'En Route', 'Arrived'] },
        }),
      ])

    // ============ ORDER STATS ============
    const [totalOrders, deliveredOrders, pendingOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'Delivered' }),
      Order.countDocuments({ status: 'Pending' }),
    ])

    // ============ REVENUE ============
    const orderRevAgg = await Order.aggregate([
      { $match: { status: { $in: ['Delivered', 'Shipped'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const serviceRevAgg = await ServiceRequest.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const orderRevenue = orderRevAgg[0]?.total || 0
    const serviceRevenue = serviceRevAgg[0]?.total || 0

    // ============ MONTHLY TREND (last 6 months) ============
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyTrend = await ServiceRequest.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    // ============ SERVICE BREAKDOWN ============
    const serviceBreakdown = await ServiceRequest.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { count: -1 } },
    ])

    // ============ TOP MECHANICS ============
    const topMechanics = await ServiceRequest.aggregate([
      { $match: { status: 'Completed', mechanic: { $ne: null } } },
      {
        $group: {
          _id: '$mechanic',
          jobs: { $sum: 1 },
          earnings: { $sum: '$total' },
        },
      },
      { $sort: { jobs: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'mechanics',
          localField: '_id',
          foreignField: 'user',
          as: 'profile',
        },
      },
      {
        $project: {
          name: '$user.name',
          city: '$user.city',
          garage: { $arrayElemAt: ['$profile.garageName', 0] },
          rating: { $arrayElemAt: ['$profile.rating', 0] },
          jobs: 1,
          earnings: 1,
        },
      },
    ])

    // ============ CITY PERFORMANCE ============
    const cityPerformance = await ServiceRequest.aggregate([
      {
        $group: {
          _id: '$location.address',
          jobs: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 6 },
    ])

    // ============ DISPUTE STATS ============
    const [openDisputes, progressDisputes, resolvedDisputes, escalatedDisputes] =
      await Promise.all([
        Dispute.countDocuments({ status: 'Open' }),
        Dispute.countDocuments({ status: 'In Progress' }),
        Dispute.countDocuments({ status: 'Resolved' }),
        Dispute.countDocuments({ status: 'Escalated' }),
      ])

    // ============ PRODUCTS ============
    const totalProducts = await Product.countDocuments({ isActive: true })

    return successResponse(res, 200, 'Reports fetched', {
      users: {
        total: totalUsers,
        drivers: totalDrivers,
        mechanics: totalMechanics,
        sellers: totalSellers,
      },
      services: {
        total: totalServices,
        completed: completedServices,
        cancelled: cancelledServices,
        pending: pendingServices,
        completionRate: totalServices
          ? Math.round((completedServices / totalServices) * 100)
          : 0,
      },
      orders: {
        total: totalOrders,
        delivered: deliveredOrders,
        pending: pendingOrders,
      },
      products: { total: totalProducts },
      disputes: {
        open: openDisputes,
        progress: progressDisputes,
        resolved: resolvedDisputes,
        escalated: escalatedDisputes,
      },
      revenue: {
        fromOrders: orderRevenue,
        fromServices: serviceRevenue,
        total: orderRevenue + serviceRevenue,
      },
      monthlyTrend: monthlyTrend.map((m) => ({
        month: `${String(m._id.month).padStart(2, '0')}/${m._id.year}`,
        count: m.count,
        revenue: m.revenue,
      })),
      serviceBreakdown: serviceBreakdown.map((s) => ({
        type: s._id,
        count: s.count,
        revenue: s.revenue,
      })),
      topMechanics: topMechanics.map((m, i) => ({
        rank: i + 1,
        name: m.name,
        garage: m.garage || '—',
        city: m.city,
        jobs: m.jobs,
        rating: m.rating || 4.5,
        earnings: m.earnings,
      })),
      cityPerformance: cityPerformance.map((c) => ({
        city: c._id || 'Unknown',
        jobs: c.jobs,
        revenue: c.revenue,
      })),
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Enhanced dashboard stats (for AdminDashboard page)
// @route   GET /api/admin/dashboard-stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalMechanics, totalServices, completedServices] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'mechanic' }),
        ServiceRequest.countDocuments(),
        ServiceRequest.countDocuments({ status: 'Completed' }),
      ])

    const [liveRequests, pendingMechanics, pendingSellers] = await Promise.all([
      ServiceRequest.countDocuments({
        status: { $in: ['Requested', 'Accepted', 'En Route', 'Arrived'] },
      }),
      User.countDocuments({
        role: 'mechanic',
        status: 'Pending Verification',
      }),
      User.countDocuments({
        role: 'seller',
        status: 'Pending Verification',
      }),
    ])

    // Revenue (this month)
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthlyServiceRev = await ServiceRequest.aggregate([
      {
        $match: {
          status: 'Completed',
          completedAt: { $gte: monthStart },
        },
      },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const monthlyOrderRev = await Order.aggregate([
      {
        $match: {
          status: { $in: ['Delivered', 'Shipped'] },
          createdAt: { $gte: monthStart },
        },
      },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const monthlyRevenue =
      (monthlyServiceRev[0]?.total || 0) + (monthlyOrderRev[0]?.total || 0)

    const openDisputes = await Dispute.countDocuments({
      status: { $ne: 'Resolved' },
    })

    return successResponse(res, 200, 'Dashboard stats fetched', {
      totalUsers,
      totalMechanics,
      totalServices,
      completedServices,
      liveRequests,
      pendingMechanics,
      pendingSellers,
      monthlyRevenue,
      openDisputes,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Pending verifications (for AdminDashboard)
// @route   GET /api/admin/pending-verifications
export const getPendingVerifications = async (req, res, next) => {
  try {
    const pending = await User.find({
      role: { $in: ['mechanic', 'seller'] },
      status: 'Pending Verification',
    })
      .select('name email role city createdAt')
      .sort({ createdAt: -1 })
      .limit(10)

    return successResponse(res, 200, 'Pending verifications fetched', pending)
  } catch (error) {
    next(error)
  }
}

// @desc    Live service requests (for AdminDashboard)
// @route   GET /api/admin/live-requests
// @desc    Live service requests (enhanced)
// @route   GET /api/admin/live-requests
export const getLiveRequests = async (req, res, next) => {
  try {
    const live = await ServiceRequest.find({
      status: { $in: ['Requested', 'Accepted', 'En Route', 'Arrived'] },
    })
      .populate('user', 'name phone city')
      .populate('mechanic', 'name phone')
      .populate('vehicle', 'name plate type')
      .sort({ createdAt: -1 })
      .limit(50)

    return successResponse(res, 200, 'Live requests fetched', live)
  } catch (error) {
    next(error)
  }
}