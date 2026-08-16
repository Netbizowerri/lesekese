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

const SITE_URL = 'https://www.lesekeseproducts.com';

const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: "LESEKESE® | Nigeria's #1 Bedbug & Cockroach Instant Killer",
    description:
      'Hotter Than Fire. Tougher Than Pests. LESEKESE kills bedbugs, cockroaches, mosquitoes and household pests on contact with 3+ days residual protection. Order via WhatsApp or find a distributor near you.'
  },
  '/products': {
    title: 'LESEKESE Products & Prices | 100ml, 250ml, 500ml Instant Insecticide',
    description:
      'Browse LESEKESE instant killer sizes — 100ml, 250ml and 500ml heavy duty. Kills bedbugs, cockroaches and household pests on contact. Bulk and wholesale pricing available nationwide.'
  },
  '/how-it-works': {
    title: 'How LESEKESE Works | Instant Knockdown vs. Traditional Insecticide',
    description:
      'See how LESEKESE delivers instant knockdown and 3+ days of residual protection against bedbugs, cockroaches and household pests — and how to apply it safely.'
  },
  '/locations': {
    title: 'Find LESEKESE Distributors & Stores in Nigeria | Lagos, Abuja, Port Harcourt',
    description:
      'Locate an authorised LESEKESE distributor near you. Stockists across Lagos (Fagba, Ikeja, Surulere, Lekki), Abuja Wuse II and Port Harcourt Garrison.'
  },
  '/contact': {
    title: 'Contact LESEKESE | Bulk Orders, Distribution & Customer Support',
    description:
      'Reach LESEKESE for bulk orders, retailer and distributor applications, or support. Call or WhatsApp 0802 372 5740, or send an inquiry — dispatched within 24–48 hours.'
  },
  '/admin': {
    title: 'LESEKESE Admin Dashboard | Lead Management',
    description: 'Authorised LESEKESE team dashboard for managing leads and distributor inventory.'
  },
  '/privacy': {
    title: 'Privacy Policy | LESEKESE Products',
    description: "How LESEKESE collects, uses and protects your personal information."
  },
  '/terms': {
    title: 'Terms of Service | LESEKESE Products',
    description: 'The terms governing use of the LESEKESE website, ordering and distribution services.'
  },
  '/safety': {
    title: 'Safety Data Sheet & Usage Guide | LESEKESE',
    description: 'Read LESEKESE safety data, handling instructions, first aid measures and safe usage guidelines for home and business.'
  },
  '/refunds': {
    title: 'Refund & Replacement Policy | LESEKESE Products',
    description: 'LESEKESE refund and replacement policy for defective products and order issues.'
  }
};

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

  // Per-route SEO metadata (title, description, canonical, OG)
  useEffect(() => {
    const meta = ROUTE_META[currentPath] ?? ROUTE_META['/'];
    const canonicalUrl = `${SITE_URL}${currentPath === '/' ? '/' : currentPath}`;

    document.title = meta.title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', meta.description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [currentPath]);

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
