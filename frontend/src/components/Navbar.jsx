import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  FaCarCrash, FaBars, FaTimes, FaChevronDown, FaUser,
  FaUserShield, FaTools, FaStore, FaTachometerAlt,
  FaInfoCircle, FaShieldAlt, FaEnvelope, FaHandshake,
  FaSignOutAlt, FaHistory, FaCar, FaShoppingBag,
} from 'react-icons/fa'
import Button from './Button'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const companyMenuRef = useRef(null)
  const userMenuRef = useRef(null)

  const { user, logout } = useAuth()

  // ============ SCROLL EFFECT ============
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ============ CLOSE MENUS ON ROUTE CHANGE ============
  useEffect(() => {
    setOpen(false)
    setCompanyMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  // ============ CLICK OUTSIDE ============
  useEffect(() => {
    const handler = (e) => {
      if (companyMenuRef.current && !companyMenuRef.current.contains(e.target)) {
        setCompanyMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ============ PUBLIC LINKS ============
  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/request-service' },
    { name: 'Store', path: '/store' },
  ]

  // ============ COMPANY DROPDOWN ============
  const companyLinks = [
    {
      section: 'Explore',
      items: [
        { name: 'Insurance', path: '/insurance', icon: <FaShieldAlt />, desc: 'Compare 10+ insurers' },
        { name: 'Partners', path: '/mechanics', icon: <FaHandshake />, desc: 'Garage & seller network' },
      ],
    },
    {
      section: 'Company',
      items: [
        { name: 'About Us', path: '/about', icon: <FaInfoCircle />, desc: 'Our story & mission' },
        { name: 'Contact Us', path: '/help#contact', icon: <FaEnvelope />, desc: 'Get in touch with us' },
      ],
    },
  ]

  // ============ ROLE-BASED DASHBOARD LINK ============
  const getDashboardLink = () => {
    if (!user) return null
    switch (user.role) {
      case 'admin':
        return { name: 'Admin Panel', path: '/admin', icon: <FaUserShield /> }
      case 'mechanic':
        return { name: 'Mechanic Panel', path: '/mechanic', icon: <FaTools /> }
      case 'seller':
        return { name: 'Seller Panel', path: '/seller', icon: <FaStore /> }
      case 'driver':
      default:
        return { name: 'My Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> }
    }
  }

  const dashboardLink = getDashboardLink()

  // ============ USER MENU LINKS (role-based) ============
  const getUserMenuLinks = () => {
    if (!user) return []

    const common = [
      { name: 'Dashboard', path: dashboardLink?.path || '/dashboard', icon: <FaTachometerAlt /> },
    ]

    // ✅ My Orders — for EVERY logged-in user
    const myOrders = { name: 'My Orders', path: '/my-orders', icon: <FaShoppingBag /> }

    if (user.role === 'driver') {
      return [
        ...common,
        myOrders,
        { name: 'My Vehicles', path: '/vehicles', icon: <FaCar /> },
        { name: 'Service History', path: '/history', icon: <FaHistory /> },
        { name: 'Insurance', path: '/insurance', icon: <FaShieldAlt /> },
      ]
    }

    if (user.role === 'mechanic') {
      return [
        ...common,
        myOrders,
        { name: 'My Profile', path: '/mechanic/profile', icon: <FaUser /> },
        { name: 'Earnings', path: '/mechanic/earnings', icon: <FaTachometerAlt /> },
      ]
    }

    if (user.role === 'admin') {
      return [
        ...common,
        myOrders,
        { name: 'Manage Users', path: '/admin/users', icon: <FaUserShield /> },
        { name: 'Disputes', path: '/admin/disputes', icon: <FaHandshake /> },
        { name: 'Reports', path: '/admin/reports', icon: <FaHistory /> },
      ]
    }

    if (user.role === 'seller') {
      return [
        ...common,
        myOrders,
        { name: 'My Store', path: '/store', icon: <FaStore /> },
        { name: 'Orders', path: '/seller/orders', icon: <FaShoppingBag /> },
      ]
    }

    return [...common, myOrders]
  }

  const userMenuLinks = getUserMenuLinks()

  // ============ LOGOUT ============
  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    setOpen(false)
    navigate('/login')
  }

  // ============ ROLE BADGE STYLES ============
  const roleBadge = (role) => {
    const map = {
      admin: { label: 'Admin', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
      mechanic: { label: 'Mechanic', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
      seller: { label: 'Seller', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      driver: { label: 'Driver', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    }
    return map[role] || { label: 'Guest', bg: 'bg-ink-100', text: 'text-ink-700', border: 'border-ink-200' }
  }

  const initials = user
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : ''

  const isActive = (path) => location.pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-ink-900/5 py-3'
          : 'bg-white/80 backdrop-blur-md py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
            <FaCarCrash className="text-white text-lg" />
          </div>
          <span className="font-display text-xl font-bold text-ink-900">
            Road<span className="gradient-text">Assist</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-6">
          {publicLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors relative group ${
                isActive(link.path) ? 'text-brand-600' : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-brand-500 transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}

          {/* 🔶 MY ORDERS — desktop nav (only for logged-in) */}
          {user && (
            <Link
              to="/my-orders"
              className={`text-sm font-medium transition-colors relative group flex items-center gap-1.5 ${
                isActive('/my-orders') ? 'text-brand-600' : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              <FaShoppingBag className="text-xs" />
              My Orders
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-brand-500 transition-all duration-300 ${
                  isActive('/my-orders') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          )}

          {/* COMPANY DROPDOWN */}
          <div className="relative" ref={companyMenuRef}>
            <button
              onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                companyMenuOpen ? 'text-brand-600' : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              Company
              <FaChevronDown
                className={`text-[10px] transition-transform ${companyMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {companyMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-[560px] bg-white rounded-2xl shadow-2xl border border-ink-100 overflow-hidden animate-slideDown z-50">
                <div className="grid grid-cols-2">
                  {companyLinks.map((group, gi) => (
                    <div key={gi} className={`p-5 ${gi === 0 ? 'border-r border-ink-100' : ''}`}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400 mb-3">
                        {group.section}
                      </p>
                      <div className="space-y-1">
                        {group.items.map((item, ii) => (
                          <Link
                            key={ii}
                            to={item.path}
                            onClick={() => setCompanyMenuOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-brand-50 transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-brand-100 group-hover:bg-brand-500 flex items-center justify-center text-brand-600 group-hover:text-white text-xs flex-shrink-0 transition-colors">
                              {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-600 leading-tight">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-ink-500 mt-0.5 leading-tight">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${roleBadge(user.role).bg} ${roleBadge(user.role).text} ${roleBadge(user.role).border}`}>
                {roleBadge(user.role).label}
              </span>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-ink-900 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <FaChevronDown
                    className={`text-[9px] text-ink-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-ink-100 overflow-hidden animate-slideDown z-50">
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-cream-100 border-b border-ink-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ink-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-ink-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      {userMenuLinks.map((link, i) => (
                        <Link
                          key={i}
                          to={link.path}
                          onClick={() => setUserMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive(link.path)
                              ? 'bg-brand-50 text-brand-700'
                              : 'text-ink-700 hover:bg-ink-50'
                          }`}
                        >
                          <span className="text-brand-500 text-xs w-4">{link.icon}</span>
                          {link.name}
                        </Link>
                      ))}
                    </div>

                    <div className="p-2 border-t border-ink-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaSignOutAlt className="text-xs" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-10 h-10 rounded-lg bg-ink-900 text-white flex items-center justify-center"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-ink-100 transition-all duration-300 overflow-hidden ${
          open ? 'max-h-[900px] py-4' : 'max-h-0'
        }`}
      >
        <div className="px-6 flex flex-col gap-1">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-cream-100 mb-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-900 truncate">{user.name}</p>
                <p className="text-[11px] text-ink-500 truncate">{user.email}</p>
              </div>
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${roleBadge(user.role).bg} ${roleBadge(user.role).text} ${roleBadge(user.role).border}`}>
                {roleBadge(user.role).label}
              </span>
            </div>
          )}

          {/* Public links */}
          {publicLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-ink-800 font-medium py-2 hover:text-brand-600"
            >
              {link.name}
            </Link>
          ))}

          {/* 🔶 MY ORDERS — mobile (only for logged-in) */}
          {user && (
            <Link
              to="/my-orders"
              className="flex items-center gap-2 text-ink-800 font-medium py-2 hover:text-brand-600"
            >
              <FaShoppingBag className="text-xs text-brand-500" />
              My Orders
            </Link>
          )}

          {/* Company */}
          <div className="border-t border-ink-100 my-2 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400 mb-2">
              Explore
            </p>
            {companyLinks[0].items.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="flex items-center gap-3 py-2 text-ink-800 hover:text-brand-600 text-sm"
              >
                <span className="text-brand-500 text-xs">{item.icon}</span>
                {item.name}
              </Link>
            ))}

            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400 mb-2 mt-4">
              Company
            </p>
            {companyLinks[1].items.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="flex items-center gap-3 py-2 text-ink-800 hover:text-brand-600 text-sm"
              >
                <span className="text-brand-500 text-xs">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* User menu links */}
          {user && userMenuLinks.length > 0 && (
            <div className="border-t border-ink-100 my-2 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400 mb-2">
                My Account
              </p>
              {userMenuLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  className="flex items-center gap-3 py-2 text-ink-800 hover:text-brand-600 text-sm"
                >
                  <span className="text-brand-500 text-xs">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* Auth */}
          <div className="flex gap-3 pt-4 mt-2 border-t border-ink-100">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" fullWidth size="sm">Sign In</Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button fullWidth size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>
    </header>
  )
}

export default Navbar