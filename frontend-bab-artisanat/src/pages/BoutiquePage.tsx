import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    name: string;
    email: string;
    phone?: string;
    localisation?: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
}

const Boutique = () => {
    const userId = localStorage.getItem('userId');

    const [owner, setOwner] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setError("User ID not found in localStorage");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/auth/${userId}`);
                setOwner(response.data.user);
            } catch (err) {
                setError("Failed to load user data");
                console.error(err);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/products/user?userId=${userId}`);
                setProducts(response.data.products);
            } catch (err) {
                setError("Failed to load products");
                console.error(err);
            }
        };

        fetchUser();
        fetchProducts();
    }, [userId]);

    const handleEditClick = () => {
        setEditedUser(owner);
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedUser) {
            setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (!editedUser || !userId) return;
        try {
            await axios.put(`http://localhost:3000/auth/${userId}`, editedUser);
            setOwner(editedUser);
            setIsEditing(false);
        } catch (err) {
            setError("Failed to update user data");
            console.error(err);
        }
    };

    if (error) return <p className="text-red-600 text-center">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            {owner ? (
                <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Boutique de {owner.name}</h1>
                    <p className="text-gray-600 mb-2">Email : {owner.email}</p>
                    <p className="text-gray-600 mb-2">Téléphone : {owner.phone || 'Non renseigné'}</p>
                    <p className="text-gray-600 mb-6">Localisation : {owner.localisation || 'Non renseigné'}</p>

                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleEditClick}
                    >
                        Modifier
                    </button>
                </>
            ) : (
                <p className="text-gray-500">Informations du propriétaire indisponibles.</p>
            )}

            {/* PRODUCTS */}
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Produits</h2>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="border p-4 rounded-lg shadow">
                            {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded" />
                            )}
                            <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
                            <p className="text-gray-600">{product.description || 'Aucune description'}</p>
                            <p className="text-gray-900 font-bold mt-2">{product.price} €</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Aucun produit disponible.</p>
            )}

            {/* MODAL */}
            {isEditing && editedUser && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Modifier Profil</h2>

                        <label className="block mb-2">Nom :</label>
                        <input
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <label className="block mb-2">Email :</label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <label className="block mb-2">Téléphone :</label>
                        <input
                            type="text"
                            name="phone"
                            value={editedUser.phone || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <label className="block mb-2">Localisation :</label>
                        <input
                            type="text"
                            name="localisation"
                            value={editedUser.localisation || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <div className="flex justify-end">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleSave}
                            >
                                Sauvegarder
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Boutique;
