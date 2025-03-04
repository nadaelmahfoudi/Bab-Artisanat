import React, { useState, useEffect } from "react";
import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");

  const handleCheckout = async () => {
    if (!userId) return;
  
    try {
      const response = await axios.post("http://localhost:3000/cart/checkout", { userId });
      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe checkout
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:3000/cart/${userId}`)
      .then((response) => {
        setCartItems(response.data.items.map((item: any) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          image: item.productId.images[0],
        })));
      })
      .catch((error) => console.error("Error fetching cart:", error));
  }, [userId]);

  const updateQuantity = (id: string, quantity: number) => {
    if (!userId || quantity < 1) return;
  
    axios
      .patch("http://localhost:3000/cart/update", { userId, productId: id, quantity }, {
        headers: { "Content-Type": "application/json" }
      })
      .then((response) => {
        setCartItems(response.data.cart.items.map((item: any) => ({
          id: item.productId,  // Récupère l'ID directement
          name: item.name,      // Prends le nom de l'objet retourné
          price: item.price,
          quantity: item.quantity,
          image: item.image || "default-image.jpg", // Utilise item.image au lieu de productId.images[0]
        })));        
      })
      .catch((error) => console.error("Error updating quantity:", error));
  };
  
  const confirmRemoveItem = (id: string) => {
    setSelectedItem(id);
    setShowModal(true);
  };

  const removeItem = () => {
    if (!userId || !selectedItem) return;
  
    axios
      .request({
        method: "DELETE",
        url: "http://localhost:3000/cart/remove",
        data: { userId, productId: selectedItem },
        headers: { "Content-Type": "application/json" }
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setCartItems(response.data.cart.items.map((item: any) => ({
          id: item.productId,  // Récupère l'ID directement
          name: item.name,      // Prends le nom de l'objet retourné
          price: item.price,
          quantity: item.quantity,
          image: item.image || "default-image.jpg", // Utilise item.image au lieu de productId.images[0]
        })));
        
        setShowModal(false);
        setSelectedItem(null);
      })
      .catch((error) => console.error("Error removing item:", error));
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between items-center bg-white p-2 mb-2 rounded-lg shadow-sm">
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded mr-3" />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center">
                <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span className="px-3">{item.quantity}</span>
                <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                <span className="ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                <button className="ml-4 px-3 py-1 bg-red-500 text-white rounded" onClick={() => confirmRemoveItem(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
      <div className="mt-4 text-lg font-semibold">Total: ${getTotalPrice()}</div>
      <button 
        onClick={handleCheckout} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Checkout
      </button>

      
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <p className="mb-4">Are you sure you want to remove this item?</p>
            <button className="px-4 py-2 bg-red-500 text-white rounded mr-2" onClick={removeItem}>Yes</button>
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;