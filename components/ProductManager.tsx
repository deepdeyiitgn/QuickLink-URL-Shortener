import React, { useState, useEffect, useContext } from 'react';
import { Product, AuthContextType } from '../types';
import { api } from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { LoadingIcon, PlusIcon, TrashIcon } from './icons/IconComponents';

const ProductManager: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(10);
    const [benefitType, setBenefitType] = useState<'SUBSCRIPTION_DAYS' | 'API_DAYS'>('SUBSCRIPTION_DAYS');
    const [benefitValue, setBenefitValue] = useState(30);
    const [limitQuantity, setLimitQuantity] = useState('');
    const [availableUntil, setAvailableUntil] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        const fetchedProducts = await api.getProducts();
        setProducts(fetchedProducts);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId: string) => {
        if (!auth.currentUser) return;
        if (window.confirm('Are you sure you want to permanently delete this product?')) {
            await api.deleteProduct(productId, auth.currentUser.id);
            await fetchProducts();
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        setIsCreating(true);

        const newProduct: Omit<Product, 'id' | 'createdAt' | 'stock'> = {
            name,
            description,
            price: Number(price),
            benefit: { type: benefitType, value: Number(benefitValue) },
            limitQuantity: limitQuantity ? Number(limitQuantity) : undefined,
            availableUntil: availableUntil ? new Date(availableUntil).getTime() : undefined,
            isActive: true,
        };

        await api.addProduct(newProduct, auth.currentUser.id);
        
        // Reset form
        setName('');
        setDescription('');
        setPrice(10);
        
        await fetchProducts();
        setIsCreating(false);
    };

    return (
        <div className="space-y-8">
            {/* Create Product Form */}
            <div className="bg-black/20 p-4 rounded-lg">
                 <h3 className="text-xl font-bold text-white mb-4">Create New Product</h3>
                 <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" required className="admin-input" />
                    <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required className="admin-input" />
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price (INR)" required className="admin-input" />
                    <select value={benefitType} onChange={e => setBenefitType(e.target.value as any)} className="admin-input">
                        <option value="SUBSCRIPTION_DAYS">Web Subscription Days</option>
                        <option value="API_DAYS">API Subscription Days</option>
                    </select>
                    <input type="number" value={benefitValue} onChange={e => setBenefitValue(Number(e.target.value))} placeholder="Benefit Value (e.g., 30)" required className="admin-input" />
                    <input type="number" value={limitQuantity} onChange={e => setLimitQuantity(e.target.value)} placeholder="Stock Quantity (optional)" className="admin-input" />
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-400">Available Until (optional)</label>
                        <input type="date" value={availableUntil} onChange={e => setAvailableUntil(e.target.value)} className="admin-input w-full" />
                    </div>
                    <button type="submit" disabled={isCreating} className="md:col-span-2 w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-2 font-semibold text-brand-dark hover:bg-brand-primary/80 disabled:opacity-50">
                        {isCreating ? <LoadingIcon className="h-5 w-5 animate-spin" /> : <><PlusIcon className="h-5 w-5" /> Create Product</>}
                    </button>
                 </form>
            </div>

            {/* Existing Products List */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Existing Products</h3>
                {loading ? <LoadingIcon className="h-6 w-6 animate-spin" /> : (
                    <div className="space-y-2">
                        {products.map(p => (
                            <div key={p.id} className="bg-black/20 p-3 rounded-lg flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-semibold text-white">{p.name} - ₹{p.price}</p>
                                    <p className="text-xs text-gray-400">{p.benefit.value} {p.benefit.type.replace('_', ' ')}</p>
                                </div>
                                <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManager;
