import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
    return (
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                <p className="text-gray-400 mt-2 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-3xl font-bold text-brand-primary">₹{product.price}</p>
                    <button
                        onClick={() => onBuyNow(product)}
                        className="px-6 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80 transition-colors shadow-[0_0_10px_#00e5ff]"
                    >
                        Buy Now
                    </button>
                </div>
                {product.limitQuantity && (
                    <p className="text-xs text-yellow-400 mt-3 text-center">
                        Limited stock: {product.stock} left!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
