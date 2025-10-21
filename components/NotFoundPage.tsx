
import React from 'react';
// FIX: Changed single quotes to double quotes for the import.
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
    return (
        <div className="text-center py-20 animate-fade-in">
            <h1 className="text-6xl font-bold text-brand-primary animate-aurora">404</h1>
            <h2 className="text-2xl font-semibold text-white mt-4">Link Not Found</h2>
            <p className="text-gray-400 mt-2">
                The link you are looking for may have expired, been moved, or never existed.
            </p>
            <Link to="/" className="mt-8 inline-block px-6 py-3 bg-brand-primary text-brand-dark font-semibold rounded-md hover:bg-brand-primary/80 transition-all shadow-[0_0_10px_#00e5ff]">
                Go to Homepage
            </Link>
        </div>
    );
};

export default NotFoundPage;