import React from 'react';

const CancellationPolicyPage: React.FC = () => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            <div className="max-w-4xl mx-auto text-gray-300 prose prose-invert prose-p:text-gray-300 prose-h1:text-white prose-h2:text-brand-primary legal-text">
                <h1 className="text-4xl font-bold text-white mb-6 text-center">Cancellation & Refund Policy</h1>
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <p>
                    Thank you for subscribing to QuickLink. We appreciate your support. This policy outlines the terms regarding cancellations and refunds for our subscription services.
                </p>

                <h2>1. Nature of Service</h2>
                <p>
                    QuickLink offers one-time payments for digital subscription plans that extend the functionality of our service (e.g., longer expiration dates for links, API access). These are not recurring subscriptions. Once a payment is made for a specific duration (e.g., 1 Month, 6 Months, 1 Year), the service is activated for that entire period.
                </p>

                <h2>2. Cancellation Policy</h2>
                <p>
                    Since our subscription plans are activated via a single, one-time payment for a fixed term, there is no recurring billing to cancel. Your access will continue until the end of your paid term and will expire automatically if you do not make another payment to extend it.
                </p>

                <h2>3. Refund Policy</h2>
                <p>
                    <strong>All payments made to QuickLink for subscription plans are final and non-refundable.</strong>
                </p>
                <p>
                    Once you have paid for a subscription and the service has been activated, you have received the full benefit of the purchase. As we provide digital services that are consumed immediately upon activation, we are unable to offer refunds, pro-rated or otherwise, for any portion of your subscription term.
                </p>

                <h2>4. Exceptional Circumstances</h2>
                <p>
                    We do not provide refunds except in cases of a demonstrable technical error on our part where the service was not rendered as described after payment. If you believe you have been charged in error or have not received the service you paid for due to a technical failure from our system, please contact our support team through the channels listed on our website.
                </p>
                <p>
                    All such claims must be made within 7 days of the transaction date. We will investigate the claim and, if a technical error on our end is confirmed, we may, at our sole discretion, issue a full or partial refund.
                </p>

                 <h2>5. Contact Us</h2>
                <p>If you have any questions about our Cancellation and Refund Policy, please contact us through the social media links provided in the footer of our website.</p>
            </div>
        </div>
    );
};

export default CancellationPolicyPage;