
import React, { useEffect, useState, useContext, useRef } from 'react';
import { LinkIcon, CameraIcon, UploadIcon, LoadingIcon } from './icons/IconComponents';
import { QrContext } from '../contexts/QrContext';
import { AuthContext } from '../contexts/AuthContext';

declare const Html5Qrcode: any;

const QrCodeScanner: React.FC = () => {
    const qrContext = useContext(QrContext);
    const auth = useContext(AuthContext);
    
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isFileProcessing, setIsFileProcessing] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    
    // New states for fallback mechanism
    const [showFallbackModal, setShowFallbackModal] = useState(false);
    const [failedFile, setFailedFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const html5QrCode = useRef<any>(null);

    const stopScanner = async () => {
        if (html5QrCode.current?.isScanning) {
            try {
                await html5QrCode.current.stop();
            } catch (err) {
                console.error("Failed to stop scanner gracefully:", err);
            }
        }
        html5QrCode.current = null;
        setIsScanning(false);
    };

    const onScanSuccess = (decodedText: string) => {
        setScanResult(decodedText);
        qrContext?.addScan({
            userId: auth?.currentUser?.id || null,
            content: decodedText
        });
        stopScanner();
    };

    const startScanner = () => {
        if (isScanning || html5QrCode.current) return;

        setScanError(null);
        setScanResult(null);
        setIsScanning(true);
        const qrScanner = new Html5Qrcode("reader");
        html5QrCode.current = qrScanner;
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        qrScanner.start({ facingMode: "environment" }, config, onScanSuccess, () => {})
            .catch((err: any) => {
                let errorMessage = 'An unexpected camera error occurred.';
                if (err.name === 'NotAllowedError') errorMessage = 'Camera access was denied. Please grant permissions in your browser settings.';
                else if (err.name === 'NotFoundError') errorMessage = 'No camera was found on this device. Try uploading an image instead.';
                else if (err.name === 'NotReadableError') errorMessage = 'The camera is in use by another application. Please close other apps and try again.';
                else errorMessage = `Camera Error: ${err.message}. Please ensure permissions are granted.`;
                setScanError(errorMessage);
                stopScanner();
            });
    };

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        setIsFileProcessing(true);
        setScanError(null);
        setScanResult(null);

        try {
            const fileScanner = new Html5Qrcode("reader-file", { verbose: false });
            const decodedText = await fileScanner.scanFile(file, false);
            onScanSuccess(decodedText);
        } catch (err) {
            // Instead of setting error directly, trigger the fallback modal
            setFailedFile(file);
            setShowFallbackModal(true);
        } finally {
            setIsFileProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFallbackScan = async () => {
        if (!failedFile) return;

        setShowFallbackModal(false);
        setIsFileProcessing(true);
        setScanError(null);

        const formData = new FormData();
        formData.append('file', failedFile);

        try {
            const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            const decodedText = data[0]?.symbol[0]?.data;

            if (decodedText) {
                onScanSuccess(decodedText);
            } else {
                throw new Error("API could not decode the QR code.");
            }
        } catch (err) {
            setScanError("We're sorry, but both our scanner and our partner's scanner were unable to read this QR code. Please try with a clearer image.");
        } finally {
            setIsFileProcessing(false);
            setFailedFile(null);
        }
    };

    const resetScanner = () => {
        stopScanner();
        setScanResult(null);
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

    const FallbackModal = () => (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="relative w-full max-w-lg glass-card rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Scan Failed</h3>
                <p className="text-gray-300 mb-6">
                    Our scanner couldn't read this QR code. Would you like to try again using our powerful third-party scanning partner, <code className="bg-black/30 p-1 rounded text-brand-secondary">api.qrserver.com</code>?
                    <br />
                    <span className="text-xs text-gray-500">Your image will be sent to their server for processing.</span>
                </p>
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => { setShowFallbackModal(false); setFailedFile(null); }}
                        className="px-6 py-2 text-sm font-semibold text-white bg-white/10 rounded-md hover:bg-white/20"
                    >
                        No, Thanks
                    </button>
                    <button 
                        onClick={handleFallbackScan}
                        className="px-6 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80"
                    >
                        Yes, Try Again
                    </button>
                </div>
            </div>
        </div>
    );
    
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
            {showFallbackModal && <FallbackModal />}
            {!isScanning && !isFileProcessing && (
                <div className="text-center animate-fade-in">
                    <p className="text-gray-400 mb-6 max-w-lg mx-auto">Our powerful scanner can read even damaged or low-quality QR codes. For best results, ensure the code is well-lit.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={startScanner} className="flex-1 inline-flex items-center justify-center gap-3 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 transition-all">
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

            {isScanning && (
                <div className="animate-fade-in">
                    <div className="w-full max-w-sm mx-auto">
                        <div id="reader" className="aspect-square bg-brand-dark rounded-lg overflow-hidden border-2 border-dashed border-white/20"></div>
                        <p className="text-xs text-gray-500 text-center mt-2">Point your camera at a QR code</p>
                    </div>
                    <div className="text-center mt-4">
                        <button onClick={stopScanner} className="text-gray-400 hover:text-white">Cancel</button>
                    </div>
                </div>
            )}
            
            {isFileProcessing && (
                <div className="text-center animate-fade-in flex flex-col items-center justify-center h-48">
                    <LoadingIcon className="h-8 w-8 animate-spin text-brand-primary" />
                    <p className="mt-4 text-gray-400">Processing image...</p>
                </div>
            )}
            
            <div id="reader" style={{ display: 'none' }}></div>
            <div id="reader-file" className="hidden"></div>
        </div>
    );
};

export default QrCodeScanner;
