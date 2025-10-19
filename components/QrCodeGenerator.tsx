import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { 
    LinkIcon, TextIcon, WifiIcon, VCardIcon, EmailIcon, SmsIcon, PhoneIcon, GeoIcon, LoadingIcon,
    CalendarIcon, BitcoinIcon, UpiIcon, WhatsappIcon, ColorPaletteIcon, ImageIcon, ChevronDownIcon, TrashIcon
} from './icons/IconComponents';
import { QrContext } from '../contexts/QrContext';
import { AuthContext } from '../contexts/AuthContext';
import About from './About';
import HowToUseQr from './HowToUseQr';

// This is available globally from the script loaded in index.html
declare const QRCode: any;

type QrType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'geo' | 'event' | 'bitcoin' | 'upi' | 'whatsapp';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'url' | 'tel' | 'email' | 'password' | 'select' | 'textarea' | 'datetime-local' | 'number';
    placeholder?: string;
    options?: string[];
    step?: string;
}

interface QrTypeConfig {
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    fields: FormField[];
    generatePayload: (data: Record<string, string>) => string;
}

const QR_CONFIG: Record<QrType, QrTypeConfig> = {
    url: { label: 'URL', icon: LinkIcon, fields: [{ name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com' }], generatePayload: data => data.url || '' },
    text: { label: 'Text', icon: TextIcon, fields: [{ name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Enter any text here...' }], generatePayload: data => data.text || '' },
    wifi: { label: 'Wi-Fi', icon: WifiIcon, fields: [ { name: 'ssid', label: 'Network Name (SSID)', type: 'text', placeholder: 'MyNetwork' }, { name: 'password', label: 'Password', type: 'password', placeholder: 'MySecretPassword' }, { name: 'encryption', label: 'Encryption', type: 'select', options: ['WPA/WPA2', 'WEP', 'None'] },], generatePayload: data => { if (!data.ssid) return ''; const enc = data.encryption === 'None' ? 'nopass' : (data.encryption === 'WEP' ? 'WEP' : 'WPA'); return `WIFI:T:${enc};S:${data.ssid};P:${data.password || ''};;`; },},
    vcard: { label: 'vCard', icon: VCardIcon, fields: [ { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' }, { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' }, { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+11234567890' }, { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john.doe@example.com' }, { name: 'organization', label: 'Organization', type: 'text', placeholder: 'ACME Inc.' },], generatePayload: data => `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastName || ''};${data.firstName || ''}\nFN:${data.firstName || ''} ${data.lastName || ''}\nTEL;TYPE=CELL:${data.phone || ''}\nEMAIL:${data.email || ''}\nORG:${data.organization || ''}\nEND:VCARD`},
    email: { label: 'Email', icon: EmailIcon, fields: [ { name: 'email', label: 'Recipient Email', type: 'email', placeholder: 'recipient@example.com' }, { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Hello!' }, { name: 'body', label: 'Message', type: 'textarea', placeholder: 'Your message here...' },], generatePayload: data => `mailto:${data.email}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.body || '')}` },
    sms: { label: 'SMS', icon: SmsIcon, fields: [ { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+11234567890' }, { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Your SMS message...' },], generatePayload: data => `SMSTO:${data.phone}:${data.message || ''}`},
    phone: { label: 'Phone Call', icon: PhoneIcon, fields: [{ name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+11234567890' }], generatePayload: data => data.phone ? `tel:${data.phone}` : '' },
    geo: { label: 'Location', icon: GeoIcon, fields: [ { name: 'latitude', label: 'Latitude', type: 'text', placeholder: '40.7128' }, { name: 'longitude', label: 'Longitude', type: 'text', placeholder: '-74.0060' },], generatePayload: data => `geo:${data.latitude},${data.longitude}`},
    event: { label: 'Event', icon: CalendarIcon, fields: [ { name: 'summary', label: 'Event Title', type: 'text', placeholder: 'Team Meeting' }, { name: 'location', label: 'Location', type: 'text', placeholder: 'Conference Room 1' }, { name: 'dtstart', label: 'Start Time', type: 'datetime-local' }, { name: 'dtend', label: 'End Time', type: 'datetime-local' },], generatePayload: data => { if (!data.summary || !data.dtstart || !data.dtend) return ''; const f = (dt: string) => dt.replace(/[-:]/g, '').slice(0, 13) + '00'; return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${data.summary}\nLOCATION:${data.location || ''}\nDTSTART:${f(data.dtstart)}\nDTEND:${f(data.dtend)}\nEND:VEVENT\nEND:VCALENDAR`; },},
    bitcoin: { label: 'Bitcoin', icon: BitcoinIcon, fields: [ { name: 'address', label: 'Bitcoin Address', type: 'text', placeholder: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT' }, { name: 'amount', label: 'Amount (Optional)', type: 'number', placeholder: '0.01', step: '0.00001' },], generatePayload: data => `bitcoin:${data.address}${data.amount ? `?amount=${data.amount}` : ''}`},
    upi: { label: 'UPI', icon: UpiIcon, fields: [ { name: 'pa', label: 'Payee VPA (UPI ID)', type: 'text', placeholder: 'yourname@bank' }, { name: 'pn', label: 'Payee Name', type: 'text', placeholder: 'John Doe' }, { name: 'am', label: 'Amount (Optional)', type: 'number', placeholder: '100', step: '0.01' },], generatePayload: data => { if (!data.pa || !data.pn) return ''; const p = new URLSearchParams({ pa: data.pa, pn: data.pn }); if (data.am) p.set('am', data.am); p.set('cu', 'INR'); return `upi://pay?${p.toString()}`; },},
    whatsapp: { label: 'WhatsApp', icon: WhatsappIcon, fields: [ { name: 'phone', label: 'Phone Number (with country code)', type: 'tel', placeholder: '911234567890' }, { name: 'message', label: 'Message (Optional)', type: 'textarea', placeholder: 'Hello!' },], generatePayload: data => `https://wa.me/${data.phone.replace(/[^0-9]/g, '')}${data.message ? `?text=${encodeURIComponent(data.message)}` : ''}` },
};

const QrCodeGenerator: React.FC = () => {
    const qrContext = useContext(QrContext);
    const auth = useContext(AuthContext);
    const [qrType, setQrType] = useState<QrType>('url');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [qrColor, setQrColor] = useState('#f0f8ff');
    const [qrBgColor, setQrBgColor] = useState('#0a0a1a');
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const downloadLinkRef = useRef<HTMLAnchorElement>(null);

    const config = useMemo(() => QR_CONFIG[qrType], [qrType]);
    const payload = useMemo(() => config.generatePayload(formData), [formData, config]);
    
    useEffect(() => {
        setFormData(config.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    }, [qrType, config.fields]);

    useEffect(() => {
        if (!payload) {
            setQrDataUrl('');
            return;
        }
        setIsLoading(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const qrOptions = {
            width: 300,
            margin: 2,
            errorCorrectionLevel: logoSrc ? 'H' : 'Q',
            color: { dark: qrColor, light: qrBgColor }
        };

        QRCode.toCanvas(canvas, payload, qrOptions).then(() => {
            if (logoSrc) {
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                const logoImg = new Image();
                logoImg.src = logoSrc;
                logoImg.onload = () => {
                    const logoSize = canvas.width * 0.2; // Reduced size for better scannability
                    const logoX = (canvas.width - logoSize) / 2;
                    const logoY = (canvas.height - logoSize) / 2;
                    ctx.fillStyle = qrBgColor;
                    ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
                    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                    setQrDataUrl(canvas.toDataURL('image/png'));
                    setIsLoading(false);
                };
                logoImg.onerror = () => setIsLoading(false);
            } else {
                setQrDataUrl(canvas.toDataURL('image/png'));
                setIsLoading(false);
            }
        }).catch((err: any) => {
            console.error(err);
            setIsLoading(false);
        });
    }, [payload, qrColor, qrBgColor, logoSrc]);

    const handleGenerateAndSave = () => {
        if (!payload || !qrContext) return;
        qrContext.addQrCode({
            userId: auth?.currentUser?.id || null,
            type: qrType,
            payload,
            customizations: { color: qrColor, bgColor: qrBgColor, logo: logoSrc }
        });
    };

    useEffect(() => {
        if(payload) handleGenerateAndSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payload, qrColor, qrBgColor, logoSrc]);
    
    const handleDownload = () => {
        if (downloadLinkRef.current && qrDataUrl) {
            downloadLinkRef.current.href = qrDataUrl;
            downloadLinkRef.current.click();
        }
    };
    
    return (
        <div className="space-y-12">
            <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-6 text-center animate-aurora">QR Code Generator</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form & Controls */}
                    <div>
                        <QrTypeSelector selected={qrType} onSelect={setQrType} />
                        <div className="space-y-4 mb-6">
                            {config.fields.map(field => (
                                <div key={field.name}>
                                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                                    {field.type === 'textarea' ? <textarea id={field.name} name={field.name} value={formData[field.name] || ''} onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))} placeholder={field.placeholder} rows={3} className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm" />
                                    : field.type === 'select' ? <select id={field.name} name={field.name} value={formData[field.name] || ''} onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))} className="block w-full rounded-md border-0 bg-black/30 py-2.5 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm">{field.options?.map(opt => <option key={opt}>{opt}</option>)}</select>
                                    : <input type={field.type} id={field.name} name={field.name} value={formData[field.name] || ''} onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))} placeholder={field.placeholder} step={field.step} className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm" />}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Accordion title="Customize Design" icon={ColorPaletteIcon}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div><label htmlFor="qrColor" className="block text-sm font-medium text-gray-300 mb-1">QR Color</label><input id="qrColor" type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="w-full h-10 p-1 bg-black/30 border border-white/20 rounded-md cursor-pointer" /></div>
                                    <div><label htmlFor="qrBgColor" className="block text-sm font-medium text-gray-300 mb-1">Background</label><input id="qrBgColor" type="color" value={qrBgColor} onChange={e => setQrBgColor(e.target.value)} className="w-full h-10 p-1 bg-black/30 border border-white/20 rounded-md cursor-pointer" /></div>
                                </div>
                            </Accordion>
                            <Accordion title="Add Logo" icon={ImageIcon}>
                                {!logoSrc ? <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={e => {const f = e.target.files?.[0]; if(f){const r=new FileReader();r.onloadend=()=>setLogoSrc(r.result as string);r.readAsDataURL(f);}}} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/80 file:text-brand-dark hover:file:bg-brand-primary" />
                                : <div className="flex items-center justify-between"><div className="flex items-center gap-2"><img src={logoSrc} alt="Logo preview" className="h-10 w-10 object-contain rounded-md bg-white p-1" /><span className="text-sm text-gray-300">Logo added</span></div><button onClick={() => setLogoSrc(null)} className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400"><TrashIcon className="h-5 w-5" /></button></div>}
                            </Accordion>
                        </div>
                    </div>
                    {/* QR Preview */}
                    <div className="flex flex-col items-center justify-center bg-black/20 p-6 rounded-lg border border-white/10">
                        <div className="relative w-[300px] h-[300px] flex items-center justify-center bg-brand-dark rounded-md">
                            {isLoading && <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" />}
                            {!isLoading && qrDataUrl && <img src={qrDataUrl} alt="Generated QR Code" className="w-full h-full object-contain rounded-md animate-fade-in" />}
                            {!isLoading && !qrDataUrl && <p className="text-gray-500 text-center">Enter data to generate QR code</p>}
                            <canvas ref={canvasRef} width="300" height="300" className="hidden"></canvas>
                        </div>
                        <button onClick={handleDownload} disabled={!qrDataUrl || isLoading} className="mt-6 w-full max-w-[300px] flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:bg-brand-primary/80 disabled:opacity-50">Download PNG</button>
                        <a ref={downloadLinkRef} download="qrcode.png" className="hidden"></a>
                    </div>
                </div>
            </div>
            
            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <About />
                <HowToUseQr />
            </div>
        </div>
    );
};


// --- Sub Components ---
const QrTypeSelector: React.FC<{ selected: QrType; onSelect: (type: QrType) => void; }> = ({ selected, onSelect }) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6">
        {Object.entries(QR_CONFIG).map(([key, { label, icon: Icon }]) => (
            <button key={key} onClick={() => onSelect(key as QrType)} className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${selected === key ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' : 'bg-black/30 border-white/20 hover:border-white/30 text-gray-300'}`}>
                <Icon className="h-8 w-8 mb-2" />
                <span className="text-xs font-semibold text-center">{label}</span>
            </button>
        ))}
    </div>
);

const Accordion: React.FC<{ title: string; icon: React.FC<any>; children: React.ReactNode }> = ({ title, icon: Icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/20 rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-black/30 hover:bg-black/40 transition-colors">
                <span className="flex items-center gap-2 font-semibold"><Icon className="h-5 w-5 text-brand-primary" /> {title}</span>
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-4 bg-black/10">{children}</div>}
        </div>
    )
};

export default QrCodeGenerator;