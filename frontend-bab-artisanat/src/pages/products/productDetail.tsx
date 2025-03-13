import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, ShoppingCart, Share2, ArrowLeft, Star, Truck, Shield, Clock } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (product && product.rating) {
      setRating(product.rating);
    }
  }, [product]);

  const handleRatingAndReview = async (newRating, review) => {
    if (!userId) {
      alert("Veuillez vous connecter pour noter ce produit.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/ratings/rate", {
        userId,
        productId: id,
        rating: newRating,
        review: review || null, 
      });
  
      if (response.status === 200) {
        setUserRating(newRating);
        alert("Votre avis a été soumis avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la note :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  

  useEffect(() => {
    if (!userId) return;
  
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data.product);
        setSelectedImage(response.data.product.images[0]);
  
        // Check if product is in favorites
        const favResponse = await axios.get(`http://localhost:3000/favorites/${userId}`);
        const favorites = favResponse.data.favorites;
  
        setIsFavorite(favorites.some(fav => fav.product._id === id));
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id, userId]);
  
  const toggleFavorite = async () => {
    if (!userId) {
      // Redirect to login or show login modal
      alert("Please login to add items to your wishlist");
      return;
    }
    
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:3000/favorites/remove`, {
          data: { userId, productId: id }
        });
      } else {
        await axios.post(`http://localhost:3000/favorites/add`, { userId, productId: id });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  const addToCart = async () => {
    if (!userId) {
      alert("Please login to add items to your cart");
      return;
    }
    
    // Add your cart logic here
    alert(`Added ${quantity} item(s) to cart`);
  };

  const buyNow = () => {
    if (!userId) {
      alert("Please login to proceed with purchase");
      return;
    }
    alert("Redirecting to checkout...");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-700">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-amber-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center mx-auto text-amber-700 hover:text-amber-800 font-medium"
          >
            <ArrowLeft size={18} className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-amber-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <p className="text-stone-700 font-medium text-lg mb-4">Product not found</p>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center mx-auto text-amber-700 hover:text-amber-800 font-medium"
          >
            <ArrowLeft size={18} className="mr-2" /> Return to Products
          </button>
        </div>
      </div>
    );
  }

  // Mock data for product details
  const productDetails = {
    artisan: "Hassan El Glaoui",
    region: "Fes",
    material: "Clay, Natural pigments",
    dimensions: "25cm x 18cm x 12cm",
    weight: "1.2 kg",
    technique: "Hand-thrown pottery, Traditional firing",
    careInstructions: "Clean with damp cloth. Avoid harsh chemicals."
  };

  return (
    <div className="bg-amber-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-stone-600">
          <a href="/" className="hover:text-amber-700">Home</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-amber-700">Products</a>
          <span className="mx-2">/</span>
          <a href={`/category/${product.category._id}`} className="hover:text-amber-700">{product.category.name}</a>
          <span className="mx-2">/</span>
          <span className="text-stone-400">{product.name}</span>
        </div>
      </div>

      <section className="py-10 md:py-16 container mx-auto px-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Product Images */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10">
          <div className="bg-stone-50 rounded-xl p-6 flex items-center justify-center mb-4 h-96">
            <img
              src={selectedImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`min-w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                  selectedImage === image ? "border-amber-600" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 border-l border-stone-100">
          <div className="mb-6">
          {product?.name && (
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-2">
              {product.name}
            </h1>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= (product?.rating || 0) ? "text-amber-500 fill-amber-500" : "text-stone-300"}
                />
              ))}
            </div>
            <span className="text-sm text-stone-500">
              {product?.rating || 0} ({product?.reviewsCount || 0} reviews)
            </span>
          </div>

          <h2 className="text-2xl font-bold text-amber-700 mb-2">
            {product?.price?.toLocaleString() || "N/A"} MAD
          </h2>
            <div className="flex items-center text-sm">
              <span className={`inline-block px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </span>
              <span className="text-stone-500 ml-3">
                {product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-stone-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label htmlFor="quantity" className="font-medium mr-4 text-stone-700">Quantity</label>
              <div className="flex h-10 w-32 border border-stone-300 rounded-lg overflow-hidden">
                <button
                  className="w-10 flex items-center justify-center hover:bg-stone-100 transition-colors"
                  onClick={() => setQuantity(qty => Math.max(1, qty - 1))}
                  disabled={product.stock <= 0}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  className="w-12 text-center border-x border-stone-300 bg-transparent focus:outline-none"
                  readOnly
                />
                <button
                  className="w-10 flex items-center justify-center hover:bg-stone-100 transition-colors"
                  onClick={() => setQuantity(qty => Math.min(product.stock, qty + 1))}
                  disabled={product.stock <= 0 || quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={buyNow}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center ${product.stock > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-400 cursor-not-allowed'} transition-colors`}
              >
                Buy Now
              </button>
              <button
                onClick={addToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 px-6 rounded-lg font-medium flex items-center justify-center ${product.stock > 0 ? 'border border-amber-600 text-amber-600 hover:bg-amber-50' : 'border border-stone-400 text-stone-400 cursor-not-allowed'} transition-colors`}
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
            </div>
            <div className="flex justify-between">
              <button
                onClick={toggleFavorite}
                className="py-2 px-4 text-stone-700 hover:text-amber-700 flex items-center transition-colors"
              >
                <Heart size={18} className={`mr-2 ${isFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
                {isFavorite ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
              <button className="py-2 px-4 text-stone-700 hover:text-amber-700 flex items-center transition-colors">
                <Share2 size={18} className="mr-2" />
                Share
              </button>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6 space-y-4">
            <div className="flex items-center">
              <Truck size={18} className="text-amber-600 mr-3" />
              <span className="text-stone-700">Handcrafted in Morocco, ships within 3-5 days</span>
            </div>
            <div className="flex items-center">
              <Shield size={18} className="text-amber-600 mr-3" />
              <span className="text-stone-700">Authentic artisanal product, certificate included</span>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="text-amber-600 mr-3" />
              <span className="text-stone-700">Each piece is handmade and unique</span>
            </div>
          </div>
        </div>
      </div>
    </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-stone-200">
            <div className="flex overflow-x-auto">
              <button 
                onClick={() => setActiveTab("description")} 
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${activeTab === "description" ? "text-amber-700 border-b-2 border-amber-600" : "text-stone-600 hover:text-amber-600"}`}
              >
                Product Details
              </button>
              <button 
                onClick={() => setActiveTab("reviews")} 
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${activeTab === "reviews" ? "text-amber-700 border-b-2 border-amber-600" : "text-stone-600 hover:text-amber-600"}`}
              >
                Reviews (12)
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "description" && (
              <div>
                <div className="prose max-w-none text-stone-700">
                  <p className="mb-4">
                    {product.description}
                  </p>
                  <p className="mb-6">
                    This beautiful piece showcases the centuries-old traditions of Moroccan craftsmanship, featuring intricate patterns that tell stories of cultural heritage and artistic excellence.
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-stone-800 mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(productDetails).map(([key, value]) => (
                      <div key={key} className="flex border-b border-stone-100 py-3">
                        <span className="w-1/3 text-stone-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="w-2/3 text-stone-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="md:flex gap-8 items-start">
                  <div className="md:w-1/3 bg-stone-50 p-6 rounded-lg mb-6 md:mb-0">
                  <div className="text-center mb-4">
                    <h3 className="text-3xl font-bold text-amber-700">{userRating || "4.0"}</h3>
                    <div className="flex justify-center my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={star <= (userRating || 4) ? "text-amber-500 fill-amber-500" : "text-stone-300"}
                          onClick={() => {
                            setUserRating(star);  // Update UI instantly
                            handleRating(star);   // Send rating to backend
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </div>
                    <p className="text-stone-500">Based on 12 reviews</p>
                  </div>

                    {/* Rating distribution */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center">
                          <span className="w-8 text-sm text-stone-600">{rating} ★</span>
                          <div className="flex-1 h-2 mx-2 bg-stone-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full" 
                              style={{ width: `${rating === 4 ? '60' : rating === 5 ? '30' : rating === 3 ? '10' : '0'}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-right text-sm text-stone-500">
                            {rating === 4 ? '7' : rating === 5 ? '4' : rating === 3 ? '1' : '0'}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full mt-6 py-2 px-4 border border-amber-600 text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors">
                      Write a Review
                    </button>
                  </div>
                  <div className="mt-6">
                  <h3 className="text-lg font-semibold text-stone-700">Donnez votre avis</h3>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={star <= userRating ? "text-amber-500 fill-amber-500" : "text-stone-300"}
                        onClick={() => handleRatingAndReview(star, reviewText)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full mt-2 p-2 border rounded-lg"
                    placeholder="Laissez un commentaire..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                  <button 
                    className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    onClick={() => handleRatingAndReview(userRating, reviewText)}
                  >
                    Soumettre
                  </button>
                </div>
                  
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-medium text-stone-800 mb-4">Customer Reviews</h3>
                    
                    {/* Sample reviews */}
                    <div className="space-y-6">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="border-b border-stone-100 pb-6">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium text-stone-800">Sarah L.</h4>
                            <span className="text-sm text-stone-500">3 months ago</span>
                          </div>
                          <div className="flex mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={16} 
                                className={star <= (index === 1 ? 5 : 4) ? "text-amber-500 fill-amber-500" : "text-stone-300"}
                              />
                            ))}
                          </div>
                          <p className="text-stone-700">
                            Beautiful craftsmanship! The details are even more impressive in person. The colors are vibrant and I love how each piece is truly unique. It's become a conversation piece in my home.
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <button className="mt-6 py-2 px-4 text-amber-600 font-medium hover:text-amber-700 transition-colors">
                      Load More Reviews
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </section>
    </div>
  );
};

export default ProductDetail;