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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
