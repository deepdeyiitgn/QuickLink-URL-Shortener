import React, { useState } from 'react';
import { LoadingIcon, CheckIcon } from './icons/IconComponents';
import SocialLinks from './SocialLinks';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // This is a mock submission. In a real app, this would call an API endpoint.
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            // In a real app, you would use a service like api.createTicket()
            console.log({ name, email, message });
            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">Get in Touch</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Have a question, feedback, or a collaboration idea? We'd love to hear from you.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
                <div className="glass-card p-6 md:p-8 rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="contact-input" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="contact-input" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} required className="contact-input"></textarea>
                        </div>
                        <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:bg-brand-primary/80 disabled:opacity-50">
                            {status === 'loading' && <LoadingIcon className="animate-spin h-5 w-5" />}
                            {status === 'success' && <CheckIcon className="h-5 w-5" />}
                            {status === 'success' ? 'Message Sent!' : 'Send Message'}
                        </button>
                        {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
                    </form>
                </div>
                <div className="space-y-6 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-white">Connect with Us</h2>
                    <p className="text-gray-400">
                        For a faster response, you can also reach out to us on our social media platforms. We're active and ready to chat!
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <SocialLinks />
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold text-brand-primary mb-2">Contact Us</h3>
                        <p className="text-gray-400">For general inquiries and support, please email us at:</p>
                        <a href="mailto:contact@deepdeyiitk.com" className="text-brand-secondary hover:underline">contact@deepdeyiitk.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;