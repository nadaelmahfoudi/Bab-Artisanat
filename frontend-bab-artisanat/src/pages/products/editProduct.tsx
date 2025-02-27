import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        images: [],
        price: "",
        stock: "",
        category: ""
    });
    const [previewImages, setPreviewImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    // Load categories
    useEffect(() => {
        axios.get("http://localhost:3000/categories")
            .then(response => {
                setCategories(response.data.categories); // Assuming `{ categories: [...] }`
            })
            .catch(error => console.error("Erreur de chargement des catégories", error));
    }, []);

    // Load product data
    useEffect(() => {
        axios.get(`http://localhost:3000/products/${id}`)
            .then(response => {
                const product = response.data.product;
                console.log("Images récupérées :", product.images); 
                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    images: product.images || [],
                    price: product.price || "",
                    stock: product.stock || "",
                    category: product.category?._id || ""
                });
                setPreviewImages(product.images?.map(img => `/uploads/${img}`) || []);
            })
            .catch(error => console.error("Erreur de chargement du produit", error));
    }, [id]);
    
    // Handle text input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle image uploads
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageData = new FormData();
        imageData.append("file", file);

        try {
            const response = await axios.post("http://localhost:3000/products/upload", imageData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const imageUrl = response.data.imageUrl; // Ensure the API returns the full URL or adjust
            setPreviewImages([...previewImages, imageUrl]);
            setFormData(prevFormData => ({
                ...prevFormData,
                images: [...prevFormData.images, imageUrl]
            }));
        } catch (error) {
            console.error("Erreur lors de l’upload", error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/products/${id}`, formData, {
                headers: { "Content-Type": "application/json" }
            });
            navigate("/products/list");
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue");
        }
    };

    // Handle image deletion
    const handleRemoveImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });

        const newPreviewImages = [...previewImages];
        newPreviewImages.splice(index, 1);
        setPreviewImages(newPreviewImages);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Modifier le Produit</h2>
            {error && <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg" required></textarea>

                <label className="block text-gray-700 font-medium">Images</label>
                <input type="file" onChange={handleImageChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 p-2 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-300">
                    <FaUpload className="mr-2" /> Choisir une image
                </label>

                <div className="flex flex-wrap gap-2 mt-2">
                    {previewImages.map((img, index) => (
                        <div key={index} className="relative">
                            <img src={img} alt="Preview" className="w-16 h-16 object-cover rounded" />
                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">X</button>
                        </div>
                    ))}
                </div>

                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>

                <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 font-medium transition">
                    Modifier le Produit
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
