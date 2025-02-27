import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

interface Category {
  _id: string;
  name: string;
}

const ListCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await axios.delete(`http://localhost:3000/categories/${categoryToDelete}`);
        setCategories(categories.filter(category => category._id !== categoryToDelete));
      } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie :", error);
      } finally {
        setCategoryToDelete(null);
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") return;
    try {
      const response = await axios.post("http://localhost:3000/categories", { name: newCategoryName });
      setCategories([...categories, response.data.category]);
      setShowAddModal(false);
      setNewCategoryName("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie :", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="overflow-x-auto p-4 bg-gray-100 min-h-screen flex-1">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Liste des Catégories</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-lime-950 rounded-md hover:bg-lime-800 transition"
            >
              Ajouter une Catégorie
            </button>
          </div>
          {loading ? (
            <p className="text-center p-4">Chargement des catégories...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left">Nom</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{category.name}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setCategoryToDelete(category._id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE SUPPRESSION */}
      {categoryToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-bold text-gray-800">Confirmer la suppression</h3>
            <p className="text-gray-600 mt-2">
              Êtes-vous sûr de vouloir supprimer cette catégorie ?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL D'AJOUT */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-bold text-gray-800">Ajouter une Catégorie</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mt-2"
              placeholder="Nom de la catégorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCategory;