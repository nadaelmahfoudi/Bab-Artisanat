import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then((response) => {
        setProducts(response.data.products); // Fetch product list
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("An error occurred while loading the products.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow-md relative">
              
              {/* Stock Badge */}
              <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full 
                ${product.stock > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : "Out of stock"}
              </span>

              <img 
                src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/150"} 
                alt={product.name} 
                className="w-full h-40 object-cover rounded-md" 
                onError={(e) => e.target.src = "https://via.placeholder.com/150"} 
              />
              <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
              <p className="text-gray-600">{product.price} €</p>

              <button 
                className={`mt-4 px-4 py-2 rounded ${product.stock > 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-400 cursor-not-allowed text-gray-700"}`}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
