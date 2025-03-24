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
    <div className="flex bg-amber-50 min-h-screen">
      <Sidebar />
      <div className="overflow-x-auto p-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif text-amber-900 relative inline-block">
              Catégories d'Artisanat
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-amber-700"></div>
            </h2>
            <p className="text-amber-800 mt-2 italic">Organisez vos créations artisanales</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200">
            <div className="flex justify-between items-center p-5 border-b border-amber-200 bg-amber-100">
              <h3 className="text-xl font-medium text-amber-900">Liste des Catégories</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une Catégorie
              </button>
            </div>
            
            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-700 border-t-transparent"></div>
                <p className="mt-2 text-amber-800">Chargement des catégories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center p-8 text-amber-800">
                <p>Aucune catégorie trouvée.</p>
                <p className="mt-2 text-sm">Commencez par ajouter une nouvelle catégorie.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-amber-200 text-sm">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="px-6 py-4 font-medium text-amber-900 text-left">Nom de Catégorie</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {categories.map((category) => (
                      <tr key={category._id} className="hover:bg-amber-50 transition-colors">
                        <td className="px-6 py-4 text-amber-900 font-medium">{category.name}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setCategoryToDelete(category._id)}
                            className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition border border-amber-300"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE SUPPRESSION */}
      {categoryToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm border border-amber-200 animate-fadeIn">
            <div className="text-center mb-4 text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-amber-900 text-center">Confirmer la suppression</h3>
            <p className="text-amber-800 mt-2 text-center">
              Êtes-vous sûr de vouloir supprimer cette catégorie et tous les produits associés?
            </p>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-amber-700 bg-white rounded-md hover:bg-amber-50 transition border border-amber-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL D'AJOUT */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm border border-amber-200 animate-fadeIn">
            <h3 className="text-lg font-bold text-amber-900 mb-4 text-center">Nouvelle Catégorie d'Artisanat</h3>
            <div className="mb-4">
              <label htmlFor="categoryName" className="block text-sm font-medium text-amber-700 mb-1">
                Nom de la catégorie
              </label>
              <input
                id="categoryName"
                type="text"
                className="w-full p-2.5 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition"
                placeholder="ex: Céramique, Bijoux, Tissage..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-amber-700 bg-white rounded-md hover:bg-amber-50 transition border border-amber-300"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
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