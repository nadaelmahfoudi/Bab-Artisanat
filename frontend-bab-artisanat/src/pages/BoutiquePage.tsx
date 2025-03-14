import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    stock: number;
    category: string;
    createdAt: string;
    updatedAt: string;
}

interface User {
    name: string;
    email: string;
}

const Boutique = () => {
    const userId = localStorage.getItem('userId');

    const [owner, setOwner] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setError("User ID not found in localStorage");
            setLoading(false);
            return;
        }

        // Fetch user details & products in parallel
        const fetchData = async () => {
            try {
                const [userResponse, productsResponse] = await Promise.all([
                    axios.get(`http://localhost:3000/auth/${userId}`),
                    axios.get(`http://localhost:3000/products/user?userId=${userId}`)
                ]);

                console.log("Réponse user :", userResponse.data);
                console.log("Réponse produits :", productsResponse.data);

                // Update owner data
                if (userResponse.data.user) {
                    setOwner({
                        name: userResponse.data.user.name,
                        email: userResponse.data.user.email
                    });
                }

                // Vérifier si les produits sont bien un tableau
                setProducts(Array.isArray(productsResponse.data.products) ? productsResponse.data.products : []);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) return <p className="text-center">Chargement...</p>;
    if (error) return <p className="text-red-600 text-center">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            {owner ? (
                <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Boutique de {owner.name}</h1>
                    <p className="text-gray-600 mb-6">Contact : {owner.email}</p>
                </>
            ) : (
                <p className="text-gray-500">Informations du propriétaire indisponibles.</p>
            )}

            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Produits</h2>

            {products.length === 0 ? (
                <p className="text-gray-500">Aucun produit disponible.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="border rounded-lg p-4 shadow-md">
                            <img 
                                src={product.images[0] || '/placeholder.png'} 
                                alt={product.name} 
                                className="w-full h-40 object-cover rounded"
                            />
                            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                            <p className="text-gray-600">{product.description}</p>
                            <p className="text-green-600 font-bold mt-2">{product.price} €</p>
                            <p className="text-gray-500">Stock : {product.stock}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Boutique;
