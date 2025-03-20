import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverProductId, setHoverProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); 
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/favorites/${userId}`);
        setFavorites(response.data.favorites);
      } catch (err) {
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleRemoveFavorite = (productId) => {
    setProductToDelete(productId); 
    setIsModalOpen(true); 
  };

  const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h3 className="text-xl font-serif text-amber-900 mb-4">Are you sure?</h3>
          <p className="text-amber-700 mb-6">Do you really want to remove this item from your wishlist?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 font-serif">Gathering your cherished pieces...</p>
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
          <h3 className="text-xl font-serif text-amber-900 mb-2">Unable to Load Wishlist</h3>
          <p className="text-amber-700 mb-4">{error}</p>
          <Link 
            to="/login"
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition-colors inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 pt-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-md border border-amber-200 text-center">
            <svg className="w-20 h-20 text-amber-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <h3 className="text-2xl font-serif text-amber-900 mb-4">Your Wishlist is Empty</h3>
            <p className="text-amber-700 mb-6">You haven't added any artisanal treasures to your wishlist yet.</p>
            <Link 
              to="/products"
              className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition-colors inline-block font-medium"
            >
              Discover Handcrafted Pieces
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-3">Your Cherished Collection</h1>
          <p className="text-amber-700 max-w-2xl mx-auto">
            The artisanal treasures that have captured your heart, each piece telling a unique story of craftsmanship and tradition.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.filter(fav => fav.product).map((fav) => (
            <div 
              key={fav._id} 
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100"
              onMouseEnter={() => setHoverProductId(fav._id)}
              onMouseLeave={() => setHoverProductId(null)}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={fav.product?.images?.[0] || "/api/placeholder/400/320"} 
                  alt={fav.product?.name || "Unknown product"} 
                />
                
                <button 
                  onClick={() => handleRemoveFavorite(fav.product._id)}
                  className="absolute top-3 right-3 bg-white bg-opacity-90 text-red-500 hover:text-red-700 p-2 rounded-full shadow-sm transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
                
                {fav.product.isHandmade && (
                  <div className="absolute top-3 left-3 rounded-full bg-amber-800 px-3 py-1 text-xs font-medium text-white">
                    Handcrafted
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-serif font-medium text-amber-900 transition-colors group-hover:text-amber-700">
                    {fav.product.name}
                  </h3>
                  <span className="font-medium text-amber-800">${fav.product.price?.toFixed(2)}</span>
                </div>
                
                {fav.product.artisan && (
                  <p className="text-sm text-amber-600 mb-2">
                    By {fav.product.artisan} {fav.product.material && `• ${fav.product.material}`}
                  </p>
                )}

                <p className="text-amber-700 text-sm line-clamp-2 mb-4">
                  {fav.product.description || "A unique artisanal piece crafted with care and attention to detail."}
                </p>

                <Link 
                  to={`/product/${fav.product._id}`}
                  className="block w-full text-center px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition-colors text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          try {
            await axios.delete(`http://localhost:3000/favorites/remove/${userId}/${productToDelete}`);
            setFavorites(favorites.filter(fav => fav.product._id !== productToDelete)); 
          } catch (err) {
            console.error("Failed to remove from wishlist:", err);
          } finally {
            setIsModalOpen(false);
          }
        }}
      />
    </section>
  );
};

export default WishlistPage;