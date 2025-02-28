import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import LoginPage from "./pages/Login"; 
import RegisterPage from "./pages/Register"; 
import DashboardPage from "./pages/DashboardPage";
import ListProduct from "./pages/products/listProduct";
import AddProduct from "./pages/products/addProduct";
import EditProduct from "./pages/products/editProduct"; 
import ListCategory from "./pages/categories/listCategory";
import ProductDetail from "./pages/products/productDetail";

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
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/categories/list" element={<ListCategory />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </Router>
  );
}
