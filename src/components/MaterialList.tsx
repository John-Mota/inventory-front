import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMaterials } from "../store/inventoryThunks";
import Spinner from "./Spinner";

export default function MaterialList() {
  const dispatch = useAppDispatch();
  const { materials, loading } = useAppSelector((state) => state.material);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  if (loading && materials.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        No raw materials registered yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700 text-sm text-gray-400">
            <th className="px-6 py-3 font-medium">ID</th>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Stock Quantity</th>
            <th className="px-6 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr
              key={material.id}
              className="border-b border-gray-700/50 transition-colors hover:bg-gray-700/30"
            >
              <td className="px-6 py-4 text-gray-400">{material.id}</td>
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
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Função 'Ver Material' em desenvolvimento")}
                    className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/30 text-gray-400 backdrop-blur-sm transition-all hover:bg-blue-500/20 hover:text-blue-400"
                    title="Ver Material"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Função 'Editar Material' em desenvolvimento")}
                    className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/30 text-gray-400 backdrop-blur-sm transition-all hover:bg-amber-500/20 hover:text-amber-400"
                    title="Editar Material"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L5.314 18l.8-3.15a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Função 'Excluir Material' em desenvolvimento")}
                    className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/30 text-gray-400 backdrop-blur-sm transition-all hover:bg-red-500/20 hover:text-red-400"
                    title="Excluir Material"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
