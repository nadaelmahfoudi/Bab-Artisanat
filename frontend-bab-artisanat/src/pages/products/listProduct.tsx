import React from "react";
import Sidebar from "../../components/Sidebar";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
}

const products: Product[] = [
  { id: 1, name: "iPhone 14 Pro", category: "Smartphones", price: "$999", stock: 12 },
  { id: 2, name: "MacBook Air M2", category: "Laptops", price: "$1,199", stock: 8 },
  { id: 3, name: "Sony WH-1000XM5", category: "Headphones", price: "$399", stock: 20 },
];

const ListProduct: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="overflow-x-auto p-4 bg-gray-100 min-h-screen flex-1">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
            <button className="px-4 py-2 text-sm font-medium text-white bg-lime-950 rounded-md hover:bg-lime-800 transition">
              Add Product
            </button>
          </div>

          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-900 text-left">Product Name</th>
                <th className="px-4 py-3 font-medium text-gray-900 text-left">Category</th>
                <th className="px-4 py-3 font-medium text-gray-900 text-left">Price</th>
                <th className="px-4 py-3 font-medium text-gray-900 text-left">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-gray-700">{product.category}</td>
                  <td className="px-4 py-3 text-gray-700">{product.price}</td>
                  <td className="px-4 py-3 text-gray-700">{product.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
