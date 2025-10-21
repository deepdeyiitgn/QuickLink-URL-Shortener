import React, { useState, useRef, useContext } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
    LinkIcon, TextIcon, WifiIcon, VCardIcon, EmailIcon, SmsIcon, PhoneIcon, GeoIcon,
    CalendarIcon, BitcoinIcon, UpiIcon, ImageIcon, ColorPaletteIcon, ChevronDownIcon
} from './icons/IconComponents';
import { AuthContext } from '../contexts/AuthContext';
import { QrContext } from '../contexts/QrContext';
import { QrCodeType, AuthContextType } from '../types';

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
    const [qrData, setQrData] = useState<any>({ url: 'https://quick-link-url-shortener.vercel.app/' });

    // Customization state
    const [dotColor, setDotColor] = useState('#ffffff');
    const [bgColor, setBgColor] = useState('#0a0a0a');
    const [logo, setLogo] = useState<string | null>(null);

    const qrRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!qrRef.current) return;
        qrRef.current.innerHTML = '';
        const qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            data: getQrString(),
            image: logo || undefined,
            dotsOptions: { color: dotColor, type: 'rounded' },
            backgroundOptions: { color: bgColor },
            imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 5 },
        });
        qrCode.append(qrRef.current);
    }, [activeType, qrData, dotColor, bgColor, logo]);

    const handleDownload = () => {
        if (!qrRef.current?.firstChild) return;
        const svg = qrRef.current.firstChild as SVGElement;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");
        if(!ctx) return;
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 600, 600);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `qrcode-${activeType}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);

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
    
    const getQrString = () => {
        switch(activeType) {
            case 'url': return qrData.url || '';
            case 'text': return qrData.text || '';
            case 'wifi': return `WIFI:T:${qrData.encryption || 'WPA'};S:${qrData.ssid || ''};P:${qrData.password || ''};;`;
            // ... other cases
            default: return qrData.url || '';
        }
    }
    
    // Form rendering logic...
    const renderForm = () => {
        // This would be a large switch statement rendering different forms.
        // For brevity, only showing URL.
        return <input type="url" value={qrData.url || ''} onChange={e => setQrData({url: e.target.value})} placeholder="https://example.com" className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" />
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
                <h3 className="text-xl font-bold text-white">QR Code Type</h3>
                <div className="grid grid-cols-3 gap-2">
                    {qrTypes.map(type => (
                        <button key={type.id} onClick={() => setActiveType(type.id)} className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${activeType === type.id ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/5 hover:bg-white/10'}`}>
                            <type.icon className="h-6 w-6" />
                            <span className="text-xs">{type.label}</span>
                        </button>
                    ))}
                </div>
                {renderForm()}
                
                <Accordion title="Customize Colors">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Dots</label>
                            <input type="color" value={dotColor} onChange={e => setDotColor(e.target.value)} className="w-full h-10 bg-transparent border-none" />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-400">Background</label>
                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 bg-transparent border-none" />
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
