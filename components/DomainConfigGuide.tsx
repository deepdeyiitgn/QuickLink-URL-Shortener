import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-black/40 p-4 rounded-md text-sm text-gray-300 font-mono mt-1 overflow-x-auto">
        <code>{children}</code>
    </pre>
);

const DomainConfigGuide: React.FC = () => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Using a Custom Domain</h2>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                    Add a professional touch to your short links by using your own domain. (e.g., `link.mybrand.com`). This feature is hypothetical for this demo app but here's how it would work.
                </p>
            </div>

            <div className="space-y-6 text-gray-300">
                <div>
                    <h3 className="text-xl font-semibold text-brand-primary mb-2">Step 1: Get a Domain</h3>
                    <p>
                        First, you need to own a domain name. If you don't have one, you can purchase one from registrars like GoDaddy, Namecheap, or Google Domains. For this example, let's assume you own `mybrand.com`.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-brand-primary mb-2">Step 2: Configure DNS Records</h3>
                    <p>
                        You'll need to point your domain (or a subdomain) to the QuickLink servers. This is done by adding a DNS record in your domain registrar's settings.
                    </p>
                    <p className="mt-2">
                        You would add a <strong className="text-white">CNAME</strong> record pointing your desired subdomain (like `link.mybrand.com`) to our service endpoint.
                    </p>
                    <CodeBlock>
                        Type: CNAME
                        <br />
                        Host/Name: link  (or whatever subdomain you want)
                        <br />
                        Value/Target: custom.quicklink.app
                    </CodeBlock>
                    <p className="text-xs text-gray-500 mt-2">
                        Note: DNS changes can take up to 48 hours to propagate across the internet.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-brand-primary mb-2">Step 3: Add Your Domain in QuickLink</h3>
                    <p>
                        Once your DNS is set up, you would come back to your QuickLink dashboard (in a real-world scenario) and add your custom domain in the settings. Our system would then verify that the DNS records are pointing correctly and issue an SSL certificate for your domain to ensure all links are secure (HTTPS).
                    </p>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold text-brand-primary mb-2">Step 4: Start Shortening!</h3>
                    <p>
                        After verification, a new option would appear in the URL shortener allowing you to select your custom domain. All new links created with that domain will be branded, like `link.mybrand.com/my-alias`.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DomainConfigGuide;
