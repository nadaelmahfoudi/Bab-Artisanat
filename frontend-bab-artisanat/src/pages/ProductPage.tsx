import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search, Filter, X, RefreshCw } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  images: string[];
  category: { _id: string; name: string }; 
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  categories: string[]; 
}

const ProductPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") || "");
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [hoverProductId, setHoverProductId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    categories: [], 
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProducts();

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  useEffect(() => {
    // Update URL with search parameters
    const params: { [key: string]: string } = {};
    if (searchQuery) params.q = searchQuery;
    if (activeCategory !== "all") params.category = activeCategory;
    setSearchParams(params);

    // Apply filters and search
    applyFiltersAndSearch();
  }, [searchQuery, activeCategory, filterOptions, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
      setError(null);

      // Find max price for range slider
      const maxProductPrice = Math.max(...response.data.products.map((p: Product) => p.price), 1000);

      setFilterOptions(prev => ({
        ...prev,
        maxPrice: maxProductPrice,
      }));
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
    const categories = products.map(product => product.category.name);
    return ["all", ...Array.from(new Set(categories))];
  };

  const applyFiltersAndSearch = () => {
    let results = [...products];

    // Apply category filter
    if (activeCategory !== "all") {
      results = results.filter(product => product.category.name === activeCategory);
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      results = results.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category.name.toLowerCase().includes(query))
      );
    }

    // Apply price range filter
    results = results.filter(product =>
      product.price >= filterOptions.minPrice &&
      product.price <= filterOptions.maxPrice
    );

    // Apply in-stock filter
    if (filterOptions.inStock) {
      results = results.filter(product => product.stock > 0);
    }

    setFilteredProducts(results);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setFilterOptions({
      minPrice: 0,
      maxPrice: Math.max(...products.map(p => p.price), 1000),
      inStock: false,
      categories: [],
    });
    setSearchQuery("");
    setActiveCategory("all");
  };

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
        <header className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-4">Discover Artisanal Treasures</h1>
          <p className="text-amber-700 max-w-2xl mx-auto mb-8">
            Explore our curated collection of handcrafted pieces, each embodying generations
            of tradition and craftsmanship.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, description, or category..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-full px-5 py-3 pl-12 rounded-full border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors text-amber-900"
              />
              <Search className="absolute left-4 top-3.5 text-amber-500 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-20 top-3 text-amber-500 hover:text-amber-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-4 top-3 ${showFilters ? 'text-amber-800' : 'text-amber-500'} hover:text-amber-700`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Section */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md border border-amber-100 p-6 max-w-4xl mx-auto mb-8 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif font-medium text-amber-900">Refine Your Search</h3>
                <button
                  onClick={clearFilters}
                  className="flex items-center text-amber-600 hover:text-amber-800 text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="text-amber-800 font-medium block">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-700">${filterOptions.minPrice}</span>
                    <input
                      type="range"
                      min="0"
                      max={filterOptions.maxPrice}
                      value={filterOptions.minPrice}
                      onChange={(e) => setFilterOptions({ ...filterOptions, minPrice: parseInt(e.target.value) })}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
                    />
                    <span className="text-amber-700">${filterOptions.maxPrice}</span>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-amber-800 font-medium block">Category</label>
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-amber-300 rounded-md text-amber-800 bg-white focus:border-amber-500 focus:ring-amber-500"
                  >
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* In Stock Filter */}
                <div className="space-y-2">
                  <label className="text-amber-800 font-medium block">In Stock Only</label>
                  <input
                    type="checkbox"
                    checked={filterOptions.inStock}
                    onChange={(e) => setFilterOptions({ ...filterOptions, inStock: e.target.checked })}
                    className="rounded border-amber-300 text-amber-800 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category Filters */}
          <div className="mt-4 overflow-x-auto py-2">
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
                  {category}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Results Summary */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-amber-700 mb-2 sm:mb-0">
            {filteredProducts.length === 0
              ? "No products found"
              : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'}`}
            {(searchQuery || activeCategory !== "all" || filterOptions.inStock) && " with applied filters"}
          </p>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-amber-700">Sort by:</label>
            <select
              id="sort"
              className="border border-amber-300 rounded-md py-1 pl-3 pr-8 text-amber-800 bg-white focus:border-amber-500 focus:ring-amber-500"
              onChange={(e) => {
                const value = e.target.value;
                let sorted = [...filteredProducts];

                switch (value) {
                  case "price-asc":
                    sorted.sort((a, b) => a.price - b.price);
                    break;
                  case "price-desc":
                    sorted.sort((a, b) => b.price - a.price);
                    break;
                  case "name-asc":
                    sorted.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                  case "name-desc":
                    sorted.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                  default:
                    break;
                }

                setFilteredProducts(sorted);
              }}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
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
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-serif font-medium text-amber-900 transition-colors group-hover:text-amber-700">
                    {product.name}
                  </h3>
                  <span className="font-medium text-amber-800">${product.price.toFixed(2)}</span>
                </div>

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

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-amber-100 shadow-sm">
            <svg className="w-16 h-16 text-amber-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 className="text-xl font-serif text-amber-900 mb-4">No Artisanal Pieces Found</h3>
            <p className="text-amber-700 mb-6 max-w-md mx-auto">
              We couldn't find any items matching your current filters. Try adjusting your search criteria or browse our complete collection.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-md transition-colors inline-flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear All Filters
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

export default ProductPage;