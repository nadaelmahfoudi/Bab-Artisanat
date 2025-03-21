import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';

const AddProduct = () => {
    const navigate = useNavigate();

    // Récupérer userId depuis localStorage
    const userId = localStorage.getItem('userId');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: [],
        price: '',
        stock: '',
        category: '',
        userId: userId || '' // Ajouter userId ici
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Charger les catégories au montage du composant
    useEffect(() => {
        axios.get('http://localhost:3000/categories')
            .then(response => setCategories(response.data.categories))
            .catch(err => console.error("Erreur lors du chargement des catégories", err));
    }, []);

    // Mettre à jour les champs du formulaire
    const handleChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    // Gestion de l'upload d'images
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageFormData = new FormData();
        imageFormData.append('file', file);
    
        try {
            const response = await axios.post('http://localhost:3000/products/upload', imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const imageUrl = response.data.imageUrl;

            setPreviewImages(prev => [...prev, imageUrl]);
            setFormData(prevState => ({
                ...prevState,
                images: [...prevState.images, imageUrl]
            }));
        } catch (error) {
            console.error("Erreur lors de l'upload", error);
            setError("Erreur lors de l'upload de l'image. Veuillez réessayer.");
        }
    };
zzzzzzzz
    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setFormData(prevState => ({
            ...prevState,
            images: prevState.images.filter((_, i) => i !== index)
        }));
    };

    // Envoyer le produit avec userId
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Vérifier si userId est bien défini
        if (!formData.userId) {
            setError("Erreur : userId manquant. Veuillez vous reconnecter.");
            setIsSubmitting(false);
            return;
        }

        try {
            await axios.post('http://localhost:3000/products', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            navigate('/products/list');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Back button */}
                <Link to="/products/list" className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6 transition">
                    <FaArrowLeft className="mr-2" />
                    <span>Retour à la liste</span>
                </Link>
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-amber-200">
                    {/* Decorative header */}
                    <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 border-b-4 border-amber-900">
                        <h2 className="text-2xl font-bold text-white text-center">Ajouter un Produit Artisanal</h2>
                        
                        {/* Moroccan pattern */}
                        <div className="flex justify-center mt-4">
                            <div className="flex space-x-1">
                                <div className="h-4 w-4 bg-amber-200 rounded-full"></div>
                                <div className="h-4 w-4 bg-amber-300 rounded-full"></div>
                                <div className="h-4 w-4 bg-amber-400 rounded-full"></div>
                                <div className="h-4 w-4 bg-amber-300 rounded-full"></div>
                                <div className="h-4 w-4 bg-amber-200 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-amber-800 font-medium mb-2">Nom du produit</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Ex: Tajine traditionel fait à la main" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-amber-800 font-medium mb-2">Description</label>
                                <textarea 
                                    name="description" 
                                    placeholder="Décrivez votre produit artisanal en détail..." 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-amber-300 rounded-lg h-32 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" 
                                    required
                                ></textarea>
                            </div>
                            
                            <div>
                                <label className="block text-amber-800 font-medium mb-2">Images du produit</label>
                                <input type="file" name="images" onChange={handleImageChange} className="hidden" id="file-upload" accept="image/*" />
                                <label htmlFor="file-upload" className="cursor-pointer bg-amber-100 p-4 rounded-lg flex items-center justify-center text-amber-800 hover:bg-amber-200 border border-amber-300 transition">
                                    <FaUpload className="mr-2" /> Choisir des images
                                </label>
                                
                                {previewImages.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm text-amber-700 mb-2">{previewImages.length} image(s) sélectionnée(s)</p>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {previewImages.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={img} alt="Aperçu" className="w-24 h-24 object-cover rounded-lg border border-amber-300" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-amber-800 font-medium mb-2">Prix (Dh)</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        placeholder="Ex: 450" 
                                        value={formData.price} 
                                        onChange={handleChange} 
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" 
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-amber-800 font-medium mb-2">Quantité en stock</label>
                                    <input 
                                        type="number" 
                                        name="stock" 
                                        placeholder="Ex: 10" 
                                        value={formData.stock} 
                                        onChange={handleChange} 
                                        className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-amber-800 font-medium mb-2">Catégorie</label>
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition" 
                                    required
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    className={`w-full bg-amber-700 text-white py-4 rounded-lg hover:bg-amber-800 font-medium transition flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Ajout en cours...
                                        </>
                                    ) : (
                                        'Ajouter le Produit'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Moroccan-inspired footer */}
                    <div className="bg-amber-100 p-4 border-t border-amber-200">
                        <div className="flex justify-center">
                            <div className="flex space-x-3">
                                <div className="h-1 w-12 bg-amber-400 rounded-full"></div>
                                <div className="h-1 w-24 bg-amber-600 rounded-full"></div>
                                <div className="h-1 w-12 bg-amber-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;