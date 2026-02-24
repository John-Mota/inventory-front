import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMaterials } from "../store/inventoryThunks";
import Spinner from "./Spinner";
import MaterialFormModal from "./MaterialForm";

export default function MaterialsPage() {
  const dispatch = useAppDispatch();
  const { materials, loading } = useAppSelector((state) => state.material);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header with Add button */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Matérias-Primas</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adicionar Material
        </button>
      </div>

      {/* Table */}
      {loading && materials.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-gray-800 py-16">
          <p className="mb-4 text-lg text-gray-500">Nenhuma matéria-prima cadastrada ainda.</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Cadastrar primeiro material
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-sm text-gray-400">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Qtd. em Estoque</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr
                  key={material.id}
                  className="border-b border-gray-700/50 transition-colors hover:bg-gray-700/30"
                >
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                    {String(material.id).length > 8
                      ? `${String(material.id).slice(0, 8)}…`
                      : material.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{material.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        material.stockQuantity < 10
                          ? "bg-red-900/40 text-red-300"
                          : "bg-emerald-900/40 text-emerald-300"
                      }`}
                    >
                      {material.stockQuantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <MaterialFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
