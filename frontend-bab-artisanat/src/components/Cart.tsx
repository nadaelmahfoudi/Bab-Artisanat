import React, { useState, useEffect } from "react";
import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artisan?: string;
  material?: string;
}

const ArtisanalCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");

  const handleCheckout = async () => {
    if (!userId) return;
  
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:3000/cart/checkout", { userId });
      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe checkout
      }
    } catch (error) {
      setError("Unable to process checkout. Please try again later.");
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/cart/${userId}`);
        setCartItems(response.data.items.map((item: any) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          image: item.productId.images[0],
          artisan: item.productId.artisan || "Local Artisan",
          material: item.productId.material
        })));
        setError(null);
      } catch (error) {
        setError("Could not load your cart. Please refresh the page.");
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const updateQuantity = async (id: string, quantity: number) => {
    if (!userId || quantity < 1) return;
  
    try {
      const response = await axios.patch(
        "http://localhost:3000/cart/update", 
        { userId, productId: id, quantity }, 
        { headers: { "Content-Type": "application/json" } }
      );
      
      setCartItems(response.data.cart.items.map((item: any) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "default-image.jpg",
        artisan: item.artisan || "Local Artisan",
        material: item.material
      })));
      setError(null);
    } catch (error) {
      setError("Unable to update quantity. Please try again.");
      console.error("Error updating quantity:", error);
    }
  };
  
  const confirmRemoveItem = (id: string) => {
    setSelectedItem(id);
    setShowModal(true);
  };

  const removeItem = async () => {
    if (!userId || !selectedItem) return;
  
    try {
      const response = await axios.request({
        method: "DELETE",
        url: "http://localhost:3000/cart/remove",
        data: { userId, productId: selectedItem },
        headers: { "Content-Type": "application/json" }
      });
      
      setCartItems(response.data.cart.items.map((item: any) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "default-image.jpg",
        artisan: item.artisan || "Local Artisan",
        material: item.material
      })));
      
      setShowModal(false);
      setSelectedItem(null);
      setError(null);
    } catch (error) {
      setError("Unable to remove item. Please try again.");
      console.error("Error removing item:", error);
    }
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-amber-50 rounded-lg shadow-md w-full max-w-2xl mx-auto text-center">
        <div className="animate-pulse text-amber-800">Loading your artisanal selection...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-amber-50 rounded-lg border border-amber-200 shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif font-bold mb-6 text-amber-900 text-center border-b border-amber-300 pb-4">Your Artisanal Collection</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      
      {cartItems.length > 0 ? (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="bg-white p-4 mb-4 rounded-lg shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover mr-4 border border-amber-200" 
                    />
                    <div>
                      <h3 className="font-medium text-amber-900">{item.name}</h3>
                      <p className="text-sm text-amber-700">
                        By {item.artisan}
                        {item.material && <span> • {item.material}</span>}
                      </p>
                      <p className="text-amber-900 font-medium">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex items-center border border-amber-300 rounded-md overflow-hidden">
                      <button 
                        className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="px-4 py-1 bg-white text-amber-900">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:justify-end">
                      <span className="font-semibold text-amber-900">${(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        className="ml-4 px-3 py-1 text-amber-700 hover:text-amber-900 text-sm border border-transparent hover:border-amber-300 rounded-md transition-all"
                        onClick={() => confirmRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-amber-200">
            <div className="flex justify-between text-sm text-amber-800 mb-2">
              <span>Items ({getTotalItems()}):</span>
              <span>${getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-sm text-amber-800 mb-2">
              <span>Artisan handling:</span>
              <span>$5.00</span>
            </div>
            <div className="border-t border-amber-200 my-2"></div>
            <div className="flex justify-between text-lg font-semibold text-amber-900 mt-2">
              <span>Total:</span>
              <span>${(parseFloat(getTotalPrice()) + 5).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-amber-700 mb-4">Each purchase directly supports independent artisans</p>
            <button 
              onClick={handleCheckout}
              disabled={isLoading} 
              className="w-full px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-md font-medium transition-colors disabled:bg-amber-400"
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-amber-700 mb-4">Your collection is empty.</p>
          <p className="text-amber-600 text-sm mb-4">Discover unique handcrafted treasures from our skilled artisans.</p>
          <button className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md transition-colors">
            Explore Artisanal Goods
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-4 border border-amber-200">
            <p className="mb-4 text-amber-900">Remove this artisanal item from your collection?</p>
            <div className="flex justify-center space-x-4">
              <button 
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition-colors" 
                onClick={removeItem}
              >
                Yes, Remove
              </button>
              <button 
                className="px-4 py-2 bg-white border border-amber-300 text-amber-800 rounded-md hover:bg-amber-50 transition-colors" 
                onClick={() => setShowModal(false)}
              >
                Keep Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanalCart;