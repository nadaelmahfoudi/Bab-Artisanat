import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Heart, ShoppingCart, Share2, ArrowLeft, Truck, Shield, Clock } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        console.log("API Response:", response.data); // Log the response
    
        if (!response.data || !response.data.product) {
          setError("Product data not found in the response");
          return;
        }
    
        const productData = response.data.product;
        if (!productData) {
          setError("Product not found");
          return;
        }
    
        setProduct(productData);
        setSelectedImage(productData.images[0]);
    
        const favResponse = await axios.get(`http://localhost:3000/favorites/${userId}`);
        const favorites = favResponse.data.favorites;
    
        setIsFavorite(favorites.some(fav => fav.product && fav.product._id === id));
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id, userId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/reviews/${id}`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [id]);

  const toggleFavorite = async () => {
    if (!userId) {
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
    
    alert(`Added ${quantity} item(s) to cart`);
  };

  const buyNow = () => {
    if (!userId) {
      alert("Please login to proceed with purchase");
      return;
    }
    alert("Redirecting to checkout...");
  };

  const handleReviewSubmit = async () => {
    if (!userId) {
      alert("Veuillez vous connecter pour soumettre un avis.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/reviews", {
        userId,
        productId: id,
        review: reviewText,
      });
  
      if (response.status === 200) {
        setReviewText("");
        alert("Votre avis a été soumis avec succès !");
        const updatedReviews = await axios.get(`http://localhost:3000/reviews/${id}`);
        setReviews(updatedReviews.data);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
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

  // Define productDetails dynamically based on the product data
  const productDetails = {
    artisan: product?.artisan || "Unknown Artisan",
    region: product?.region || "Unknown Region",
    material: product?.material || "Unknown Material",
    dimensions: product?.dimensions || "Unknown Dimensions",
    weight: product?.weight || "Unknown Weight",
    technique: product?.technique || "Unknown Technique",
    careInstructions: product?.careInstructions || "No care instructions provided.",
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
                Reviews ({reviews.length})
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
              <div className="max-w-6xl mx-auto">
  <div className="md:flex gap-8 items-start">
    {/* Left sidebar */}
    <div className="md:w-1/3 bg-amber-50 p-6 rounded-lg shadow-sm mb-6 md:mb-0">
      <h3 className="text-xl font-semibold text-stone-800 mb-4">Write a Review</h3>
      <p className="text-stone-600 mb-4">Share your experience with our community!</p>
      <textarea
        className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
        placeholder="What did you think about our product or service?"
        rows="5"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      ></textarea>
      <div className="flex justify-between mt-4">
        <button 
          className="py-2 px-6 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-sm"
          onClick={handleReviewSubmit}
        >
          Submit
        </button>
        <button 
          className="py-2 px-4 border border-stone-300 text-stone-600 rounded-lg font-medium hover:bg-stone-100 transition-colors"
          onClick={() => setReviewText('')}
        >
          Cancel
        </button>
      </div>
    </div>

    {/* Main reviews section */}
    <div className="md:w-2/3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-stone-800">Customer Reviews</h2>
        <span className="text-stone-500">({reviews.length} reviews)</span>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
      {reviews.length === 0 ? (
  <div className="bg-stone-50 p-8 rounded-lg text-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-stone-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
    <p className="text-stone-600 mb-4">There are no reviews yet. Be the first to share your experience!</p>
    <button className="py-2 px-6 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-sm">
      Write a Review
    </button>
  </div>
) : (
  reviews.map((review) => (
    <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          {/* Access the user's name from the populated userId field */}
          <h4 className="font-medium text-stone-800">{review.userId?.name || "Anonymous User"}</h4>
          <span className="text-xs text-stone-500">
            {new Date(review.createdAt || new Date()).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        <button className="text-stone-400 hover:text-stone-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>
      <p className="text-stone-700">
        {review.review || "This product exceeded my expectations! The quality is excellent and the customer service was outstanding."}
      </p>
    </div>
  ))
)}
      </div>

      {/* Pagination */}
      {reviews.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button className="px-2 py-2 rounded-l-md border border-stone-300 bg-white text-stone-500 hover:bg-stone-50">
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="px-4 py-2 border border-amber-500 bg-amber-50 text-amber-600 hover:bg-amber-100">1</button>
            <button className="px-4 py-2 border border-stone-300 bg-white text-stone-500 hover:bg-stone-50">2</button>
            <button className="px-4 py-2 border border-stone-300 bg-white text-stone-500 hover:bg-stone-50">3</button>
            <button className="px-2 py-2 rounded-r-md border border-stone-300 bg-white text-stone-500 hover:bg-stone-50">
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
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