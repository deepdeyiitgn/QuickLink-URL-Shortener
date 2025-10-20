import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../api';
import { LoadingIcon } from './icons/IconComponents';

const ShopPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getProducts()
            .then(setProducts)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">QuickLink Shop</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Purchase digital goods like permanent link packs and API access to enhance your experience.
                </p>
            </div>

            {loading ? (
                 <div className="flex justify-center items-center py-20">
                    <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {products.map(product => (
                        <div key={product.id} className="glass-card p-6 rounded-2xl flex flex-col">
                            <h2 className="text-2xl font-bold text-brand-primary mb-2">{product.name}</h2>
                            <p className="text-gray-400 flex-grow mb-4">{product.description}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-3xl font-bold text-white">₹{product.price}</span>
                                <button className="px-6 py-2 font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80">
                                    Purchase
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 glass-card rounded-2xl max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-white">Shop is Empty</h2>
                    <p className="text-gray-400 mt-2">
                        There are currently no products available for sale. Please check back later!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ShopPage;