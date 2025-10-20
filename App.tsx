

import React, { useContext, lazy, Suspense, useState, useEffect } from 'react';
// FIX: Changed single quotes to double quotes for the import.
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { UrlProvider, UrlContext } from './contexts/UrlContext';
import { QrProvider } from './contexts/QrContext';
import { BlogProvider } from './contexts/BlogContext';
import type { AuthContextType, ShortenedUrl } from './types';

import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import ApiSubscriptionModal from './components/ApiSubscriptionModal';
import FullScreenLoader from './components/FullScreenLoader';
import RedirectPage from './components/RedirectPage';
import BackToTopButton from './components/BackToTopButton';
import { LoadingIcon } from './components/icons/IconComponents';

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
const ShopPage = lazy(() => import('./components/ShopPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const BlogCreatePage = lazy(() => import('./components/BlogCreatePage'));
const BlogPostPage = lazy(() => import('./components/BlogPostPage'));
const CancellationPolicyPage = lazy(() => import('./components/CancellationPolicyPage'));
const CookiesPolicyPage = lazy(() => import('./components/CookiesPolicyPage'));
const NotificationsPage = lazy(() => import('./components/NotificationsPage'));
const TrueNotFoundPage = lazy(() => import('./components/NotFoundPage'));

// This component handles the core logic for redirection vs. showing a 404 page.
const AliasHandler: React.FC = () => {
    const location = useLocation();
    const urlContext = useContext(UrlContext);
    const [status, setStatus] = useState<'loading' | 'found' | 'notfound'>('loading');
    const [targetUrl, setTargetUrl] = useState<ShortenedUrl | null>(null);

    useEffect(() => {
        if (urlContext && !urlContext.loading) {
            const alias = location.pathname.substring(1).toLowerCase();
            if (!alias) { // Handle root path explicitly if it ever falls through
                setStatus('notfound');
                return;
            }
            const foundUrl = urlContext.allUrls.find(u => u.alias.toLowerCase() === alias && (u.expiresAt === null || u.expiresAt > Date.now()));
            
            if (foundUrl) {
                setTargetUrl(foundUrl);
                setStatus('found');
            } else {
                setStatus('notfound');
            }
        }
    }, [location.pathname, urlContext]);

    if (status === 'loading' || !urlContext) {
        return <div className="text-center py-20"><LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" /></div>;
    }

    if (status === 'found' && targetUrl) {
        return <RedirectPage longUrl={targetUrl.longUrl} shortUrl={targetUrl.shortUrl} />;
    }
    
    return <TrueNotFoundPage />;
};


// A wrapper to handle redirection logic based on alias in URL
const MainContent: React.FC = () => {
    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            <Suspense fallback={<div className="w-full h-96 flex justify-center items-center"><LoadingIcon className="h-8 w-8 animate-spin text-brand-primary" /></div>}>
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
                    <Route path="/cancellation" element={<CancellationPolicyPage />} />
                    <Route path="/cookies" element={<CookiesPolicyPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/new" element={<BlogCreatePage />} />
                    <Route path="/blog/post/:postId" element={<BlogPostRouter />} />
                    <Route path="*" element={<AliasHandler />} />
                </Routes>
            </Suspense>
        </main>
    );
};

const BlogPostRouter = () => {
    const { postId } = useParams<{ postId: string }>();
    return <BlogPostPage postId={postId!} />;
};

const AppModals: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    if (!auth) return null;
    return (
        <>
            <AuthModal />
            {auth.isSubscriptionModalOpen && <SubscriptionModal onClose={auth.closeSubscriptionModal} />}
            {auth.isApiSubscriptionModalOpen && <ApiSubscriptionModal onClose={auth.closeApiSubscriptionModal} />}
        </>
    );
}

const App: React.FC = () => {
    const [isAppLoading, setAppLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            setTimeout(() => setAppLoading(false), 1000);
        };
        window.addEventListener('load', handleLoad);
        const fallback = setTimeout(() => setAppLoading(false), 2000);
        return () => {
            window.removeEventListener('load', handleLoad);
            clearTimeout(fallback);
        };
    }, []);

    if (isAppLoading) {
        return <FullScreenLoader />;
    }

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

export default App;
