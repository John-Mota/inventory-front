import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createMaterial } from "../store/inventoryThunks";
import { clearError } from "../store/materialSlice";
import Spinner from "./Spinner";

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MaterialFormModal({ isOpen, onClose }: MaterialFormModalProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.material);

  const [name, setName] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number | "">("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = name.trim().length > 0 && stockQuantity !== "" && Number(stockQuantity) >= 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());

    if (!isFormValid) return;

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
        onClose();
      }, 1500);
    } catch {
      // Handled by slice
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Register raw material"
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Nova Matéria-Prima</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5">
          {showSuccess && (
            <div
              className="mb-4 rounded-lg border border-green-600 bg-green-900/40 px-4 py-3 text-green-300"
              role="alert"
            >
              ✅ Material salvo com sucesso!
            </div>
          )}

          {error && (
            <div
              className="mb-4 rounded-lg border border-red-600 bg-red-900/40 px-4 py-3 text-red-300"
              role="alert"
            >
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                autoFocus
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
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
