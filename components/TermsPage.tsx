import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            <div className="max-w-3xl mx-auto text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Terms of Service</h1>
                <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
                
                <p className="mb-6">
                    Please read these terms and conditions carefully before using Our Service.
                </p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Acknowledgment</h2>
                <p className="mb-4">
                    These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                </p>
                <p className="mb-6">
                    Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
                </p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">User Accounts</h2>
                <p className="mb-4">
                    When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
                </p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Links to Other Websites</h2>
                <p className="mb-6">
                    Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company. The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
                </p>
                
                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Termination</h2>
                <p className="mb-6">
                    We may terminate or suspend Your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                </p>
                
                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">"As Is" and "As Available" Disclaimer</h2>
                <p className="mb-6">
                    The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service.
                </p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Changes to These Terms and Conditions</h2>
                <p className="mb-6">
                    We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect.
                </p>

                 <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Contact Us</h2>
                <p>If you have any questions about these Terms, You can contact us by visiting the contact links on this page.</p>
            </div>
        </div>
    );
};

export default TermsPage;
