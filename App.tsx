
import React, { Suspense, lazy, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { UrlProvider } from './contexts/UrlContext';
import { QrProvider } from './contexts/QrContext';
import { BlogProvider } from './contexts/BlogContext';

import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import ApiSubscriptionModal from './components/ApiSubscriptionModal';
import FullScreenLoader from './components/FullScreenLoader';
import MobileNavButton from './components/MobileNavButton';
import BackToTopButton from './components/BackToTopButton';
import UserDetailsFetcher from './components/UserDetailsFetcher';
import AdBlockerModal from './components/AdBlockerModal';
import NotificationPermissionPrompt from './components/NotificationPermissionPrompt';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./components/LandingPage'));
const ToolSelectionPage = lazy(() => import('./components/ToolSelectionPage'));
const ShortenerPage = lazy(() => import('./components/ShortenerPage'));
const QrGeneratorPage = lazy(() => import('./components/QrGeneratorPage'));
const ScannerPage = lazy(() => import('./components/ScannerPage'));
const ApiAccessPage = lazy(() => import('./components/ApiAccessPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const CancellationPolicyPage = lazy(() => import('./components/CancellationPolicyPage'));
const CookiesPolicyPage = lazy(() => import('./components/CookiesPolicyPage'));
const StatusPage = lazy(() => import('./components/StatusPage'));
const FaqPage = lazy(() => import('./components/FaqPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const RedirectPage = lazy(() => import('./components/RedirectPage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const BlogCreatePage = lazy(() => import('./components/BlogCreatePage'));
const BlogPostPageWrapper = lazy(() => import('./components/BlogPostPage'));
const DonationPage = lazy(() => import('./components/DonationPage'));
const NotificationsPage = lazy(() => import('./components/NotificationsPage'));
const ShopPage = lazy(() => import('./components/ShopPage'));
const AdComponent = lazy(() => import('./components/AdComponent'));

const AppContent: React.FC = () => {
    const auth = useContext(AuthContext);
    const location = useLocation();
    const [firstLoad, setFirstLoad] = useState(true);
    const [showAdBlockerModal, setShowAdBlockerModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFirstLoad(false), 2000); // Simulate loading time
        
        // Adblocker detection logic
        const adBlockerCheck = async () => {
            try {
                // Fetch a dummy ad script. If it fails, an adblocker is likely present.
                await fetch(new Request("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
                    method: 'HEAD',
                    mode: 'no-cors'
                }));
            } catch (error) {
                // If the fetch fails, set up the recurring modal.
                setInterval(() => {
                    setShowAdBlockerModal(true);
                }, 300000); // Every 5 minutes
            }
        };

        adBlockerCheck();

        return () => clearTimeout(timer);
    }, []);

    const adFreeRoutes = ['/dashboard', '/api-access'];
    const showSidebarAd = !adFreeRoutes.some(path => location.pathname.startsWith(path));

    if (firstLoad) return <FullScreenLoader />;

    return (
        <div className="flex flex-col min-h-screen gradient-bg text-white font-sans">
            <Header />
            {auth?.isFetchingDetails && <UserDetailsFetcher />}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex gap-8">
                    <div className="flex-grow">
                        <Suspense fallback={<div className="text-center py-20"><FullScreenLoader /></div>}>
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/tools" element={<ToolSelectionPage />} />
                                <Route path="/shortener" element={<ShortenerPage />} />
                                <Route path="/qr-generator" element={<QrGeneratorPage />} />
                                <Route path="/qr-scanner" element={<ScannerPage />} />
                                <Route path="/api-access" element={<ApiAccessPage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                                <Route path="/terms" element={<TermsPage />} />
                                <Route path="/cancellation" element={<CancellationPolicyPage />} />
                                <Route path="/cookies" element={<CookiesPolicyPage />} />
                                <Route path="/status" element={<StatusPage />} />
                                <Route path="/faq" element={<FaqPage />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/blog" element={<BlogPage />} />
                                <Route path="/blog/create" element={<BlogCreatePage />} />
                                <Route path="/blog/post/:postId" element={<BlogPostPageWrapper />} />
                                <Route path="/donate" element={<DonationPage />} />
                                <Route path="/notifications" element={<NotificationsPage />} />
                                <Route path="/shop" element={<ShopPage />} />
                                <Route path="/:alias" element={<RedirectPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </Suspense>
                    </div>
                    {showSidebarAd && (
                        <aside className="hidden lg:block w-48 flex-shrink-0">
                            <div className="sticky top-24">
                                <AdComponent type="display" />
                            </div>
                        </aside>
                    )}
                </div>
            </main>
            <Footer />
            {auth?.isAuthModalOpen && <AuthModal />}
            {auth?.isSubscriptionModalOpen && <SubscriptionModal onClose={auth.closeSubscriptionModal} />}
            {auth?.isApiSubscriptionModalOpen && <ApiSubscriptionModal onClose={auth.closeApiSubscriptionModal} />}
            {showAdBlockerModal && <AdBlockerModal onClose={() => setShowAdBlockerModal(false)} />}
            <MobileNavButton />
            <BackToTopButton />
            <NotificationPermissionPrompt />
            <div id="portal-root"></div>
        </div>
    );
};

const App: React.FC = () => (
    <Router>
        <AuthProvider>
            <UrlProvider>
                <QrProvider>
                    <BlogProvider>
                        <AppContent />
                    </BlogProvider>
                </QrProvider>
            </UrlProvider>
        </AuthProvider>
    </Router>
);

export default App;
