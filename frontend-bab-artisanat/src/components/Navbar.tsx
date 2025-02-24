import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ezy__nav2 light py-6 bg-stone-300 dark:bg-[#0b1727] text-zinc-900 dark:text-white relative">
      <nav>
        <div className="container px-4">
          <div className="flex justify-between items-center">
            <a className="font-black text-amber-950 text-3xl pl-32" href="#">Bab-Artisanat</a>
            <button
              className="block lg:hidden cursor-pointer h-10 z-20"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="h-0.5 w-7 bg-black dark:bg-white -translate-y-2"></div>
              <div className="h-0.5 w-7 bg-black dark:bg-white"></div>
              <div className="h-0.5 w-7 bg-black dark:bg-white translate-y-2"></div>
            </button>
            <ul
              className={`flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-2 absolute h-screen w-screen top-0 left-full lg:left-0 lg:relative lg:h-auto lg:w-auto bg-white dark:bg-[#0b1727] lg:bg-transparent transition-transform duration-300 ${isOpen ? 'left-0' : ''}`}
            >
              <li>
                <Link to="/login">
                  <button className="border border-stone-600 text-stone-600 hover:bg-stone-600 hover:text-white py-1.5 px-4 rounded">
                    Login
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <button className="border border-stone-600 bg-stone-600 text-white hover:bg-opacity-90 py-1.5 px-4 rounded">
                    Register
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
