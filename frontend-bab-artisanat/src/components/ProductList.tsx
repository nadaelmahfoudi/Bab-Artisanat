import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  images: string[];
  artisan?: string;
  material?: string;
  category?: string;
  isHandmade?: boolean;
}

interface CartItem {
  productId: string;
  quantity: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [notification, setNotification] = useState<{show: boolean; message: string}>({show: false, message: ""});
  const [hoverProductId, setHoverProductId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProducts();

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data.products);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("We couldn't load our artisanal collection. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`http://localhost:3000/cart/${userId}`);
      setCart(response.data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!userId) {
      showNotification("Please log in to add items to your collection.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/cart/add", {
        userId,
        productId,
        quantity: 1,
      });

      showNotification("Artisanal piece added to your collection.");
      fetchCart();
    } catch (error) {
      console.error("Error adding product to cart:", error);
      showNotification("We couldn't add this piece to your collection. Please try again.");
    }
  };

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const isProductInCart = (productId: string): boolean => {
    return cart.some(item => item.productId === productId);
  };

  const getUniqueCategories = (): string[] => {
    // Ensure all categories are strings and handle nullish values
    const categories = products.map(product => 
      (product.category || "Uncategorized").toString()
    );
    return ["all", ...Array.from(new Set(categories))];
  };

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 font-serif">Curating our artisanal collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md border border-amber-200 max-w-md text-center">
          <svg className="w-16 h-16 text-amber-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-serif text-amber-900 mb-2">Unable to Load Collection</h3>
          <p className="text-amber-700 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-4">Artisanal Treasures</h1>
          <p className="text-amber-700 max-w-2xl mx-auto">
            Each piece in our collection is carefully handcrafted by skilled artisans, 
            embodying generations of tradition and craftsmanship.
          </p>

          <div className="mt-8 overflow-x-auto py-2">
            <div className="flex justify-center space-x-2 min-w-max">
              {getUniqueCategories().map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category
                      ? "bg-amber-800 text-white" 
                      : "bg-white text-amber-800 border border-amber-300 hover:bg-amber-100"
                  }`}
                >
                  {typeof category === 'string' 
                    ? category.charAt(0).toUpperCase() + category.slice(1)
                    : category}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product._id} 
              className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100"
              onMouseEnter={() => setHoverProductId(product._id)}
              onMouseLeave={() => setHoverProductId(null)}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.images?.length > 0 ? product.images[0] : "/api/placeholder/400/320"} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoverProductId === product._id ? "scale-110" : "scale-100"
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/api/placeholder/400/320";
                  }}
                />
                
                {/* Stock indicator */}
                <div className={`absolute top-3 right-3 rounded-full ${
                  product.stock > 0 ? "bg-amber-100" : "bg-red-100"
                } px-3 py-1 text-xs font-medium ${
                  product.stock > 0 ? "text-amber-800" : "text-red-800"
                }`}>
                  {product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} left` : "In Stock") : "Sold Out"}
                </div>

                {/* Handmade badge */}
                {product.isHandmade && (
                  <div className="absolute top-3 left-3 rounded-full bg-amber-800 px-3 py-1 text-xs font-medium text-white">
                    Handcrafted
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-serif font-medium text-amber-900 transition-colors group-hover:text-amber-700">
                    {product.name}
                  </h3>
                  <span className="font-medium text-amber-800">${product.price.toFixed(2)}</span>
                </div>
                
                {product.artisan && (
                  <p className="text-sm text-amber-600 mb-2">
                    By {product.artisan} {product.material && `• ${product.material}`}
                  </p>
                )}

                <p className="text-amber-700 text-sm line-clamp-2 mb-4">
                  {product.description || "A unique artisanal piece crafted with care and attention to detail."}
                </p>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="flex-1 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  
                  <button 
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0 || isProductInCart(product._id)}
                    className={`flex-1 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                      product.stock === 0 
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                        : isProductInCart(product._id)
                          ? "bg-amber-700 text-white cursor-default"
                          : "bg-amber-800 hover:bg-amber-900 text-white"
                    }`}
                  >
                    {product.stock === 0 
                      ? "Sold Out" 
                      : isProductInCart(product._id)
                        ? "In Collection"
                        : "Add to Collection"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-amber-700 text-lg mb-4">No artisanal pieces found in this category.</p>
            <button 
              onClick={() => setActiveCategory("all")}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition-colors"
            >
              View All Collections
            </button>
          </div>
        )}
      </div>
      
      {/* Floating notification */}
      {notification.show && (
        <div className="fixed bottom-6 right-6 bg-amber-800 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in-up">
          {notification.message}
        </div>
      )}
    </section>
  );
};

export default ProductList;