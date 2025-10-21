import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../api';
import { LoadingIcon } from './icons/IconComponents';
import ProductCard from './ProductCard';
import ShopPaymentModal from './ShopPaymentModal';
import AdComponent from './AdComponent'; // Import AdComponent

const ShopPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        api.getProducts()
            .then(setProducts)
            .finally(() => setLoading(false));
    }, []);

    const AD_INTERVAL = 2; // Show an ad every 2 products

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">QuickLink Shop</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Enhance your experience with one-time purchases for premium benefits.
                </p>
            </div>

            {loading ? (
                <div className="text-center py-20"><LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" /></div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                         <React.Fragment key={product.id}>
                            <ProductCard product={product} onBuyNow={setSelectedProduct} />
                            {(index + 1) % AD_INTERVAL === 0 && (
                                <div className="md:col-span-2 lg:col-span-3 my-8">
                                    <AdComponent type="in-feed" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 glass-card rounded-2xl">
                    <h2 className="text-xl font-semibold text-white">Shop is Currently Empty</h2>
                    <p className="text-gray-500 mt-2">Check back soon for new products!</p>
                </div>
            )}
            
            {selectedProduct && <ShopPaymentModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </div>
    );
};

export default ShopPage;
