import { useState, useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createProduct, fetchMaterials } from "../store/inventoryThunks";
import { clearError } from "../store/materialSlice";
import Spinner from "./Spinner";

interface MaterialEntry {
  materialId: string;
  neededQuantity: number;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatCurrencyInput(raw: string): string {
  // Remove tudo que não é dígito
  const digits = raw.replace(/\D/g, "");
  // Converte para centavos → reais
  const cents = parseInt(digits || "0", 10);
  const value = (cents / 100).toFixed(2);
  // Formata com separador brasileiro
  const [intPart, decPart] = value.split(".");
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedInt},${decPart}`;
}

function parseCurrencyValue(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  return parseInt(digits || "0", 10) / 100;
}

export default function ProductFormModal({ isOpen, onClose }: ProductFormModalProps) {
  const dispatch = useAppDispatch();
  const { materials, loading, error } = useAppSelector((state) => state.material);

  const [name, setName] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("0,00");
  const [entries, setEntries] = useState<MaterialEntry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && materials.length === 0) {
      dispatch(fetchMaterials());
    }
  }, [dispatch, isOpen, materials.length]);

  const priceValue = parseCurrencyValue(priceDisplay);

  const isFormValid =
    name.trim().length > 0 &&
    priceValue > 0 &&
    entries.length > 0 &&
    entries.every((e) => e.materialId !== "" && e.neededQuantity > 0);

  const addEntry = () => {
    if (materials.length === 0) return;
    setEntries((prev) => [
      ...prev,
      { materialId: materials[0].id, neededQuantity: 1 },
    ]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof MaterialEntry, value: string | number) => {
    setEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
    );
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPriceDisplay(formatCurrencyInput(raw));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());
    if (!isFormValid) return;

    try {
      await dispatch(
        createProduct({
          name: name.trim(),
          value: priceValue,
          materials: entries,
        })
      ).unwrap();

      setName("");
      setPriceDisplay("0,00");
      setEntries([]);
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
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-8"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Register product"
    >
      <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Novo Produto</h2>
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

        {/* Body */}
        <div className="px-6 py-5">
          {showSuccess && (
            <div className="mb-4 rounded-lg border border-green-600 bg-green-900/40 px-4 py-3 text-green-300" role="alert">
              ✅ Produto salvo com sucesso!
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-600 bg-red-900/40 px-4 py-3 text-red-300" role="alert">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Product Name */}
            <div>
              <label htmlFor="product-name" className="mb-2 block text-sm font-medium text-gray-300">
                Nome do Produto
              </label>
              <input
                id="product-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Estrutura de Aço, Cadeira de Madeira"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                autoFocus
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-gray-300">
                Valor (R$)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                <input
                  id="product-price"
                  type="text"
                  inputMode="numeric"
                  required
                  value={priceDisplay}
                  onChange={handlePriceChange}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 pl-11 pr-4 py-2.5 text-white placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>
            </div>

            {/* Materials Section */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Materiais Necessários</label>
                <button
                  type="button"
                  onClick={addEntry}
                  disabled={materials.length === 0}
                  className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  + Adicionar Material
                </button>
              </div>

              {materials.length === 0 && (
                <p className="rounded-lg border border-amber-600/30 bg-amber-900/20 px-4 py-3 text-sm text-amber-300">
                  ⚠️ Nenhuma matéria-prima disponível. Cadastre materiais primeiro.
                </p>
              )}

              {entries.length === 0 && materials.length > 0 && (
                <p className="text-sm text-gray-500">
                  Clique em "+ Adicionar Material" para associar matérias-primas.
                </p>
              )}

              <div className="max-h-48 space-y-3 overflow-y-auto">
                {entries.map((entry, index) => (
                  <div key={index} className="flex items-end gap-3 rounded-lg bg-gray-700/50 p-3">
                    <div className="flex-1">
                      <label htmlFor={`mat-select-${index}`} className="mb-1 block text-xs font-medium text-gray-400">
                        Material
                      </label>
                      <select
                        id={`mat-select-${index}`}
                        value={entry.materialId}
                        onChange={(e) => updateEntry(index, "materialId", e.target.value)}
                        className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      >
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} (estoque: {m.stockQuantity})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <label htmlFor={`mat-qty-${index}`} className="mb-1 block text-xs font-medium text-gray-400">
                        Qtd.
                      </label>
                      <input
                        id={`mat-qty-${index}`}
                        type="number"
                        min={1}
                        value={entry.neededQuantity}
                        onChange={(e) => updateEntry(index, "neededQuantity", Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                      aria-label={`Remove material ${index + 1}`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
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
                  "Salvar Produto"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
