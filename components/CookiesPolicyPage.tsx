import React from 'react';

const CookiesPolicyPage: React.FC = () => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            <div className="max-w-4xl mx-auto text-gray-300 prose prose-invert prose-p:text-gray-300 prose-h1:text-white prose-h2:text-brand-primary legal-text">
                <h1 className="text-4xl font-bold text-white mb-6 text-center">Cookie Policy</h1>
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <p>
                    This Cookie Policy explains what cookies are and how we use them on QuickLink. You should read this policy to understand what type of cookies we use, the information we collect using cookies, and how that information is used.
                </p>

                <h2>What Are Cookies?</h2>
                <p>
                    Cookies are small text files that are stored on your browser or device by websites, apps, online media, and advertisements. They are widely used to "remember" you and your preferences, either for a single visit (through a "session cookie") or for multiple repeat visits (using a "persistent cookie"). They ensure a consistent and efficient experience for visitors and perform essential functions such as allowing users to register and remain logged in.
                </p>

                <h2>How We Use Cookies</h2>
                <p>We use cookies for a few essential purposes:</p>
                <ul>
                    <li>
                        <strong>Authentication:</strong> We use cookies to identify you when you log in to our Service. When you create an account and sign in, we store a unique ID and the time you signed in in an encrypted cookie on your browser. This cookie allows you to move from page to page within the site without having to log in again on each page.
                    </li>
                    <li>
                        <strong>Functionality & Preferences:</strong> We use cookies to store your preferences. For example, if you've interacted with a one-time popup or notification, a cookie helps us remember not to show it to you again, improving your browsing experience.
                    </li>
                     <li>
                        <strong>Security:</strong> We use cookies to help enable and support our security features, and to help us detect malicious activity.
                    </li>
                </ul>
                
                <h2>Third-Party Cookies</h2>
                <p>
                    We do not use third-party cookies for advertising or tracking purposes. Our use of cookies is strictly limited to the essential functionality of the QuickLink website itself. Our third-party payment providers (Razorpay and Cashfree) may use their own cookies during the payment process to ensure a secure and seamless transaction. We do not have access to or control over these cookies. Please review their respective privacy and cookie policies for more information.
                </p>

                <h2>Your Choices Regarding Cookies</h2>
                <p>
                    Most web browsers are set to accept cookies by default. However, you can usually choose to set your browser to remove or reject browser cookies. To do this, please follow the instructions provided by your browser which are usually located within the "Help", "Tools" or "Edit" facility.
                </p>
                <p>
                    Please be aware that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services. Because we use cookies to keep you logged in, disabling them will require you to log in every time you visit.
                </p>

                <h2>Changes to This Cookie Policy</h2>
                <p>
                    We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page. You are advised to review this policy periodically for any changes.
                </p>

                <h2>Contact Us</h2>
                <p>If you have any questions about this Cookie Policy, please contact us through the links available on our website.</p>
            </div>
        </div>
    );
};

export default CookiesPolicyPage;