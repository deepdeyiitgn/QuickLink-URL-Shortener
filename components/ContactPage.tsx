import React, { useState, useContext } from 'react';
import { LoadingIcon, CheckIcon } from './icons/IconComponents';
import SocialLinks from './SocialLinks';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types';
import { api } from '../api';

const ContactPage: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, openAuthModal, openTicketModal } = auth || {};

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setError('');
        try {
            await api.createTicket({
                userName: name,
                userEmail: email,
                phone: phone || undefined,
                subject,
                message,
                userId: null,
            });
            setStatus('success');
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            setStatus('error');
        }
    };
    
    if (currentUser) {
        return (
            <div className="text-center space-y-12">
                 <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">Contact Support</h1>
                 <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    As a logged-in user, you can create a support ticket to track your inquiry. Our team will respond as soon as possible, and you'll be notified of any updates.
                </p>
                <div className="glass-card p-8 rounded-2xl max-w-lg mx-auto">
                    <button onClick={openTicketModal} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-lg font-semibold text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:bg-brand-primary/80">
                        Create a Support Ticket
                    </button>
                </div>
                <div className="max-w-5xl mx-auto">
                     <h2 className="text-3xl font-bold text-white">Or, Connect with Us Directly</h2>
                    <p className="text-gray-400 mt-2 mb-6">For general questions or community chat, find us on our social platforms.</p>
                    <SocialLinks />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">Get in Touch</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Have a question or feedback? We'd love to hear from you. Submitting this form will create a support ticket. You can also <button onClick={() => auth?.openAuthModal('login')} className="text-brand-primary hover:underline">log in</button> to track your tickets.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
                <div className="glass-card p-6 md:p-8 rounded-2xl">
                     {status === 'success' ? (
                        <div className="text-center py-10">
                            <CheckIcon className="h-16 w-16 text-green-400 mx-auto animate-check-pop" />
                            <h3 className="text-2xl font-bold text-white mt-4">Message Sent!</h3>
                            <p className="text-gray-300 mt-2">Thank you for reaching out. A support ticket has been created, and our team will get back to you at {email} as soon as possible.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number (Optional)</label>
                                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary" />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} required className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary"></textarea>
                            </div>
                            <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:bg-brand-primary/80 disabled:opacity-50">
                                {status === 'loading' ? <LoadingIcon className="animate-spin h-5 w-5" /> : 'Send Message'}
                            </button>
                            {status === 'error' && <p className="text-red-400 text-sm text-center">{error}</p>}
                        </form>
                    )}
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
                        <h3 className="text-xl font-semibold text-brand-primary mb-2">Business Inquiries</h3>
                        <p className="text-gray-400">For partnerships and business-related questions, please email us at:</p>
                        <a href="mailto:business@quicklink.app" className="text-brand-secondary hover:underline">business@quicklink.app</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;