import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import MaterialsPage from "./components/MaterialsPage";
import ProductsPage from "./components/ProductsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </main>
    </div>
  );
}
