import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { CopyIcon, CheckIcon, LoadingIcon, EyeIcon, EyeSlashIcon } from './icons/IconComponents';
import DomainConfigGuide from './DomainConfigGuide';
import { AuthContextType } from '../types';

const ApiAccessPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const { currentUser, generateApiKey, openApiSubscriptionModal } = auth || {};
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleGenerateKey = async () => {
        setIsGenerating(true);
        if (generateApiKey) {
            await generateApiKey();
        }
        setIsGenerating(false);
    };
    
    if (!currentUser) {
         return (
            <div className="glass-card p-8 rounded-2xl text-center">
                <h2 className="text-2xl font-bold text-white">API Access</h2>
                <p className="text-gray-400 mt-2">Please <button onClick={() => auth?.openAuthModal('login')} className="text-brand-primary hover:underline">log in</button> to manage your API key.</p>
            </div>
        )
    }

    const endpoint = `${window.location.origin}/api/v1/st`;
    const curlExample = `curl -X POST ${endpoint} \\\n     -H "Authorization: Bearer ${currentUser.apiAccess?.apiKey || 'YOUR_API_KEY'}" \\\n     -H "Content-Type: application/json" \\\n     -d '{\n          "longUrl": "https://example.com/very/long/url",\n          "alias": "custom-alias-optional"\n        }'`;

    return (
        <div className="space-y-8">
            <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Developer API Access</h2>
                    <p className="text-gray-400 mt-2">Integrate QuickLink into your own applications.</p>
                </div>
                
                <div className="p-6 bg-black/30 rounded-lg border border-white/10">
                    <h3 className="font-semibold text-lg text-white mb-2">Your API Key</h3>
                    {currentUser.apiAccess ? (
                        <>
                            <div className="flex items-center gap-2 bg-black/40 p-3 rounded-md">
                                <input
                                    type={isKeyVisible ? 'text' : 'password'}
                                    readOnly
                                    value={currentUser.apiAccess.apiKey}
                                    className="flex-grow font-mono text-gray-400 bg-transparent border-none focus:ring-0 p-0"
                                    aria-label="Your API Key"
                                />
                                <button 
                                    onClick={() => setIsKeyVisible(!isKeyVisible)} 
                                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/10"
                                    aria-label={isKeyVisible ? 'Hide API Key' : 'Show API Key'}
                                >
                                    {isKeyVisible ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                                <button 
                                    onClick={() => handleCopy(currentUser.apiAccess?.apiKey || '')} 
                                    className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 rounded-md hover:bg-white/20"
                                >
                                    {copied ? <CheckIcon className="h-4 w-4 text-green-400"/> : <CopyIcon className="h-4 w-4"/>}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <p className="text-sm text-gray-400 mt-4">Your current plan: <span className="font-bold text-brand-primary capitalize">{currentUser.apiAccess.subscription.planId}</span></p>
                            <p className="text-xs text-gray-500">Expires on: {new Date(currentUser.apiAccess.subscription.expiresAt).toLocaleDateString()}</p>
                            <button onClick={() => openApiSubscriptionModal && openApiSubscriptionModal()} className="mt-4 text-sm font-semibold text-green-400 hover:underline">
                                Upgrade Plan
                            </button>
                        </>
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-gray-400 mb-4">You have not generated an API key yet. Get a free 1-month trial key now.</p>
                            <button onClick={handleGenerateKey} disabled={isGenerating} className="px-6 py-3 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80 transition-colors disabled:opacity-50 shadow-[0_0_10px_#00e5ff]">
                                {isGenerating ? <LoadingIcon className="h-5 w-5 animate-spin"/> : 'Generate Free Trial Key'}
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">API Documentation</h3>
                    <div className="space-y-4 p-6 bg-black/30 rounded-lg border border-white/10">
                        <div>
                            <p className="font-semibold text-gray-300">Endpoint:</p>
                            <code className="block bg-black/40 p-2 rounded-md text-brand-secondary font-mono mt-1">POST {endpoint}</code>
                            <p className="text-xs text-gray-500 mt-1">This endpoint connects to our live MongoDB backend.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-300">Headers:</p>
                            <ul className="list-disc list-inside text-sm text-gray-400 mt-1">
                                <li><code className="text-gray-300">Authorization: Bearer YOUR_API_KEY</code></li>
                                <li><code className="text-gray-300">Content-Type: application/json</code></li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-300">Example Request:</p>
                            <pre className="bg-black/40 p-4 rounded-md text-sm text-gray-300 font-mono mt-1 overflow-x-auto">
                                <code>{curlExample}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
            <DomainConfigGuide />
        </div>
    );
};

export default ApiAccessPage;
