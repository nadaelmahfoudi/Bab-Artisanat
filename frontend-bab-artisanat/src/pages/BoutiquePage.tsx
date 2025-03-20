import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    name: string;
    email: string;
    phone?: string;
    localisation?: string;
    description?: string;
}

interface Category {
    _id: string;
    name: string;
    __v?: number;
}

interface Product {
    _id: string;  
    name: string;
    price: number;
    description: string;
    images: string[];
    stock: number;
    category: Category; 
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const Boutique = () => {
    const userId = localStorage.getItem('userId');

    const [owner, setOwner] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

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

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/categories`);
                setCategories(response.data);
            } catch (err) {
                setError("Failed to load categories");
                console.error(err);
            }
        };

        fetchUser();
        fetchProducts();
        fetchCategories();
    }, [userId]);

    const handleEditClick = () => {
        setEditedUser(owner);
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const getCategoryName = (category: Category | undefined): string => {
        if (category && category.name) {
            return category.name;
        }
        return 'Catégorie inconnue';
    };

    const filteredProducts = products.filter(product => {
        try {
            const categoryName = getCategoryName(product.category);
            const matchesCategory = !activeCategory || categoryName === activeCategory;
            const matchesSearch = !searchTerm || 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        } catch (err) {
            console.error("Error filtering product:", err, product);
            return false;
        }
    });

    const uniqueCategories = Array.isArray(categories) ? categories : [];

    if (error) return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
            <p className="text-red-600 text-center font-semibold p-4 bg-white rounded-lg shadow">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-amber-800 to-amber-600 text-white p-6 shadow-md">
                <div className="max-w-6xl mx-auto">
                    {owner ? (
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Atelier {owner.name}</h1>
                                <p className="text-amber-100 italic mb-2">{owner.description || 'Artisan passionné'}</p>
                            </div>
                            <button
                                className="bg-amber-50 text-amber-800 px-4 py-2 rounded-full hover:bg-white transition-colors mt-4 md:mt-0"
                                onClick={handleEditClick}
                            >
                                Modifier le profil
                            </button>
                        </div>
                    ) : (
                        <p className="text-white">Chargement des informations...</p>
                    )}
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-6xl mx-auto p-6">
                {/* Artisan Info */}
                {owner && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4 mb-4 md:mb-0">
                                <div className="bg-amber-100 h-48 w-48 rounded-full mx-auto flex items-center justify-center">
                                    <span className="text-5xl text-amber-800">{owner.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="md:w-3/4 md:pl-8">
                                <h2 className="text-2xl font-semibold text-amber-800 mb-4">À propos de l'artisan</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600 mb-2">
                                            <span className="font-semibold">Email:</span> {owner.email}
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <span className="font-semibold">Téléphone:</span> {owner.phone || 'Non renseigné'}
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <span className="font-semibold">Localisation:</span> {owner.localisation || 'Non renseigné'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-700">
                                            {owner.description || "Artisan passionné partageant son savoir-faire et ses créations uniques."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-amber-800 mb-4 md:mb-0">Nos créations</h2>
                        <div className="w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                                activeCategory === null
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            onClick={() => setActiveCategory(null)}
                        >
                            Toutes les catégories
                        </button>
                        {uniqueCategories.map(category => (
                            <button
                                key={category._id}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    activeCategory === category.name
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                                onClick={() => setActiveCategory(category.name)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Products */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="border border-amber-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                    <div className="relative">
                                        <img 
                                            src={product.images?.length > 0 ? product.images[0] : "/api/placeholder/400/320"}
                                            alt={product.name} 
                                            className="w-full h-48 object-cover"
                                        />
                                        <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                                            {getCategoryName(product.category)}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-amber-800">{product.name}</h3>
                                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                                {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture de stock'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm h-16 overflow-hidden mt-2">
                                            {product.description}
                                        </p>
                                        <div className="flex justify-between items-center mt-4">
                                            <p className="text-amber-800 font-bold text-xl">{product.price} €</p>
                                            <button className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-700 transition-colors">
                                                Voir détails
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">Aucun produit disponible pour cette recherche.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-amber-800 text-white py-6">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p>© {new Date().getFullYear()} Atelier {owner?.name || 'Artisan'} - Tous droits réservés</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-amber-200 transition-colors">Mentions légales</a>
                            <a href="#" className="hover:text-amber-200 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Edit Modal */}
            {isEditing && editedUser && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold text-amber-800 mb-4">Modifier Profil</h2>

                        <label className="block mb-2 font-medium">Nom :</label>
                        <input
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-amber-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />

                        <label className="block mb-2 font-medium">Email :</label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-amber-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />

                        <label className="block mb-2 font-medium">Téléphone :</label>
                        <input
                            type="text"
                            name="phone"
                            value={editedUser.phone || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-amber-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />

                        <label className="block mb-2 font-medium">Localisation :</label>
                        <input
                            type="text"
                            name="localisation"
                            value={editedUser.localisation || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-amber-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />

                        <label className="block mb-2 font-medium">Description :</label>
                        <textarea
                            name="description"
                            value={editedUser.description || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-amber-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            rows={3}
                        />

                        <div className="flex justify-end">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500 transition-colors"
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
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