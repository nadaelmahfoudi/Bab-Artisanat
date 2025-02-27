import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: [],
        price: '',
        stock: '',
        category: ''
    });
    const [previewImages, setPreviewImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/categories')
            .then(response => {
                console.log("Données des catégories reçues :", response.data);
                setCategories(response.data.categories);
            })
            .catch(err => console.error("Erreur lors du chargement des catégories", err));
    }, []); 
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(`Champ mis à jour : ${e.target.name} -> ${e.target.value}`);
    };
    
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await axios.post('http://localhost:3000/products/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            setPreviewImages(prev => [...prev, response.data.imageUrl]);
            setFormData({ ...formData, images: [...formData.images, response.data.imageUrl] });
        } catch (error) {
            console.error('Erreur lors de l’upload', error);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Données envoyées :", formData);
    
        try {
            const response = await axios.post(
                'http://localhost:3000/products',
                formData, 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            navigate('/products/list');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        }
    };
    

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ajouter un Produit</h2>
            {error && <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Nom du produit" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg" required></textarea>
                
                <label className="block text-gray-700 font-medium">Images</label>
                <input type="file" name="images" onChange={handleImageChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 p-2 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-300">
                    <FaUpload className="mr-2" /> Choisir des images
                </label>
                
                <div className="flex flex-wrap gap-2 mt-2">
                    {previewImages.map((img, index) => (
                        <img key={index} src={img} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    ))}
                </div>
                
                <input type="number" name="price" placeholder="Prix" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                
                <button type="submit" className="w-full bg-lime-600 text-white py-3 rounded-lg hover:bg-lime-700 font-medium transition">
                    Ajouter le Produit
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
