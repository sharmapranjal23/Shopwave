import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, CartProvider, WishlistProvider } from './contexts';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/product/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/orders" element={<PageTransition><Orders /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute></PageTransition>} />
          <Route path="*" element={<PageTransition><div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: 80, marginBottom: 20 }}>🌊</div><h2 style={{ fontFamily: 'Outfit', fontSize: 40, fontWeight: 800, marginBottom: 12 }}>404</h2><p style={{ color: 'var(--text2)', marginBottom: 32 }}>Page not found</p><a href="/" className="btn btn-primary">Go Home</a></div></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--bg3)', color: 'var(--text)',
                  border: '1px solid var(--border)', fontFamily: 'Inter, sans-serif',
                  fontSize: 14, borderRadius: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.28)',
                },
                success: { iconTheme: { primary: '#06d6a0', secondary: '#fff' }, duration: 2400 },
                error: { iconTheme: { primary: '#ff6b6b', secondary: '#fff' }, duration: 3200 },
              }}
            />
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
