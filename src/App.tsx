import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { OrderModal } from './components/OrderModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LocationsPage } from './pages/LocationsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SafetyMSDSPage } from './pages/SafetyMSDSPage';
import { RefundsPage } from './pages/RefundsPage';

const ROUTES = [
  '/',
  '/products',
  '/how-it-works',
  '/locations',
  '/contact',
  '/admin',
  '/privacy',
  '/terms',
  '/safety',
  '/refunds'
];

function getCurrentPath(): string {
  // Backward compat: migrate old #/products style hashes to clean paths
  const hashRoute = window.location.hash.replace(/^#/, '');
  if (hashRoute.startsWith('/')) {
    return ROUTES.includes(hashRoute) ? hashRoute : '/';
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  return ROUTES.includes(pathname) ? pathname : '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalSize, setOrderModalSize] = useState<number>(500);

  // Browser-router style navigation (History API) — no hash.
  // Server must fall back to index.html on cPanel (see .htaccess).
  useEffect(() => {
    const applyCurrentPath = () => {
      const path = getCurrentPath();
      setCurrentPath(path);
      // One-time migration: strip legacy hash so the URL is clean
      if (window.location.hash) {
        window.history.replaceState(null, '', path);
      }
    };

    const handlePopState = () => {
      setCurrentPath(getCurrentPath());
    };

    applyCurrentPath();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    const target = ROUTES.includes(path) ? path : '/';
    if (target !== window.location.pathname) {
      window.history.pushState(null, '', target);
    }
    setCurrentPath(target);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleOpenOrderModal = (sizeMl: number = 500) => {
    setOrderModalSize(sizeMl);
    setOrderModalOpen(true);
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigateTo} onOpenOrderModal={handleOpenOrderModal} />;
      case '/products':
        return <ProductsPage onNavigate={navigateTo} onOpenOrderModal={handleOpenOrderModal} />;
      case '/how-it-works':
        return <HowItWorksPage onNavigate={navigateTo} onOpenOrderModal={handleOpenOrderModal} />;
      case '/locations':
        return <LocationsPage onNavigate={navigateTo} onOpenOrderModal={handleOpenOrderModal} />;
      case '/contact':
        return <ContactPage onNavigate={navigateTo} onOpenOrderModal={handleOpenOrderModal} />;
      case '/admin':
        return <AdminPage onNavigate={navigateTo} />;
      case '/privacy':
        return <PrivacyPage onNavigate={navigateTo} />;
      case '/terms':
        return <TermsPage onNavigate={navigateTo} />;
      case '/safety':
        return <SafetyMSDSPage onNavigate={navigateTo} />;
      case '/refunds':
        return <RefundsPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} onOpenOrderModal={handleOpenOrderModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-bug-pattern text-slate-900 flex flex-col font-sans relative selection:bg-red-500 selection:text-white">
      {/* Scroll to top component on route transition */}
      <ScrollToTop currentPath={currentPath} />

      {/* Main Glassmorphism Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenOrderModal={handleOpenOrderModal}
      />

      {/* Page Content View */}
      <main className="flex-1 pb-16">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Quick Checkout / Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        selectedSizeMl={orderModalSize}
      />
    </div>
  );
}
