import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            <div className="max-w-4xl mx-auto text-gray-300 prose prose-invert prose-p:text-gray-300 prose-h1:text-white prose-h2:text-brand-primary prose-h3:text-white prose-li:text-gray-300 legal-text">
                <h1 className="text-4xl font-bold text-white mb-6 text-center">Terms of Service</h1>
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <p>
                    Please read these terms and conditions (<strong>"Terms"</strong>, <strong>"Terms of Service"</strong>) carefully before using the QuickLink website (the <strong>"Service"</strong>) operated by QuickLink (<strong>"us"</strong>, <strong>"we"</strong>, or <strong>"our"</strong>).
                </p>

                <h2>1. Acknowledgment</h2>
                <p>
                    These are the Terms of Service governing the use of this Service and the agreement that operates between You and the Company. These Terms set out the rights and obligations of all users regarding the use of the Service. Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms. <strong>These Terms apply to all visitors, users, and others who access or use the Service.</strong>
                </p>
                <p>
                    By accessing or using the Service You agree to be bound by these Terms. If You disagree with any part of these Terms then You may not access the Service.
                </p>
                <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with our Privacy Policy. Please read Our Privacy Policy carefully before using Our Service.</p>

                <h2>2. User Accounts</h2>
                <p>
                    When You create an account with Us, <strong>You must provide Us with information that is accurate, complete, and current at all times.</strong> Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
                </p>
                <p>
                    <strong>You are responsible for safeguarding the password</strong> that You use to access the Service and for any activities or actions under Your password. You agree not to disclose Your password to any third party. You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account.
                </p>

                <h2>3. Acceptable Use and Content Restrictions</h2>
                <p>You agree not to use the Service to create, share, or redirect to any content that:</p>
                <ul>
                    <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
                    <li>Promotes illegal activity or contributes to the creation of viruses, malware, or any other destructive code.</li>
                    <li>Infringes on the intellectual property rights of others, including patents, copyrights, trademarks, or trade secrets.</li>
                    <li>Is used for "phishing," "spamming," or any other unsolicited advertising or promotional materials.</li>
                </ul>
                <p><strong>We reserve the right, but not the obligation, to investigate and/or terminate your account</strong> without a refund of any subscription fees if you have violated this provision, misused the Service, or behaved in a way we regard as inappropriate or unlawful.</p>

                <h2>4. Subscriptions and Payments</h2>
                <h4>Subscription</h4>
                <p>Some parts of the Service are available only with a paid Subscription. You will be billed in advance on a one-time basis for the period you select (e.g., monthly, semi-annually, yearly). All payments are handled by our third-party payment processor, Razorpay. <strong>We do not store your payment card details.</strong></p>
                <h4>Fee Changes</h4>
                <p>The Company, in its sole discretion and at any time, may modify the Subscription fees. Any Subscription fee change will become effective at the end of the then-current Billing Cycle. <strong>We are not responsible for any refunds.</strong></p>

                <h2>5. Intellectual Property</h2>
                <p>
                    The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of QuickLink and its licensors. The Service is protected by copyright, trademark, and other laws of both foreign and domestic countries. Our trademarks may not be used in connection with any product or service without the prior written consent of QuickLink.
                </p>

                <h2>6. Links to Other Websites</h2>
                <p>
                    Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company. <strong>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services.</strong> You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
                </p>

                <h2>7. Termination</h2>
                <p>
                    We may terminate or suspend Your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your right to use the Service will cease immediately.
                </p>

                <h2>8. Limitation of Liability</h2>
                <p>
                    Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service if you have purchased anything.
                </p>
                <p>
                    To the maximum extent permitted by applicable law, <strong>in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever</strong> (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service).
                </p>

                <h2>9. "As Is" and "As Available" Disclaimer</h2>
                <p>
                    The Service is provided to You <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service.
                </p>

                <h2>10. Governing Law & Disputes Resolution</h2>
                <p>The laws of the jurisdiction in which the Company is established shall govern this Terms and Your use of the Service. <strong>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.</strong></p>
                
                <h2>11. Changes to These Terms and Conditions</h2>
                <p>
                    We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. We will let you know via a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of these Terms. <strong>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms.</strong>
                </p>

                <h2>12. Advertisements and User Support</h2>
                <p>
                    This Service is supported by advertisements displayed on various pages. Revenue generated from these ads is crucial for covering server costs and allows Us to continue offering many of our core features for free. If you are unable or choose not to purchase a subscription, we kindly ask that you consider disabling your adblocker while using Our Service. This is a valuable way to support Us and helps ensure the long-term availability of the platform for everyone.
                </p>

                <h2>13. Contact Us</h2>
                <p>If you have any questions about these Terms, You can contact us by visiting the social media and contact links provided on this website.</p>
            </div>
        </div>
    );
};

export default TermsPage;