import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            <div className="max-w-3xl mx-auto text-gray-300">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Privacy Policy</h1>
                <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

                <p className="mb-6">
                    This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                </p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Interpretation and Definitions</h2>
                <p className="mb-4">The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Collecting and Using Your Personal Data</h2>
                <h3 className="text-xl font-semibold text-white mt-4 mb-2">Types of Data Collected</h3>
                <p className="mb-2"><strong>Personal Data:</strong> While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
                <ul className="list-disc list-inside mb-4 pl-4 space-y-1">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Usage Data</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-4 mb-2">Use of Your Personal Data</h3>
                <p className="mb-2">The Company may use Personal Data for the following purposes:</p>
                <ul className="list-disc list-inside mb-4 pl-4 space-y-1">
                    <li><strong>To provide and maintain our Service,</strong> including to monitor the usage of our Service.</li>
                    <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
                    <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
                    <li><strong>To contact You:</strong> To contact You by email regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Security of Your Personal Data</h2>
                <p className="mb-6">The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
                
                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Changes to this Privacy Policy</h2>
                <p className="mb-6">We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-8 mb-4">Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, You can contact us by visiting the contact links on this page.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
