import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../api';
import { LoadingIcon } from './icons/IconComponents';
import ProductCard from './ProductCard';
import ShopPaymentModal from './ShopPaymentModal';

const ShopPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await api.getProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleBuyNow = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">
                    QuickLink Shop
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Grab limited-edition items to enhance your experience.
                </p>
            </div>
            
            {loading ? (
                 <div className="flex justify-center items-center py-20">
                    <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glass-card rounded-2xl">
                    <h2 className="text-2xl font-semibold text-white">The Shop is Currently Empty</h2>
                    <p className="text-gray-400 mt-2">Check back soon for new and exciting items!</p>
                </div>
            )}

            {selectedProduct && (
                <ShopPaymentModal product={selectedProduct} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default ShopPage;
