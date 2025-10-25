



import React, { useState, useRef, useContext, useEffect } from 'react';
// FIX: The 'Extension' export is a type, not a value. Use an inline type import to resolve the module error.
// FIX: The combined import fails to resolve the type. Separating the default import and the named type import for better compatibility.
import QRCodeStyling from 'qr-code-styling';
import {
    LinkIcon, TextIcon, WifiIcon, VCardIcon, EmailIcon, SmsIcon, PhoneIcon, GeoIcon,
    CalendarIcon, BitcoinIcon, UpiIcon, ImageIcon, ColorPaletteIcon, ChevronDownIcon
} from './icons/IconComponents';
import { AuthContext } from '../contexts/AuthContext';
import { QrContext } from '../contexts/QrContext';
import { QrCodeType } from '../types';

const qrTypes: { id: QrCodeType, label: string, icon: React.FC<any> }[] = [
    { id: 'url', label: 'URL', icon: LinkIcon },
    { id: 'text', label: 'Text', icon: TextIcon },
    { id: 'wifi', label: 'Wi-Fi', icon: WifiIcon },
    { id: 'vcard', label: 'vCard', icon: VCardIcon },
    { id: 'email', label: 'Email', icon: EmailIcon },
    { id: 'sms', label: 'SMS', icon: SmsIcon },
    { id: 'phone', label: 'Phone', icon: PhoneIcon },
    { id: 'geo', label: 'Geo', icon: GeoIcon },
    { id: 'event', label: 'Event', icon: CalendarIcon },
    { id: 'bitcoin', label: 'Bitcoin', icon: BitcoinIcon },
    { id: 'upi', label: 'UPI', icon: UpiIcon },
];

const defaultQrData: Record<QrCodeType, any> = {
    url: { url: 'https://quick-link-url-shortener.vercel.app/' },
    text: { text: 'Hello World!' },
    wifi: { ssid: '', password: '', encryption: 'WPA' },
    vcard: { firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', website: '' },
    email: { to: '', subject: '', body: '' },
    sms: { phone: '', message: '' },
    phone: { phone: '' },
    geo: { latitude: '', longitude: '' },
    event: { summary: '', location: '', start: '', end: '' },
    bitcoin: { address: '', amount: '' },
    upi: { vpa: '', name: '', amount: '' },
};

const FormInput: React.FC<{ label: string; [key: string]: any }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-gray-100 dark:bg-black/30 rounded-md border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary" />
    </div>
);

const FormTextarea: React.FC<{ label: string; [key: string]: any }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea {...props} className="w-full bg-gray-100 dark:bg-black/30 rounded-md border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary" />
    </div>
);

const FormSelect: React.FC<{ label: string; children: React.ReactNode; [key: string]: any }> = ({ label, children, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-gray-100 dark:bg-black/30 rounded-md border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary">
            {children}
        </select>
    </div>
);

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-3">
                <span className="font-semibold text-gray-300">{title}</span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
                {children}
            </div>
        </div>
    );
};

const QrCodeGenerator: React.FC = () => {
    const auth = useContext(AuthContext);
    const qrContext = useContext(QrContext);

    const [activeType, setActiveType] = useState<QrCodeType>('url');
    const [qrData, setQrData] = useState<any>(defaultQrData.url);

    // Customization state
    const [dotColor, setDotColor] = useState('#ffffff');
    const [bgColor, setBgColor] = useState('#0a0a0a');
    const [logo, setLogo] = useState<string | null>(null);

    const qrRef = useRef<HTMLDivElement>(null);
    const qrCodeInstance = useRef<QRCodeStyling | null>(null);

    useEffect(() => {
        setQrData(defaultQrData[activeType]);
    }, [activeType]);
    
    const getQrString = (): string => {
        switch(activeType) {
            case 'url': return qrData.url || '';
            case 'text': return qrData.text || '';
            case 'wifi': return `WIFI:T:${qrData.encryption || 'WPA'};S:${qrData.ssid || ''};P:${qrData.password || ''};;`;
            case 'vcard':
                return `BEGIN:VCARD\nVERSION:3.0\nN:${qrData.lastName || ''};${qrData.firstName || ''}\nFN:${qrData.firstName || ''} ${qrData.lastName || ''}\nORG:${qrData.organization || ''}\nTITLE:${qrData.title || ''}\nTEL;TYPE=WORK,VOICE:${qrData.phone || ''}\nEMAIL:${qrData.email || ''}\nURL:${qrData.website || ''}\nEND:VCARD`;
            case 'email': return `mailto:${qrData.to || ''}?subject=${encodeURIComponent(qrData.subject || '')}&body=${encodeURIComponent(qrData.body || '')}`;
            case 'sms': return `SMSTO:${qrData.phone || ''}:${encodeURIComponent(qrData.message || '')}`;
            case 'phone': return `tel:${qrData.phone || ''}`;
            case 'geo': return `geo:${qrData.latitude || 0},${qrData.longitude || 0}`;
            case 'event': {
                const formatDate = (date: string) => date ? new Date(date).toISOString().replace(/[-:.]/g, '').slice(0, -4) + 'Z' : '';
                return `BEGIN:VEVENT\nSUMMARY:${qrData.summary || ''}\nLOCATION:${qrData.location || ''}\nDTSTART:${formatDate(qrData.start)}\nDTEND:${formatDate(qrData.end)}\nEND:VEVENT`;
            }
            case 'bitcoin': return `bitcoin:${qrData.address || ''}?amount=${qrData.amount || ''}`;
            case 'upi': return `upi://pay?pa=${qrData.vpa || ''}&pn=${encodeURIComponent(qrData.name || '')}&am=${qrData.amount || ''}&cu=INR`;
            default: return '';
        }
    };

    useEffect(() => {
        if (!qrRef.current) return;
        if (!qrCodeInstance.current) {
            qrCodeInstance.current = new QRCodeStyling({
                width: 300,
                height: 300,
                type: 'svg',
                imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 5 },
            });
            qrCodeInstance.current.append(qrRef.current);
        }
        qrCodeInstance.current.update({
            data: getQrString(),
            image: logo || undefined,
            dotsOptions: { color: dotColor, type: 'rounded' },
            backgroundOptions: { color: bgColor },
        });
    }, [activeType, qrData, dotColor, bgColor, logo, getQrString]);

    const handleDownload = () => {
        if (!qrCodeInstance.current) return;
        qrCodeInstance.current.download({
            name: `qrcode-${activeType}`,
            extension: 'png',
        });
        qrContext?.addQrCode({ userId: auth?.currentUser?.id || null, type: activeType, data: qrData });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogo(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setQrData({ ...qrData, [e.target.name]: e.target.value });
    };
    
    const renderForm = () => {
        switch(activeType) {
            case 'url': return <FormInput label="Website URL" type="url" name="url" value={qrData.url || ''} onChange={handleInputChange} placeholder="https://example.com" />;
            case 'text': return <FormTextarea label="Text" name="text" value={qrData.text || ''} onChange={handleInputChange} placeholder="Enter your text here" rows={4} />;
            case 'wifi': return (<div className="space-y-4"><FormInput label="Network Name (SSID)" type="text" name="ssid" value={qrData.ssid || ''} onChange={handleInputChange} placeholder="MyWiFiNetwork" /><FormInput label="Password" type="password" name="password" value={qrData.password || ''} onChange={handleInputChange} placeholder="********" /><FormSelect label="Encryption" name="encryption" value={qrData.encryption || 'WPA'} onChange={handleInputChange}><option>WPA</option><option>WEP</option><option>None</option></FormSelect></div>);
            case 'vcard': return (<div className="space-y-4"><FormInput label="First Name" name="firstName" value={qrData.firstName || ''} onChange={handleInputChange} /><FormInput label="Last Name" name="lastName" value={qrData.lastName || ''} onChange={handleInputChange} /><FormInput label="Phone Number" type="tel" name="phone" value={qrData.phone || ''} onChange={handleInputChange} /><FormInput label="Email" type="email" name="email" value={qrData.email || ''} onChange={handleInputChange} /><FormInput label="Organization" name="organization" value={qrData.organization || ''} onChange={handleInputChange} /><FormInput label="Job Title" name="title" value={qrData.title || ''} onChange={handleInputChange} /><FormInput label="Website" type="url" name="website" value={qrData.website || ''} onChange={handleInputChange} /></div>);
            case 'email': return (<div className="space-y-4"><FormInput label="To Email" type="email" name="to" value={qrData.to || ''} onChange={handleInputChange} /><FormInput label="Subject" type="text" name="subject" value={qrData.subject || ''} onChange={handleInputChange} /><FormTextarea label="Body" name="body" value={qrData.body || ''} onChange={handleInputChange} rows={3} /></div>);
            case 'sms': return (<div className="space-y-4"><FormInput label="Phone Number" type="tel" name="phone" value={qrData.phone || ''} onChange={handleInputChange} /><FormTextarea label="Message" name="message" value={qrData.message || ''} onChange={handleInputChange} rows={3} /></div>);
            case 'phone': return <FormInput label="Phone Number" type="tel" name="phone" value={qrData.phone || ''} onChange={handleInputChange} />;
            case 'geo': return (<div className="space-y-4"><FormInput label="Latitude" type="number" name="latitude" value={qrData.latitude || ''} onChange={handleInputChange} step="any" /><FormInput label="Longitude" type="number" name="longitude" value={qrData.longitude || ''} onChange={handleInputChange} step="any" /></div>);
            case 'event': return (<div className="space-y-4"><FormInput label="Event Title" type="text" name="summary" value={qrData.summary || ''} onChange={handleInputChange} /><FormInput label="Location" type="text" name="location" value={qrData.location || ''} onChange={handleInputChange} /><FormInput label="Start Time" type="datetime-local" name="start" value={qrData.start || ''} onChange={handleInputChange} /><FormInput label="End Time" type="datetime-local" name="end" value={qrData.end || ''} onChange={handleInputChange} /></div>);
            case 'bitcoin': return (<div className="space-y-4"><FormInput label="Bitcoin Address" type="text" name="address" value={qrData.address || ''} onChange={handleInputChange} /><FormInput label="Amount" type="number" name="amount" value={qrData.amount || ''} onChange={handleInputChange} step="any" /></div>);
            case 'upi': return (<div className="space-y-4"><FormInput label="Payee VPA (UPI ID)" type="text" name="vpa" value={qrData.vpa || ''} onChange={handleInputChange} /><FormInput label="Payee Name" type="text" name="name" value={qrData.name || ''} onChange={handleInputChange} /><FormInput label="Amount (INR)" type="number" name="amount" value={qrData.amount || ''} onChange={handleInputChange} step="any" /></div>);
            default: return null;
        }
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
                <h3 className="text-xl font-bold text-white">QR Code Type</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                    {qrTypes.map(type => (
                        <button key={type.id} onClick={() => setActiveType(type.id)} className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${activeType === type.id ? 'bg-brand-primary/20 text-brand-primary ring-2 ring-brand-primary' : 'bg-white/5 hover:bg-white/10 text-gray-400 dark:text-gray-300'}`}>
                            <type.icon className="h-6 w-6" />
                            <span className="text-xs">{type.label}</span>
                        </button>
                    ))}
                </div>
                <div className="space-y-4">{renderForm()}</div>
                
                <Accordion title="Customize Colors">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Dots</label>
                            <input type="color" value={dotColor} onChange={e => setDotColor(e.target.value)} className="w-full h-10 bg-transparent border-none cursor-pointer" />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Background</label>
                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 bg-transparent border-none cursor-pointer" />
                        </div>
                    </div>
                </Accordion>
                <Accordion title="Add Logo">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-brand-dark hover:file:bg-brand-primary/80" />
                    {logo && <button onClick={() => setLogo(null)} className="text-xs text-red-400 mt-2">Remove Logo</button>}
                </Accordion>
            </div>
            <div className="md:col-span-2 flex flex-col items-center justify-center bg-black/20 p-6 rounded-2xl">
                <div ref={qrRef} className="border-8 border-white rounded-lg shadow-lg"></div>
                <button onClick={handleDownload} className="mt-8 px-8 py-3 bg-brand-primary text-brand-dark font-semibold rounded-md hover:bg-brand-primary/80 transition-all shadow-[0_0_10px_#00e5ff]">
                    Download PNG
                </button>
            </div>
        </div>
    );
};

export default QrCodeGenerator;
