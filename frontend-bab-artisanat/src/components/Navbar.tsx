import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    setIsLoggedIn(!!token);
    setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserId(null);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  // Close mobile menu when navigating
  const closeMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      document.body.style.overflow = "auto";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-amber-50 shadow-sm dark:bg-stone-900 text-stone-800 dark:text-amber-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="font-serif font-bold text-2xl text-amber-900 dark:text-amber-400">
              Bab-Artisanat
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-stone-700 hover:text-amber-800 dark:text-amber-100 dark:hover:text-amber-400 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-stone-700 hover:text-amber-800 dark:text-amber-100 dark:hover:text-amber-400 transition-colors">
              Products
            </Link>
            <Link to="/artisans" className="text-stone-700 hover:text-amber-800 dark:text-amber-100 dark:hover:text-amber-400 transition-colors">
              Artisans
            </Link>
            <Link to="/about" className="text-stone-700 hover:text-amber-800 dark:text-amber-100 dark:hover:text-amber-400 transition-colors">
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors" onClick={closeMenu}>
                  <Heart size={22} className="text-stone-700 dark:text-amber-100" />
                </Link>
                <Link to="/cart" className="relative p-2 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors" onClick={closeMenu}>
                  <ShoppingCart size={22} className="text-stone-700 dark:text-amber-100" />
                </Link>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-3">
                    <Link to="/dashboard" className="text-sm font-medium text-stone-700 hover:text-amber-800 dark:text-amber-100 dark:hover:text-amber-400 transition-colors">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-md border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md lg:hidden hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-stone-900 pt-20 px-6 overflow-y-auto lg:hidden">
          <nav className="flex flex-col space-y-6 text-lg">
            <Link to="/" className="py-2 border-b border-stone-200 dark:border-stone-700" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/products" className="py-2 border-b border-stone-200 dark:border-stone-700" onClick={closeMenu}>
              Products
            </Link>
            <Link to="/artisans" className="py-2 border-b border-stone-200 dark:border-stone-700" onClick={closeMenu}>
              Artisans
            </Link>
            <Link to="/about" className="py-2 border-b border-stone-200 dark:border-stone-700" onClick={closeMenu}>
              About
            </Link>

            {isLoggedIn ? (
              <div className="flex flex-col space-y-4 pt-6">
                <Link 
                  to="/dashboard" 
                  className="w-full py-3 text-center rounded-md border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/wishlist" 
                  className="w-full py-3 text-center rounded-md border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800"
                  onClick={closeMenu}
                >
                  Wishlist
                </Link>
                <Link 
                  to="/cart" 
                  className="w-full py-3 text-center rounded-md border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800"
                  onClick={closeMenu}
                >
                  Cart
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full py-3 text-center rounded-md bg-amber-600 text-white hover:bg-amber-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 pt-6">
                <Link 
                  to="/login" 
                  className="w-full py-3 text-center rounded-md border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="w-full py-3 text-center rounded-md bg-amber-600 text-white hover:bg-amber-700"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;