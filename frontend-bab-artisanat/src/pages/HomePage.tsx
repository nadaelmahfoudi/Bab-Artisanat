import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import headerImage from "../assets/Zelij1.png";
import ProductList from "../components/ProductList";
import { ChevronRight, Star, MapPin, Eye } from "lucide-react";

const HomePage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Pottery", icon: "🏺", count: 28 },
    { id: 2, name: "Carpets", icon: "🧶", count: 45 },
    { id: 3, name: "Zelij", icon: "🔷", count: 36 },
    { id: 4, name: "Leather", icon: "👝", count: 22 },
    { id: 5, name: "Woodwork", icon: "🪑", count: 31 },
    { id: 6, name: "Metal Work", icon: "⚒️", count: 19 }
  ]);

  const [featuredArtisans, setFeaturedArtisans] = useState([
    {
      id: 1,
      name: "Ahmed Benchekroun",
      location: "Fes",
      specialty: "Traditional Pottery",
      rating: 4.8,
      image: "/api/placeholder/300/300"
    },
    {
      id: 2,
      name: "Fatima Zahra",
      location: "Marrakech",
      specialty: "Carpet Weaving",
      rating: 4.9,
      image: "/api/placeholder/300/300"
    },
    {
      id: 3,
      name: "Youssef El Mansouri",
      location: "Tetouan",
      specialty: "Zelij Mosaics",
      rating: 4.7,
      image: "/api/placeholder/300/300"
    }
  ]);

  return (
    <div className="bg-amber-50 text-stone-800">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden h-screen max-h-[700px]">
        {/* Background Image with Light Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url(${headerImage})`,
            filter: "blur(2px)"
          }}
        ></div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 container px-4 mx-auto h-full flex items-center">
          <div className="md:max-w-3xl mx-auto flex justify-center items-center text-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white leading-tight md:text-5xl lg:text-6xl mb-6"
                style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.5)" }}>
                Discover the Beauty of Moroccan Artisanat
              </h1>
              <p className="text-lg md:text-xl text-white leading-relaxed mb-8 max-w-2xl mx-auto"
                style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" }}>
                Explore the rich heritage of handcrafted Moroccan treasures, from
                intricate zelij tiles to beautifully woven carpets. Each piece
                tells a story of tradition, skill, and timeless artistry.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/products" className="bg-amber-600 hover:bg-amber-700 text-white text-lg font-medium py-3 px-8 rounded-full shadow-lg transition duration-300">
                  Explore Products
                </Link>
                <Link to="/artisans" className="bg-transparent border-2 border-white hover:bg-white/10 text-white text-lg font-medium py-3 px-8 rounded-full shadow-lg transition duration-300">
                  Meet Artisans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Discover Our Categories
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Explore the diverse world of Moroccan craftsmanship across our carefully curated categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/category/${category.id}`}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg p-6 text-center transition-all duration-300 flex flex-col items-center"
              >
                <span className="text-4xl mb-3">{category.icon}</span>
                <h3 className="font-medium text-stone-800 mb-1">{category.name}</h3>
                <p className="text-sm text-stone-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-amber-50">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-2">
                Featured Products
              </h2>
              <p className="text-lg text-stone-600">
                Handpicked selection of our finest artisanal treasures
              </p>
            </div>
            <Link to="/products" className="hidden md:flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors">
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {/* Product List Component */}
          <ProductList />

          <div className="mt-8 text-center md:hidden">
            <Link to="/products" className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors">
              View All Products <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artisans Section */}
      <section className="py-16 bg-stone-100">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Meet Our Master Artisans
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Behind every piece is a skilled artisan with generations of expertise and passion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtisans.map((artisan) => (
              <Link 
                key={artisan.id}
                to={`/artisan/${artisan.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <img 
                    src={artisan.image} 
                    alt={artisan.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xl text-stone-800">{artisan.name}</h3>
                    <div className="flex items-center">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <span className="ml-1 text-stone-700">{artisan.rating}</span>
                    </div>
                  </div>
                  <p className="text-stone-600 mb-2">{artisan.specialty}</p>
                  <div className="flex items-center text-stone-500">
                    <MapPin size={16} className="mr-1" />
                    <span>{artisan.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/artisans" className="bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 px-8 rounded-full shadow transition duration-300">
              Discover All Artisans
            </Link>
          </div>
        </div>
      </section>

      {/* Moroccan Heritage Section */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="container px-4 mx-auto">
          <div className="lg:flex items-center">
            <div className="lg:w-1/2 lg:pr-16 mb-8 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Preserving Moroccan Heritage
              </h2>
              <p className="text-lg mb-6 text-amber-50">
                For centuries, Moroccan artisans have passed down their craft from generation to generation. Each piece in our collection represents a living heritage, a story of traditional techniques, and cultural significance.
              </p>
              <p className="text-lg mb-8 text-amber-50">
                By supporting these artisans, you help preserve these ancient crafts and empower the communities that keep these traditions alive.
              </p>
              <Link to="/about" className="inline-block bg-white text-amber-700 hover:bg-amber-50 font-medium py-3 px-8 rounded-full shadow transition duration-300">
                Learn About Our Mission
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-amber-500 rounded-lg overflow-hidden">
                <img src="/api/placeholder/400/400" alt="Moroccan pottery" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-amber-500 rounded-lg overflow-hidden">
                <img src="/api/placeholder/400/400" alt="Moroccan carpet weaving" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-amber-500 rounded-lg overflow-hidden">
                <img src="/api/placeholder/400/400" alt="Zelij craftsman" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-amber-500 rounded-lg overflow-hidden">
                <img src="/api/placeholder/400/400" alt="Leather tanning" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-stone-800 text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-stone-300 mb-8">
              Subscribe to receive updates on new arrivals, special offers, and stories from our artisans
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow py-3 px-4 rounded-full text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-full transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;