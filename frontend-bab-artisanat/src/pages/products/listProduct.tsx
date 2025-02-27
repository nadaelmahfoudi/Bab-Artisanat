import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        console.log("API Response:", response.data);
        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="overflow-x-auto p-4 bg-gray-100 min-h-screen flex-1">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
            <button
            onClick={() => navigate("/addProduct")}
            className="px-4 py-2 text-sm font-medium text-white bg-lime-950 rounded-md hover:bg-lime-800 transition"
            >
            Add Product
            </button>
          </div>
          {loading ? (
            <p className="text-center p-4">Loading products...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left">Product Name</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left">Price</th>
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
                      <button className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition">
                        View
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProduct;