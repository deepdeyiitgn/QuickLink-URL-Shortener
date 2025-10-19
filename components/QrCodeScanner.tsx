import React, { useEffect, useState, useContext, useRef } from 'react';
import { LinkIcon, CameraIcon, UploadIcon, LoadingIcon } from './icons/IconComponents';
import { QrContext } from '../contexts/QrContext';
import { AuthContext } from '../contexts/AuthContext';

declare const Html5Qrcode: any;

const QrCodeScanner: React.FC = () => {
    const qrContext = useContext(QrContext);
    const auth = useContext(AuthContext);
    
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [scanMode, setScanMode] = useState<'idle' | 'camera' | 'file'>('idle');
    const [scanError, setScanError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scannerRef = useRef<any>(null);

    // This effect handles the camera scanner lifecycle
    useEffect(() => {
        if (scanMode !== 'camera' || !document.getElementById('reader')) {
            return;
        }

        const qrScanner = new Html5Qrcode("reader");
        scannerRef.current = qrScanner;
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        const onScanSuccess = (decodedText: string) => {
            setScanResult(decodedText);
            qrContext?.addScan({
                userId: auth?.currentUser?.id || null,
                content: decodedText
            });
            if (scannerRef.current) {
                scannerRef.current.stop().catch((err: any) => console.error("Failed to stop scanner after success", err));
            }
        };
        
        qrScanner.start({ facingMode: "environment" }, config, onScanSuccess, () => {})
            .catch((err: any) => {
                setScanError(`Camera Error: ${err.message}. Please ensure you have given camera permissions.`);
                setScanMode('idle');
            });

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {
                    // This can throw an error if it's already stopped, which is fine.
                });
            }
        };
    }, [scanMode, auth?.currentUser?.id, qrContext]);


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];
        setScanMode('file');
        setScanError(null);
        setScanResult(null);

        const qrScanner = new Html5Qrcode("reader");

        try {
            const decodedText = await qrScanner.scanFile(file, /* showImage= */ false);
            setScanResult(decodedText);
            qrContext?.addScan({
                userId: auth?.currentUser?.id || null,
                content: decodedText,
            });
        } catch (err) {
            console.error("File scan error:", err);
            setScanError("Scan failed: No QR code found in the image. Please try a different or clearer picture.");
            setScanMode('idle');
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setScanMode('idle');
        setScanError(null);
    };

    const isUrl = (text: string): boolean => {
        try {
            new URL(text);
            return text.startsWith('http://') || text.startsWith('https://');
        } catch (_) {
            return false;
        }
    };
    
    if (scanResult) {
        return (
            <div className="text-center animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Scan Successful!</h3>
                <div className="p-4 bg-black/30 border border-brand-primary/30 rounded-lg">
                    <p className="font-mono text-brand-light break-all mb-4">{scanResult}</p>
                    {isUrl(scanResult) && (
                         <a href={scanResult} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 transition-all">
                            <LinkIcon className="h-4 w-4" />
                            Open Link
                        </a>
                    )}
                </div>
                <button onClick={resetScanner} className="mt-4 text-brand-primary hover:underline">Scan another code</button>
            </div>
        );
    }
    
    return (
        <div className="mt-6">
            {scanMode === 'idle' && (
                <div className="text-center animate-fade-in">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => setScanMode('camera')} className="flex-1 inline-flex items-center justify-center gap-3 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 transition-all">
                            <CameraIcon className="h-6 w-6" />
                            Use Camera
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex-1 inline-flex items-center justify-center gap-3 rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-white/20 transition-all">
                            <UploadIcon className="h-6 w-6" />
                            Upload Image
                        </button>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    </div>
                    {scanError && <p className="mt-4 text-sm text-red-400">{scanError}</p>}
                </div>
            )}

            {scanMode === 'camera' && (
                <div className="animate-fade-in">
                    <div className="w-full max-w-sm mx-auto">
                        <div id="reader" className="aspect-square bg-brand-dark rounded-lg overflow-hidden border-2 border-dashed border-white/20"></div>
                        <p className="text-xs text-gray-500 text-center mt-2">Point your camera at a QR code</p>
                    </div>
                    <div className="text-center mt-4">
                        <button onClick={() => setScanMode('idle')} className="text-gray-400 hover:text-white">Cancel</button>
                    </div>
                </div>
            )}
            
            {scanMode === 'file' && (
                <div className="text-center animate-fade-in flex flex-col items-center justify-center h-48">
                    <LoadingIcon className="h-8 w-8 animate-spin text-brand-primary" />
                    <p className="mt-4 text-gray-400">Processing image...</p>
                </div>
            )}
            
            {/* This div is always present but hidden, required by the library for file scanning */}
            <div id="reader" className="hidden"></div>
        </div>
    );
};

export default QrCodeScanner;