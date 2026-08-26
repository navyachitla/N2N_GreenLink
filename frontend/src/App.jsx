import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ServicesPage } from './pages/ServicesPage';
import { LearningPage } from './pages/LearningPage';
import { ArticlePage } from './pages/ArticlePage';
import { CommunityPage } from './pages/CommunityPage';
import { EventsPage } from './pages/EventsPage';

// User Protected Pages
import { UserDashboard } from './pages/UserDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { SellProductPage } from './pages/SellProductPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { CartPage } from './pages/CartPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { WastePage } from './pages/WastePage';
import { CarbonFootprintPage } from './pages/CarbonFootprintPage';
import { RewardsPage } from './pages/RewardsPage';

// Admin Protected Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminWastePage } from './pages/AdminWastePage';
import { AdminServicesPage } from './pages/AdminServicesPage';
import { AdminLearningPage } from './pages/AdminLearningPage';
import { AdminEventsPage } from './pages/AdminEventsPage';

export function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/learning/:id" element={<ArticlePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/events" element={<EventsPage />} />

            {/* User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/sell-product" element={<ProtectedRoute><SellProductPage /></ProtectedRoute>} />
            <Route path="/my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
            <Route path="/recycling" element={<ProtectedRoute><WastePage /></ProtectedRoute>} />
            <Route path="/carbon" element={<ProtectedRoute><CarbonFootprintPage /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/waste" element={<AdminRoute><AdminWastePage /></AdminRoute>} />
            <Route path="/admin/services" element={<AdminRoute><AdminServicesPage /></AdminRoute>} />
            <Route path="/admin/learning" element={<AdminRoute><AdminLearningPage /></AdminRoute>} />
            <Route path="/admin/events" element={<AdminRoute><AdminEventsPage /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
