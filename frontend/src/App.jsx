import { Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Store from "./pages/Store";
import Insurance from "./pages/Insurance";
import Mechanics from "./pages/Mechanics";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Partner pages
import PartnerRegister from "./pages/PartnerRegister";
import PartnerLogin from "./pages/PartnerLogin";

// Driver pages
import UserDashboard from "./pages/UserDashboard";
import Vehicles from "./pages/Vehicles";
import RequestService from "./pages/RequestService";
import TrackRequest from "./pages/TrackRequest";
import ServiceHistory from "./pages/ServiceHistory";

// Mechanic pages
import MechanicDashboard from "./pages/MechanicDashboard";
import MechanicProfile from "./pages/MechanicProfile";
import MechanicEarnings from "./pages/MechanicEarnings";

// Seller pages
import SellerDashboard from "./pages/SellerDashboard";
import SellerOrders from "./pages/SellerOrders";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminDisputes from "./pages/AdminDisputes";
import AdminReports from "./pages/AdminReports";

// ✅ Checkout + My Orders (any logged-in user)
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import MyDisputes from "./pages/MyDisputes";
import SellerEarnings from "./pages/SellerEarnings";
import SellerProfile from "./pages/SellerProfile";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* ============ PUBLIC ============ */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/store" element={<Store />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* ============ PARTNER ============ */}
          <Route path="/partner/register" element={<PartnerRegister />} />
          <Route path="/partner/login" element={<PartnerLogin />} />

          {/* ============ DRIVER ============ */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <Vehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-service"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <RequestService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track/:requestId"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <TrackRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <ServiceHistory />
              </ProtectedRoute>
            }
          />

          {/* ============ MECHANIC ============ */}
          <Route
            path="/mechanic"
            element={
              <ProtectedRoute allowedRoles={["mechanic"]}>
                <MechanicDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mechanic/profile"
            element={
              <ProtectedRoute allowedRoles={["mechanic"]}>
                <MechanicProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mechanic/earnings"
            element={
              <ProtectedRoute allowedRoles={["mechanic"]}>
                <MechanicEarnings />
              </ProtectedRoute>
            }
          />

          {/* ============ SELLER ============ */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerOrders />
              </ProtectedRoute>
            }
          />

          {/* ============ CHECKOUT + MY ORDERS (any logged-in user) ============ */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* ============ ADMIN ============ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/disputes"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDisputes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-disputes"
            element={
              <ProtectedRoute>
                <MyDisputes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/earnings"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerEarnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerProfile />
              </ProtectedRoute>
            }
          />

          {/* ============ 404 ============ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;