import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import LoginPage from "./pages/Login"; 
import RegisterPage from "./pages/Register"; 
import DashboardPage from "./pages/DashboardPage";
import ListProduct from "./pages/products/listProduct";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products/list" element={<ListProduct />} />
      </Routes>
      <Footer />
    </Router>
  );
}
