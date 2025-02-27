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
  const [productToDelete, setProductToDelete] = useState<string | null>(null); // État du modal
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
    <div className="flex">
      <Sidebar />
      <div className="overflow-x-auto p-4 bg-gray-100 min-h-screen flex-1">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Liste des Produits</h2>
            <button
              onClick={() => navigate("/addProduct")}
              className="px-4 py-2 text-sm font-medium text-white bg-lime-950 rounded-md hover:bg-lime-800 transition"
            >
              Ajouter un Produit
            </button>
          </div>
          {loading ? (
            <p className="text-center p-4">Chargement des produits...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left">Nom</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left">Catégorie</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left">Prix</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-700">{product.category.name}</td>
                    <td className="px-4 py-3 text-gray-700">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-700">{product.stock}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link to={`/products/view/${product._id}`} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                        Voir
                      </Link>
                      <Link to={`/products/edit/${product._id}`} className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition">
                        Modifier
                      </Link>
                      <button
                        onClick={() => setProductToDelete(product._id)}
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

      {/* MODAL DE CONFIRMATION */}
      {productToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-bold text-gray-800">Confirmer la suppression</h3>
            <p className="text-gray-600 mt-2">
              Êtes-vous sûr de vouloir supprimer ce produit ?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setProductToDelete(null)}
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
    </div>
  );
};

export default ListProduct;
