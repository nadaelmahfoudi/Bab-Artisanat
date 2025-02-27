import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post('http://localhost:3000/categories', { name }, {
                headers: { 'Content-Type': 'application/json' }
            });
            navigate('/categories/list');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ajouter une Catégorie</h2>
            {error && <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Nom de la catégorie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition">
                    Ajouter la Catégorie
                </button>
            </form>
        </div>
    );
};

export default AddCategory;