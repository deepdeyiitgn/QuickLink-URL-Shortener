import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { UrlProvider, UrlContext } from './contexts/UrlContext';
import { QrProvider } from './contexts/QrContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import ApiSubscriptionModal from './components/ApiSubscriptionModal';
import RedirectPage from './components/RedirectPage';
import BackToTopButton from './components/BackToTopButton';
import QrCodeGenerator from './components/QrCodeGenerator';
import StatusPage from './components/StatusPage';
import OwnerDashboard from './components/OwnerDashboard';
import ApiAccessPage from './components/ApiAccessPage';
import Watermark from './components/Watermark';
import NotFoundPage from './components/NotFoundPage';
import SocialLinks from './components/SocialLinks';
import LandingPage from './components/LandingPage';
import ToolSelectionPage from './components/ToolSelectionPage';
import ShortenerPage from './components/ShortenerPage';
import ScannerPage from './components/ScannerPage';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsPage from './components/TermsPage';
import MobileBottomNav from './components/MobileBottomNav';
import type { User } from './types';

interface AppContentProps {
  currentUser: User | null;
  isAuthModalOpen: boolean;
  isSubscriptionModalOpen: boolean;
  isApiSubscriptionModalOpen: boolean;
  closeSubscriptionModal: () => void;
  closeApiSubscriptionModal: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ isAuthModalOpen, isSubscriptionModalOpen, isApiSubscriptionModalOpen, closeSubscriptionModal, closeApiSubscriptionModal }) => {
    const urlContext = useContext(UrlContext);
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const onLocationChange = () => {
            setPath(window.location.pathname);
        };
        // This handles browser back/forward navigation
        window.addEventListener('popstate', onLocationChange);

        // This handles link clicks to prevent full page reloads
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (anchor && anchor.target !== '_blank' && anchor.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const newPath = new URL(anchor.href).pathname;
                if (newPath !== window.location.pathname) {
                    window.history.pushState({}, '', newPath);
                    onLocationChange();
                }
            }
        };
        document.addEventListener('click', handleLinkClick);

        return () => {
            window.removeEventListener('popstate', onLocationChange);
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    if (urlContext?.loading) {
        return <div className="min-h-screen bg-brand-dark" />;
    }

    const renderView = () => {
        const cleanPath = path.substring(1);
        
        const specialRoutes: Record<string, React.ReactNode> = {
            '': <LandingPage />,
            'tools': <ToolSelectionPage />,
            'shortener': <ShortenerPage />,
            'qr-generator': <QrCodeGenerator />,
            'qr-scanner': <ScannerPage />,
            'about': <AboutPage />,
            'privacy': <PrivacyPolicyPage />,
            'terms': <TermsPage />,
            'dashboard': <Dashboard />,
            'status': <StatusPage />,
            'owner': <OwnerDashboard />,
            'api': <ApiAccessPage />,
        };

        if (specialRoutes.hasOwnProperty(cleanPath)) {
            return specialRoutes[cleanPath];
        }

        const urlToRedirect = urlContext?.allUrls.find(u => u.alias === cleanPath);
        
        if (urlToRedirect) {
            const isExpired = urlToRedirect.expiresAt !== null && urlToRedirect.expiresAt < Date.now();
            if (isExpired) {
                return <NotFoundPage />;
            }
            // Construct the full short URL for the redirect page
            const fullShortUrl = `${window.location.origin}/${urlToRedirect.alias}`;
            return <RedirectPage longUrl={urlToRedirect.longUrl} shortUrl={fullShortUrl} />;
        }

        return <NotFoundPage />;
    };
    
    const cleanPath = path.substring(1);

    return (
        <div className="gradient-bg min-h-screen text-white font-sans selection:bg-brand-primary selection:text-brand-dark">
            <div className="relative z-10">
                <Header currentView={cleanPath} />
                <main className="container mx-auto px-4 py-12 md:py-20 pb-24 md:pb-20">
                    {renderView()}
                </main>
                <footer className="py-12 border-t border-white/10">
                    <div className="container mx-auto px-4 text-center">
                        <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mb-4">
                           <a href="/about" className="text-sm text-gray-400 hover:text-brand-primary transition-colors">About</a>
                           <a href="/privacy" className="text-sm text-gray-400 hover:text-brand-primary transition-colors">Privacy Policy</a>
                           <a href="/terms" className="text-sm text-gray-400 hover:text-brand-primary transition-colors">Terms of Service</a>
                           <a href="/status" className="text-sm text-gray-400 hover:text-brand-primary transition-colors">Status</a>
                        </div>
                        <SocialLinks />
                        <Watermark />
                    </div>
                </footer>
            </div>
            {isAuthModalOpen && <AuthModal />}
            {isSubscriptionModalOpen && <SubscriptionModal onClose={closeSubscriptionModal} />}
            {isApiSubscriptionModalOpen && <ApiSubscriptionModal onClose={closeApiSubscriptionModal} />}
            <BackToTopButton />
            <MobileBottomNav currentView={cleanPath} />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <UrlProvider>
                <QrProvider>
                    <AuthContext.Consumer>
                        {auth => auth ? (
                            <AppContent 
                                currentUser={auth.currentUser}
                                isAuthModalOpen={auth.isAuthModalOpen}
                                isSubscriptionModalOpen={auth.isSubscriptionModalOpen}
                                isApiSubscriptionModalOpen={auth.isApiSubscriptionModalOpen}
                                closeSubscriptionModal={auth.closeSubscriptionModal}
                                closeApiSubscriptionModal={auth.closeApiSubscriptionModal}
                            />
                        ) : null}
                    </AuthContext.Consumer>
                </QrProvider>
            </UrlProvider>
        </AuthProvider>
    );
};

export default App;
