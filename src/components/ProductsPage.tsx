import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts, fetchMaterials } from "../store/inventoryThunks";
import Spinner from "./Spinner";
import ProductFormModal from "./ProductForm";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, materials, loading } = useAppSelector((state) => state.material);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    if (materials.length === 0) {
      dispatch(fetchMaterials());
    }
  }, [dispatch, materials.length]);

  const getMaterialName = (materialId: number) => {
    const found = materials.find((m) => m.id === materialId);
    return found ? found.name : `#${materialId}`;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header with Add button */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Product List */}
      {loading && products.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-gray-800 py-16">
          <p className="mb-4 text-lg text-gray-500">No products registered yet.</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Register your first product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-sm text-gray-400">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Materials</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-700/50 transition-colors hover:bg-gray-700/30"
                >
                  <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-emerald-400">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {product.materials.map((mat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-700 px-2.5 py-1 text-xs text-gray-300"
                        >
                          {getMaterialName(mat.materialId)}
                          <span className="text-indigo-400">×{mat.neededQuantity}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
