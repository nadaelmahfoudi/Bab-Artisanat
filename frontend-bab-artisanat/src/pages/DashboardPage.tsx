import { Routes, Route } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import Sidebar from "../components/SideBar";

const StatCard = ({ title, count, color }) => (
  <div className={`p-6 text-white rounded-2xl shadow-lg flex flex-col items-center ${color}`}>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="text-4xl font-extrabold mt-2">{count}</p>
  </div>
);

const data = [
  { name: "Jan", users: 30, products: 20 },
  { name: "Feb", users: 40, products: 35 },
  { name: "Mar", users: 50, products: 40 },
  { name: "Apr", users: 60, products: 50 },
];

const pieData = [
  { name: "Search Engines", value: 30 },
  { name: "Direct Click", value: 30 },
  { name: "Bookmarks Click", value: 40 },
];

const COLORS = ["#f59e0b", "#a16207", "#365314"];

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-8 text-amber-950">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Users" count={120} color="bg-amber-500" />
          <StatCard title="Products" count={80} color="bg-yellow-700" />
          <StatCard title="Categories" count={20} color="bg-lime-900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Visit and Sales Statistics</h2>
            <BarChart width={400} height={200} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#f59e0b" />
              <Bar dataKey="products" fill="#a16207" />
            </BarChart>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Traffic Sources</h2>
            <PieChart width={200} height={200}>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={60} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
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