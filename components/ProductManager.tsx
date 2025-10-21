import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import { Product, AuthContextType } from '../types';
import { LoadingIcon, TrashIcon, PlusIcon } from './icons/IconComponents';

const ProductManager: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser } = auth;
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 100,
        imageUrl: '',
        benefit: { type: 'SUBSCRIPTION_DAYS', value: 30 },
        isActive: true,
    });

    const fetchProducts = () => {
        // Admin needs to see all products, not just active ones. We'll handle this on the client for simplicity.
        // In a real app, this would be a separate admin endpoint.
        api.getProducts().then(setProducts).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId: string) => {
        if (!currentUser || !window.confirm('Are you sure you want to delete this product?')) return;
        await api.deleteProduct(productId, currentUser.id);
        fetchProducts();
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        await api.addProduct(newProduct as any, currentUser.id);
        setShowForm(false);
        setNewProduct({ name: '', description: '', price: 100, imageUrl: '', benefit: { type: 'SUBSCRIPTION_DAYS', value: 30 }, isActive: true });
        fetchProducts();
    };

    if (loading) return <div className="text-center py-10"><LoadingIcon className="h-8 w-8 animate-spin mx-auto" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Manage Products</h3>
                <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80">
                    <PlusIcon className="h-5 w-5" /> {showForm ? 'Cancel' : 'New Product'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="p-4 bg-black/30 rounded-lg mb-4 space-y-3">
                    <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required className="w-full bg-black/40 rounded-md" />
                    <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required className="w-full bg-black/40 rounded-md" />
                    <input type="url" placeholder="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} required className="w-full bg-black/40 rounded-md" />
                    <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} required className="w-full bg-black/40 rounded-md" />
                    {/* Simplified benefit editor */}
                     <select value={newProduct.benefit?.type} onChange={e => setNewProduct({...newProduct, benefit: { ...newProduct.benefit!, type: e.target.value as any }})} className="w-full bg-black/40 rounded-md">
                        <option value="SUBSCRIPTION_DAYS">Subscription Days</option>
                        <option value="API_DAYS">API Days</option>
                    </select>
                    <input type="number" placeholder="Benefit Value (e.g., 30)" value={newProduct.benefit?.value} onChange={e => setNewProduct({...newProduct, benefit: { ...newProduct.benefit!, value: Number(e.target.value) }})} required className="w-full bg-black/40 rounded-md" />
                    <button type="submit" className="w-full py-2 bg-brand-secondary rounded-md">Save Product</button>
                </form>
            )}

            <div className="space-y-2">
                {products.map(product => (
                    <div key={product.id} className="p-3 bg-black/30 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-white">{product.name}</p>
                            <p className="text-xs text-gray-400">₹{product.price} - Benefit: {product.benefit.value} {product.benefit.type.replace('_', ' ').toLowerCase()}</p>
                        </div>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManager;
