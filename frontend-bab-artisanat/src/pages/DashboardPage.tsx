import { Routes, Route } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Sidebar from "../components/SideBar";

// Stat Card Component
const StatCard = ({ title, count, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{count}</p>
  </div>
);

// Sample Data
const data = [
  { name: "Jan", users: 30, products: 20, revenue: 2400 },
  { name: "Feb", users: 40, products: 35, revenue: 3000 },
  { name: "Mar", users: 50, products: 40, revenue: 3800 },
  { name: "Apr", users: 60, products: 50, revenue: 4200 },
  { name: "May", users: 55, products: 45, revenue: 4000 },
  { name: "Jun", users: 70, products: 60, revenue: 5200 },
];

const pieData = [
  { name: "Search Engines", value: 30 },
  { name: "Direct Click", value: 30 },
  { name: "Bookmarks Click", value: 40 },
];

const COLORS = ["#f59e0b", "#a16207", "#365314"];

// Featured Products
const featuredProducts = [
  { id: 1, name: "Handcrafted Ceramic Mug", price: "$42", sold: 24, stock: 18 },
  { id: 2, name: "Woven Wool Throw Blanket", price: "$128", sold: 18, stock: 7 },
  { id: 3, name: "Olive Wood Cutting Board", price: "$85", sold: 12, stock: 15 },
  { id: 4, name: "Hand-Forged Copper Vase", price: "$149", sold: 8, stock: 4 },
];

// Recent Orders
const recentOrders = [
  { id: "#OD-7452", date: "Mar 12, 2025", customer: "Emma Thompson", total: "$234.00", status: "Completed" },
  { id: "#OD-7451", date: "Mar 11, 2025", customer: "James Wilson", total: "$185.00", status: "Processing" },
  { id: "#OD-7450", date: "Mar 10, 2025", customer: "Olivia Martinez", total: "$312.50", status: "Completed" },
  { id: "#OD-7449", date: "Mar 10, 2025", customer: "Noah Garcia", total: "$94.00", status: "Shipped" },
];

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome to your artisanal product store dashboard</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Products" count="124" color="text-emerald-600" />
          <StatCard title="Total Sales" count="$24,582" color="text-amber-600" />
          <StatCard title="Active Customers" count="847" color="text-blue-600" />
          <StatCard title="Avg. Order Value" count="$128" color="text-purple-600" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-serif font-semibold mb-4 text-gray-800">Visit and Sales Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e5e7eb", 
                    borderRadius: "0.375rem" 
                  }} 
                />
                <Bar dataKey="users" fill="#94a3b8" name="Visitors" />
                <Bar dataKey="products" fill="#65a30d" name="Products Sold" />
                <Bar dataKey="revenue" fill="#f59e0b" name="Revenue ($100s)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-serif font-semibold mb-4 text-gray-800">Traffic Sources</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-semibold text-gray-800">Featured Products</h2>
            <button className="text-sm px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition">
              View All Products
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {featuredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-amber-600 hover:text-amber-800 mr-3">Edit</button>
                      <button className="text-gray-600 hover:text-gray-800">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition">
              View All Orders
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-gray-600 hover:text-gray-800">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
};

export default Dashboard;