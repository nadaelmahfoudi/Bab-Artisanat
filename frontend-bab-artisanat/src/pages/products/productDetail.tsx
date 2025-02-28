import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data.product);
        setSelectedImage(response.data.product.images[0]); // Default to first image
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <section className="py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
      <div className="container px-4 mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-6 lg:p-12">
            <div className="text-center mb-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="max-w-[300px] h-auto mx-auto"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 justify-center">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index}`}
                  className={`w-16 h-16 cursor-pointer border-2 ${selectedImage === image ? "border-blue-600" : "border-transparent"}`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl md:text-4xl font-medium mb-4">{product.name}</h1>
          <p className="opacity-70 my-4">{product.description}</p>
          <h3 className="text-2xl text-blue-600 font-medium">Rs. {product.price}</h3>
          <p className="opacity-70 my-4">Stock disponible: {product.stock}</p>
          <p className="opacity-70 my-4">Catégorie: {product.category.name}</p>

          {/* Quantity Selection */}
          <div className="mb-6">
            <h5 className="font-medium mb-2">QTY</h5>
            <div className="flex h-11 w-24">
              <button
                className="w-1/3 border border-black dark:border-white"
                onClick={() => setQuantity(qty => Math.max(1, qty - 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                className="w-2/3 text-center border border-black dark:border-white bg-transparent focus:outline-none"
                readOnly
              />
              <button
                className="w-1/3 border border-black dark:border-white"
                onClick={() => setQuantity(qty => qty + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white rounded px-10 py-2.5">BUY NOW</button>
              <button className="border border-blue-600 text-blue-600 rounded px-10 py-2.5">ADD TO CART</button>
            </div>
            <div className="flex gap-4">
              <button className="text-blue-600">❤️ Add To Wishlist</button>
              <button className="text-blue-600">🔗 Share</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
