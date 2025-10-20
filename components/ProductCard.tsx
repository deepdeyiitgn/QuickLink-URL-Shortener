import React from 'react';
import { Product } from '../types';
import { timeAgo } from '../utils/time';

interface ProductCardProps {
    product: Product;
    onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
    const isOutOfStock = !!(product.limitQuantity && product.stock !== undefined && product.stock <= 0);
    const isExpired = !!(product.availableUntil && product.availableUntil < Date.now());
    const isUnavailable = isOutOfStock || isExpired;

    const benefitText = product.benefit.type === 'API_DAYS'
        ? `+${product.benefit.value} Days of API Access`
        : `+${product.benefit.value} Days of Web Subscription`;

    return (
        <div className={`glass-card p-6 rounded-2xl flex flex-col justify-between h-full ${isUnavailable ? 'opacity-50' : ''}`}>
            <div>
                <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                <p className="text-gray-400 mt-2 min-h-[40px]">{product.description}</p>
                
                <div className="my-4 p-3 bg-brand-primary/10 rounded-lg text-center">
                    <span className="font-semibold text-brand-primary">{benefitText}</span>
                </div>

                <div className="flex justify-between items-baseline my-4">
                    <p className="text-4xl font-bold text-white">₹{product.price}</p>
                    {product.limitQuantity && product.stock !== undefined && (
                        <span className={`text-sm font-semibold ${product.stock > 10 ? 'text-gray-400' : 'text-yellow-400'}`}>
                            {product.stock} left
                        </span>
                    )}
                </div>
            </div>

            <div>
                 {product.availableUntil && (
                    <p className="text-xs text-center text-red-400 mb-3">
                        Offer ends in {timeAgo(product.availableUntil)}
                    </p>
                )}
                <button
                    onClick={() => onBuyNow(product)}
                    disabled={isUnavailable}
                    className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isOutOfStock ? 'Out of Stock' : isExpired ? 'Offer Expired' : 'Buy Now'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;