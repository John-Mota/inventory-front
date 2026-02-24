import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MaterialForm from "./components/MaterialForm";

function Dashboard() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-2 text-gray-400">Welcome to InvenTrack inventory management system.</p>
    </div>
  );
}

function Products() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Products</h1>
      <p className="mt-2 text-gray-400">Product management coming soon.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/raw-materials" element={<MaterialForm />} />
        </Routes>
      </main>
    </div>
  );
}
