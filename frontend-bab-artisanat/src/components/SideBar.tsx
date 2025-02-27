import { Link } from "react-router-dom";
import { FaBox, FaList, FaUsers, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-72 h-screen bg-stone-600 text-white p-6 flex flex-col shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-neutral-50">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Link className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-stone-500" to="/">
          <FaChartBar className="text-xl" /> <span className="text-lg">Home</span>
        </Link>
        <Link className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-stone-500" to="/products/list">
          <FaBox className="text-xl" /> <span className="text-lg">Products</span>
        </Link>
        <Link className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-stone-500" to="/categories/list">
          <FaList className="text-xl" /> <span className="text-lg">Categories</span>
        </Link>
        <Link className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-stone-500" to="/users">
          <FaUsers className="text-xl" /> <span className="text-lg">Users</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
