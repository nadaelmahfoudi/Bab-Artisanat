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
    <div className="flex bg-amber-50 min-h-screen">
      <Sidebar />
      <div className="overflow-x-auto p-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif text-amber-900 relative inline-block">
              Produits Artisanaux
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-amber-700"></div>
            </h2>
            <p className="text-amber-800 mt-2 italic">Gérez votre inventaire de produits artisanaux</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200">
            <div className="flex justify-between items-center p-5 border-b border-amber-200 bg-amber-100">
              <h3 className="text-xl font-medium text-amber-900">Liste des Produits</h3>
              <button
                onClick={() => navigate("/addProduct")}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un Produit
              </button>
            </div>
            
            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-700 border-t-transparent"></div>
                <p className="mt-2 text-amber-800">Chargement des produits...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-8 text-amber-800">
                <p>Aucun produit trouvé.</p>
                <p className="mt-2 text-sm">Commencez par ajouter un nouveau produit.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-amber-200 text-sm">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="px-6 py-4 font-medium text-amber-900 text-left">Nom de Produit</th>
                      <th className="px-6 py-4 font-medium text-amber-900 text-left">Catégorie</th>
                      <th className="px-6 py-4 font-medium text-amber-900 text-left">Prix</th>
                      <th className="px-6 py-4 font-medium text-amber-900 text-left">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-amber-50 transition-colors">
                        <td className="px-6 py-4 text-amber-900 font-medium">{product.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                            {product.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-amber-900">{product.price.toFixed(2)} Dh</td>
                        <td className="px-6 py-4">
                          {product.stock > 10 ? (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                              {product.stock} disponibles
                            </span>
                          ) : product.stock > 0 ? (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                              {product.stock} restants
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-amber-100 text-amber-900 rounded-full text-xs">
                              Rupture de stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link to={`/products/view/${product._id}`} className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition inline-flex items-center border border-amber-300 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Voir
                          </Link>
                          <Link to={`/products/edit/${product._id}`} className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition inline-flex items-center border border-amber-300 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                          </Link>
                          <button
                            onClick={() => setProductToDelete(product._id)}
                            className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition inline-flex items-center border border-amber-300"
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
        </div>
      </div>

      {/* MODAL DE SUPPRESSION */}
      {productToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm border border-amber-200 animate-fadeIn">
            <div className="text-center mb-4 text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-amber-900 text-center">Confirmer la suppression</h3>
            <p className="text-amber-800 mt-2 text-center">
              Êtes-vous sûr de vouloir supprimer ce produit?
            </p>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setProductToDelete(null)}
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
    </div>
  );
};

export default ListProduct;