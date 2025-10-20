// FIX: Correct import path for AuthContext
import React, { useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { UrlProvider } from './contexts/UrlContext';
import { QrProvider } from './contexts/QrContext';
import { BlogProvider } from './contexts/BlogContext';
// FIX: Add type import for AuthContextType
import type { AuthContextType } from './types';

import Header from './components/Header';
// import Footer from './components/Footer'; // Will be defined below
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import ApiSubscriptionModal from './components/ApiSubscriptionModal';
import FullScreenLoader from './components/FullScreenLoader';
import NotFoundPage from './components/NotFoundPage';
import RedirectPage from './components/RedirectPage'; // Assuming this component exists for redirection logic
import BackToTopButton from './components/BackToTopButton';
import TicketModal from './components/TicketModal'; // Added for support tickets

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./components/LandingPage'));
const ToolSelectionPage = lazy(() => import('./components/ToolSelectionPage'));
const ShortenerPage = lazy(() => import('./components/ShortenerPage'));
const QrGeneratorPage = lazy(() => import('./components/QrGeneratorPage'));
const ScannerPage = lazy(() => import('./components/ScannerPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const ApiAccessPage = lazy(() => import('./components/ApiAccessPage'));
const StatusPage = lazy(() => import('./components/StatusPage'));
const FaqPage = lazy(() => import('./components/FaqPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const DonationPage = lazy(() => import('./components/DonationPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const BlogCreatePage = lazy(() => import('./components/BlogCreatePage'));
const BlogPostPage = lazy(() => import('./components/BlogPostPage'));
const NotificationsPage = lazy(() => import('./components/NotificationsPage'));
const ShopPage = lazy(() => import('./components/ShopPage'));

// A wrapper to handle redirection logic based on alias in URL
const MainContent: React.FC = () => {
    // In a real app, you would fetch the URL mapping. Here we simulate it.
    // This logic would typically be on a server-side route catcher `/[alias]`.
    // For this client-side demo, we'll just show the main app.
    const location = useLocation();

    // Example of a client-side redirect (not ideal for production URL shorteners)
    if (location.pathname === '/example') {
        return <RedirectPage longUrl="https://example.com" shortUrl={`${window.location.origin}/example`} />;
    }
    
    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            <Suspense fallback={<FullScreenLoader />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/tools" element={<ToolSelectionPage />} />
                    <Route path="/shortener" element={<ShortenerPage />} />
                    <Route path="/qr-generator" element={<QrGeneratorPage />} />
                    <Route path="/qr-scanner" element={<ScannerPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/api-access" element={<ApiAccessPage />} />
                    <Route path="/status" element={<StatusPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/donate" element={<DonationPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/new" element={<BlogCreatePage />} />
                    <Route path="/blog/post/:slug" element={<BlogPostRouter />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </main>
    );
};

const BlogPostRouter = () => {
    const { slug } = useParams<{ slug: string }>();
    return <BlogPostPage postSlug={slug!} />;
};

const AppModals: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    if (!auth) return null;
    return (
        <>
            <AuthModal />
            {auth.isTicketModalOpen && <TicketModal onClose={auth.closeTicketModal} />}
            {auth.isSubscriptionModalOpen && <SubscriptionModal onClose={auth.closeSubscriptionModal} />}
            {auth.isApiSubscriptionModalOpen && <ApiSubscriptionModal onClose={auth.closeApiSubscriptionModal} />}
        </>
    );
}

const App: React.FC = () => {
  return (
    <Router>
        <AuthProvider>
            <UrlProvider>
                <QrProvider>
                    <BlogProvider>
                        <div className="min-h-screen flex flex-col gradient-bg text-white font-sans">
                            <Header />
                            <MainContent />
                            <Footer />
                            <AppModals />
                            <BackToTopButton />
                        </div>
                    </BlogProvider>
                </QrProvider>
            </UrlProvider>
        </AuthProvider>
    </Router>
  );
};

// Dummy component until it's provided.
const Footer: React.FC = () => {
    return <footer></footer>;
}

// FIX: Removed dummy useParams as it's now imported from react-router-dom

// FIX: Removed dummy QrGeneratorPage as it is properly imported now.


export default App;