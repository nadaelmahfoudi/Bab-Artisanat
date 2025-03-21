import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

interface Product {
  _id: string;
  name: string;
  category: { _id: string; name: string };
  price: number;
  stock: number;
}

const ListProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(Array.isArray(response.data.products) ? response.data.products : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`http://localhost:3000/products/${productToDelete}`);
        setProducts(products.filter(product => product._id !== productToDelete));
      } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error);
      } finally {
        setProductToDelete(null);
      }
    }
  };

  return (
    <div className="flex bg-amber-50">
      <Sidebar />
      <div className="overflow-x-auto p-6 min-h-screen flex-1">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-amber-200">
        
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 border-b-4 border-amber-900">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Liste des Produits</h2>
              <button
                onClick={() => navigate("/addProduct")}
                className="px-4 py-2 text-sm font-medium text-amber-900 bg-amber-200 rounded-md hover:bg-amber-300 transition shadow-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un Produit
              </button>
            </div>
            {/* Decorative pattern */}
            <div className="flex justify-center mt-4">
              <div className="h-2 w-64 bg-amber-200 rounded-full flex space-x-1">
                <div className="h-2 w-2 bg-amber-900 rounded-full"></div>
                <div className="h-2 w-2 bg-amber-900 rounded-full"></div>
                <div className="h-2 w-2 bg-amber-900 rounded-full"></div>
                <div className="h-2 w-2 bg-amber-900 rounded-full"></div>
                <div className="h-2 w-2 bg-amber-900 rounded-full"></div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
              <p className="text-amber-800 mt-4 font-medium">Chargement des produits...</p>
            </div>
          ) : (
            <div className="p-4">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Aucun produit disponible</p>
                  <button
                    onClick={() => navigate("/addProduct")}
                    className="mt-4 px-4 py-2 text-sm font-medium text-amber-900 bg-amber-200 rounded-md hover:bg-amber-300 transition"
                  >
                    Ajouter votre premier produit
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-amber-200">
                  <table className="min-w-full divide-y divide-amber-200 text-sm">
                    <thead className="bg-amber-100">
                      <tr>
                        <th className="px-6 py-4 font-medium text-amber-900 text-left">Nom</th>
                        <th className="px-6 py-4 font-medium text-amber-900 text-left">Catégorie</th>
                        <th className="px-6 py-4 font-medium text-amber-900 text-left">Prix</th>
                        <th className="px-6 py-4 font-medium text-amber-900 text-left">Stock</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 bg-white">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-amber-50 transition">
                          <td className="px-6 py-4 text-gray-900 font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-gray-700">
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                              {product.category.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 font-medium">{product.price.toFixed(2)} Dh</td>
                          <td className="px-6 py-4">
                            {product.stock > 10 ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {product.stock} disponibles
                              </span>
                            ) : product.stock > 0 ? (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                {product.stock} restants
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                Rupture de stock
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Link to={`/products/view/${product._id}`} className="px-3 py-1 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition inline-flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Voir
                            </Link>
                            <Link to={`/products/edit/${product._id}`} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition inline-flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Modifier
                            </Link>
                            <button
                              onClick={() => setProductToDelete(product._id)}
                              className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition inline-flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
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
          )}
          
          {/* Moroccan-inspired footer */}
          <div className="bg-amber-100 p-4 border-t border-amber-200">
            <div className="flex justify-center">
              <div className="h-2 w-32 bg-amber-200 rounded-full flex space-x-1">
                <div className="h-2 w-2 bg-amber-700 rounded-full"></div>
                <div className="h-2 w-2 bg-amber-700 rounded-full"></div>
                <div className="h-2 w-2 bg-amber-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMATION WITH MOROCCAN STYLING */}
      {productToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm border-2 border-amber-300">
            <div className="bg-amber-100 -m-6 mb-4 p-4 rounded-t-lg border-b border-amber-300">
              <h3 className="text-lg font-bold text-amber-900">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mt-2 mb-4">
              Êtes-vous sûr de vouloir supprimer ce produit ?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;