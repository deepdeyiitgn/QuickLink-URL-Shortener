import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { LoadingIcon, CheckIcon, XIcon, ShieldCheckIcon } from './icons/IconComponents';

const generateMathPuzzle = () => {
    const num1 = Math.floor(Math.random() * 15) + 5; // 5-19
    const num2 = Math.floor(Math.random() * 9) + 2; // 2-10
    const num3 = Math.floor(Math.random() * 25) + 5; // 5-29
    return {
        question: `(${num1} × ${num2}) + ${num3}`,
        answer: (num1 * num2) + num3,
    };
};

const generateTextPuzzle = () => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const EmailVerificationPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'verifying' | 'fallback' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Checking your verification link...');
    const recaptchaWidgetId = useRef<number | null>(null);

    // reCAPTCHA state
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

    // Fallback CAPTCHA state
    const [mathPuzzle, setMathPuzzle] = useState(generateMathPuzzle());
    const [mathAnswer, setMathAnswer] = useState('');
    const [textPuzzle, setTextPuzzle] = useState(generateTextPuzzle());
    const [textAnswer, setTextAnswer] = useState('');
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const verifyToken = async (verificationToken: string) => {
             try {
                const response = await api.checkVerificationToken(verificationToken);
                if (response.isValid) {
                    setStatus('verifying');
                    setMessage('');
                } else {
                    setStatus('error');
                    setMessage(response.message);
                }
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || 'An error occurred while validating the link.');
            }
        };

        if (token) {
            verifyToken(token);
        } else {
            setStatus('error');
            setMessage('No verification token provided. The link is incomplete.');
        }
    }, [token]);
    
    useEffect(() => {
        // FIX: The return type of `setInterval` in a browser environment is `number`, not `NodeJS.Timeout`.
        // This resolves the TypeScript error "Namespace 'global.NodeJS' has no exported member 'Timeout'".
        let recaptchaInterval: number;
        if (status === 'verifying') {
            const siteKey = process.env.VITE_RECAPTCHA_SITE_KEY;
            if (!siteKey) {
                console.warn('reCAPTCHA site key not found, using fallback.');
                setStatus('fallback');
                return;
            }

            recaptchaInterval = window.setInterval(() => {
                if (window.grecaptcha && window.grecaptcha.render) {
                    clearInterval(recaptchaInterval);
                    const widgetId = window.grecaptcha.render('recaptcha-container', {
                        'sitekey': siteKey,
                        'callback': (token: string) => setRecaptchaToken(token),
                    });
                    recaptchaWidgetId.current = widgetId;
                    setIsRecaptchaReady(true);
                }
            }, 100);

            // Timeout if reCAPTCHA fails to load
            const timeout = setTimeout(() => {
                if (!isRecaptchaReady) {
                    console.warn('reCAPTCHA failed to load in time, switching to fallback.');
                    setStatus('fallback');
                }
            }, 5000);

            return () => {
                clearInterval(recaptchaInterval);
                clearTimeout(timeout);
            };
        }
    }, [status, isRecaptchaReady]);

    useEffect(() => {
        if (status === 'fallback' && timer > 0) {
            const countdown = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(countdown);
        } else if (status === 'fallback' && timer === 0) {
            setMessage('Time is up! Please try again.');
        }
    }, [status, timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setStatus('loading');
        setMessage('Completing verification...');
        
        try {
            const payload: { token: string, recaptchaToken?: string, mathAnswer?: number, textAnswer?: string } = { token };

            if (recaptchaToken) {
                payload.recaptchaToken = recaptchaToken;
            } else {
                if (timer === 0) throw new Error("Time limit exceeded for CAPTCHA.");
                if (parseInt(mathAnswer, 10) !== mathPuzzle.answer) throw new Error("Incorrect answer to the math puzzle.");
                if (textAnswer.toUpperCase() !== textPuzzle) throw new Error("The text you entered does not match.");
                payload.mathAnswer = parseInt(mathAnswer, 10);
                payload.textAnswer = textAnswer;
            }

            const response = await api.verifyAndActivateAccount(payload);
            setStatus('success');
            setMessage(response.message);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || "Verification failed. Please try signing up again.");
            // Reset fallback if it was used
            setMathPuzzle(generateMathPuzzle());
            setTextPuzzle(generateTextPuzzle());
            setMathAnswer('');
            setTextAnswer('');
            setTimer(30);
            if (recaptchaToken && recaptchaWidgetId.current !== null) {
                window.grecaptcha.reset(recaptchaWidgetId.current);
            }
        }
    };
    
    const renderCaptcha = () => {
        if (status === 'fallback') {
            return (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-center text-yellow-400 text-sm">Google reCAPTCHA failed to load. Please solve the challenges below within <span className="font-bold">{timer}</span> seconds.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Solve this math problem: {mathPuzzle.question}</label>
                        <input type="number" value={mathAnswer} onChange={e => setMathAnswer(e.target.value)} required className="w-full bg-black/30 rounded-md border-white/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Type the text below:</label>
                        <div className="p-4 bg-black/40 rounded-md text-center font-mono text-2xl tracking-widest my-2 select-none">
                            {textPuzzle.split('').map((char, i) => (
                                <span key={i} style={{ transform: `rotate(${(Math.random() - 0.5) * 20}deg)`, display: 'inline-block', color: `hsl(${Math.random() * 360}, 70%, 70%)`, fontWeight: Math.random() > 0.5 ? 'bold' : 'normal' }}>
                                    {char}
                                </span>
                            ))}
                        </div>
                        <input type="text" value={textAnswer} onChange={e => setTextAnswer(e.target.value)} required className="w-full bg-black/30 rounded-md border-white/20" />
                    </div>
                    <button type="submit" disabled={timer === 0} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 disabled:opacity-50">
                        Verify Account
                    </button>
                </form>
            );
        }

        return (
            <form onSubmit={handleSubmit}>
                <div id="recaptcha-container" className="flex justify-center my-4"></div>
                <button type="submit" disabled={!recaptchaToken} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 disabled:opacity-50">
                    Verify Account
                </button>
            </form>
        );
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="glass-card p-8 rounded-2xl animate-fade-in text-center">
                <ShieldCheckIcon className="h-12 w-12 mx-auto text-brand-primary mb-4" />
                <h1 className="text-3xl font-bold text-white mb-4">Account Verification</h1>

                {status === 'loading' && <div className="py-10"><LoadingIcon className="h-10 w-10 animate-spin mx-auto" /><p className="mt-4">{message}</p></div>}
                
                {status === 'verifying' && <div><p className="text-gray-400 mb-4">To prevent automated signups, please complete the check below.</p>{renderCaptcha()}</div>}

                {status === 'fallback' && <div><p className="text-gray-400 mb-4">Please complete the challenges to activate your account.</p>{renderCaptcha()}</div>}

                {status === 'success' && <div className="text-center"><CheckIcon className="h-12 w-12 text-green-400 mx-auto mb-4" /><p className="text-green-300">{message}</p><Link to="/" className="mt-6 inline-block px-6 py-2 bg-brand-primary text-brand-dark font-semibold rounded-md">Go to Sign In</Link></div>}
                
                {status === 'error' && <div className="text-center"><XIcon className="h-12 w-12 text-red-400 mx-auto mb-4" /><p className="text-red-300">{message}</p><Link to="/" className="mt-6 inline-block px-6 py-2 bg-brand-primary text-brand-dark font-semibold rounded-md">Back to Home</Link></div>}
            </div>
        </div>
    );
};

export default EmailVerificationPage;
