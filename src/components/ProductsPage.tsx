import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProducts, fetchMaterials, deleteProduct } from "../store/inventoryThunks";
import Spinner from "./Spinner";
import ProductFormModal from "./ProductForm";
import type { Product } from "../types/inventory";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, materials, loading, error } = useAppSelector((state) => state.material);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    if (materials.length === 0) {
      dispatch(fetchMaterials());
    }
  }, [dispatch, materials.length]);

  const getMaterialName = (materialId: string) => {
    const found = materials.find((m) => m.id === materialId);
    return found ? found.name : `#${materialId}`;
  };

  const handleDelete = async (product: Product) => {
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      setDeleteConfirm(null);
    } catch {
      // error handled by slice
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header with Add button */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Produtos</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adicionar Produto
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-600 bg-red-900/40 px-4 py-3 text-red-300" role="alert">
          ❌ {error}
        </div>
      )}

      {/* Product List */}
      {loading && products.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-gray-800 py-16">
          <p className="mb-4 text-lg text-gray-500">Nenhum produto cadastrado ainda.</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Cadastrar primeiro produto
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-sm text-gray-400">
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
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
                      R$ {(product.value ?? 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setViewProduct(product)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-900/30"
                        title="Ver detalhes"
                      >
                        👁 Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditProduct(product)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-900/30"
                        title="Editar produto"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(product)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/30"
                        title="Excluir produto"
                      >
                        🗑 Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setViewProduct(null); }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Detalhes do Produto</h2>
              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Nome</p>
                <p className="text-lg font-semibold text-white">{viewProduct.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Valor</p>
                <p className="text-lg font-bold text-emerald-400">R$ {(viewProduct.value ?? 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Materiais Necessários</p>
                {(viewProduct.rawMaterials ?? []).length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum material associado.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(viewProduct.rawMaterials ?? []).map((mat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gray-700 px-3 py-1.5 text-sm text-gray-300"
                      >
                        {getMaterialName(mat.rawMaterialId)}
                        <span className="font-semibold text-indigo-400">×{mat.requiredQuantity}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="mt-2 w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
            <div className="px-6 py-5 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-900/30 text-3xl">
                🗑
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">Excluir Produto</h2>
              <p className="text-sm text-gray-400">
                Tem certeza que deseja excluir <strong className="text-white">{deleteConfirm.name}</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-3 border-t border-gray-700 px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Product Modal */}
      <ProductFormModal
        isOpen={isModalOpen || editProduct !== null}
        onClose={() => {
          setIsModalOpen(false);
          setEditProduct(null);
        }}
        initialData={editProduct}
      />
    </div>
  );
}
