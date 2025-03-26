import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import { FaStar, FaTrash } from 'react-icons/fa';

interface Review {
  _id: string;
  review: string;
  userId: {
    name: string;
  };
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price?: number;
  imageUrl?: string;
  reviews?: Review[];
}

const ReviewPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('User ID is undefined');
      setError('User ID is missing. Please log in.');
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/user`, {
          params: { userId },
        });
        
        const productsArray = response.data.products || [];
        // Fetch reviews for each product
        const productsWithReviews = await Promise.all(
          productsArray.map(async (product: Product) => {
            try {
              const reviewsResponse = await axios.get(`http://localhost:3000/reviews/${product._id}`);
              return {
                ...product,
                reviews: reviewsResponse.data || []
              };
            } catch (err) {
              console.error(`Error fetching reviews for product ${product._id}:`, err);
              return {
                ...product,
                reviews: []
              };
            }
          })
        );
        setProducts(productsWithReviews);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId]);

  const handleDeleteReview = async () => {
    if (!reviewToDelete || !currentProductId) return;

    try {
      await axios.delete(`http://localhost:3000/reviews/${reviewToDelete}`);
      setProducts(prevProducts =>
        prevProducts.map(product => {
          if (product._id === currentProductId) {
            return {
              ...product,
              reviews: (product.reviews || []).filter(review => review._id !== reviewToDelete),
            };
          }
          return product;
        })
      );
    } catch (error) {
      console.error('Failed to delete review:', error);
    } finally {
      setReviewToDelete(null);
      setCurrentProductId(null);
    }
  };

  if (!userId) {
    return (
      <div className="flex bg-amber-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-amber-200 text-center">
            <h2 className="text-2xl font-serif text-amber-900 mb-4">Accès Restreint</h2>
            <p className="text-amber-800">Veuillez vous connecter pour voir vos produits et avis.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-amber-50 min-h-screen">
      <Sidebar />
      <div className="overflow-x-auto p-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif text-amber-900 relative inline-block">
              Avis des Clients
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-amber-700"></div>
            </h2>
            <p className="text-amber-800 mt-2 italic">Gérez les avis sur vos créations artisanales</p>
          </div>

          {loading ? (
            <div className="text-center p-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-700 border-t-transparent"></div>
              <p className="mt-2 text-amber-800">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 p-6 text-center">
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                <p>Erreur: {error}</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 p-8 text-center">
              <p className="text-amber-800">Aucun produit trouvé.</p>
              <p className="mt-2 text-sm text-amber-600">Ajoutez des produits pour recevoir des avis.</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductItem 
                key={product._id} 
                product={product} 
                onDeleteReview={(reviewId) => {
                  setReviewToDelete(reviewId);
                  setCurrentProductId(product._id);
                }}
              />
            ))
          )}
        </div>
      </div>

      {reviewToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm border border-amber-200 animate-fadeIn">
            <div className="text-center mb-4 text-amber-700">
              <FaTrash className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-bold text-amber-900 text-center">Confirmer la suppression</h3>
            <p className="text-amber-800 mt-2 text-center">
              Êtes-vous sûr de vouloir supprimer cet avis ?
            </p>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-amber-700 bg-white rounded-md hover:bg-amber-50 transition border border-amber-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-700 rounded-md hover:bg-amber-800 transition"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ProductItemProps {
  product: Product;
  onDeleteReview: (reviewId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onDeleteReview }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 mb-6">
      <div className="p-5 border-b border-amber-200 bg-amber-100">
        <h3 className="text-xl font-medium text-amber-900">{product.name}</h3>
        <p className="text-amber-700 mt-1">{product.description}</p>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4">
          <FaStar className="text-amber-500 mr-2" />
          <h4 className="text-lg font-medium text-amber-900">Avis clients</h4>
        </div>

        {product.reviews?.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-amber-800">Aucun avis pour ce produit.</p>
          </div>
        ) : (
          <ul className="divide-y divide-amber-100">
            {product.reviews?.map((review) => (
              <li key={review._id} className="py-4 hover:bg-amber-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-amber-900">{review.userId.name}</p>
                    <p className="text-amber-800 mt-1">{review.review}</p>
                  </div>
                  <button
                    onClick={() => onDeleteReview(review._id)}
                    className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 transition border border-amber-300 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;