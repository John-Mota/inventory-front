import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createMaterial } from "../store/inventoryThunks";
import { clearError } from "../store/materialSlice";
import Spinner from "./Spinner";

export default function MaterialForm() {
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.material);

  const [name, setName] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number | "">("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());

    if (!name.trim() || stockQuantity === "" || stockQuantity < 0) {
      return;
    }

    try {
      await dispatch(
        createMaterial({
          name: name.trim(),
          stockQuantity: Number(stockQuantity),
        })
      ).unwrap();

      setName("");
      setStockQuantity("");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch {
      // Error is already handled by the slice and interceptor
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-white">
        Cadastrar Matéria-Prima
      </h1>

      {showSuccess && (
        <div
          className="mb-6 rounded-lg border border-green-600 bg-green-900/40 px-4 py-3 text-green-300"
          role="alert"
        >
          ✅ Material salvo com sucesso!
        </div>
      )}

      {error && (
        <div
          className="mb-6 rounded-lg border border-red-600 bg-red-900/40 px-4 py-3 text-red-300"
          role="alert"
        >
          ❌ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl"
        noValidate
      >
        {/* Name Field */}
        <div>
          <label
            htmlFor="material-name"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Nome
          </label>
          <input
            id="material-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Aço, Madeira, Plástico"
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Stock Quantity Field */}
        <div>
          <label
            htmlFor="stock-quantity"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Quantidade em Estoque
          </label>
          <input
            id="stock-quantity"
            type="number"
            required
            min={0}
            value={stockQuantity}
            onChange={(e) =>
              setStockQuantity(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            placeholder="Ex: 100"
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 transition-colors duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </button>
      </form>
    </div>
  );
}
