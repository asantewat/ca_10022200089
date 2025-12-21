import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { ProductsPage } from './components/pages/ProductsPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { CartPage } from './components/pages/CartPage';
import { CheckoutPage } from './components/pages/CheckoutPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AdminDashboard } from './components/pages/admin/AdminDashboard';
import { AdminProducts } from './components/pages/admin/AdminProducts';
import { AdminOrders } from './components/pages/admin/AdminOrders';
import { Toaster } from './components/ui/sonner';

type Page =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'login'
  | 'register'
  | 'profile'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-orders';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user && !['login', 'register'].includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [user, isLoading, currentPage]);

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page as Page);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading T-Tech & Appliances...</p>
        </div>
      </div>
    );
  }

  // Public pages (no navbar)
  if (currentPage === 'login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onNavigate={handleNavigate} />;
  }

  // Protected pages (with navbar)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'products' && <ProductsPage onNavigate={handleNavigate} />}
      {currentPage === 'product-detail' && (
        <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
      )}
      {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
      {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
      {currentPage === 'orders' && <OrdersPage onNavigate={handleNavigate} />}
      {currentPage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
      {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
      {currentPage === 'admin-products' && <AdminProducts onNavigate={handleNavigate} />}
      {currentPage === 'admin-orders' && <AdminOrders onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}
