import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProductionSuggestions,
  fetchMaterials,
} from "../store/inventoryThunks";
import Spinner from "./Spinner";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-700 bg-gray-800 p-6">
      <div className="mb-3 h-4 w-24 rounded bg-gray-700" />
      <div className="h-8 w-32 rounded bg-gray-700" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-700">
      <td className="px-6 py-4"><div className="h-4 w-28 rounded bg-gray-700" /></td>
      <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-gray-700" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-gray-700" /></td>
    </tr>
  );
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { suggestions, materials, loading, error } = useAppSelector(
    (state) => state.material
  );

  useEffect(() => {
    dispatch(fetchProductionSuggestions());
    dispatch(fetchMaterials());
  }, [dispatch]);

  const totalRevenue = suggestions.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );

  const totalProducts = suggestions.length;

  const lowStockThreshold = 10;
  const lowStockMaterials = materials.filter(
    (m) => m.stockQuantity < lowStockThreshold
  );
  const hasLowStock = lowStockMaterials.length > 0;

  const sortedSuggestions = [...suggestions].sort(
    (a, b) => b.totalValue - a.totalValue
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-white">Painel</h1>

      {/* Error Banner */}
      {error && (
        <div
          className="mb-6 rounded-lg border border-red-600 bg-red-900/40 px-4 py-3 text-red-300"
          role="alert"
        >
          ❌ {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue Card */}
        {loading ? (
          <SkeletonCard />
        ) : (
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <p className="mb-1 text-sm font-medium text-gray-400">
              Receita Potencial Total
            </p>
            <p className="text-3xl font-bold text-emerald-400">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        )}

        {/* Total Products Card */}
        {loading ? (
          <SkeletonCard />
        ) : (
          <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
            <p className="mb-1 text-sm font-medium text-gray-400">
              Total de Produtos
            </p>
            <p className="text-3xl font-bold text-indigo-400">
              {totalProducts}
            </p>
          </div>
        )}

        {/* Stock Status Card */}
        {loading ? (
          <SkeletonCard />
        ) : (
          <div
            className={`rounded-xl border p-6 shadow-lg ${
              hasLowStock
                ? "border-amber-600 bg-amber-900/30"
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <p className="mb-1 text-sm font-medium text-gray-400">
              Status do Estoque
            </p>
            {hasLowStock ? (
              <>
                <p className="text-lg font-bold text-amber-400">
                  ⚠️ Estoque Baixo
                </p>
                <p className="mt-1 text-sm text-amber-300/80">
                  {lowStockMaterials.length}{" "}
                  {lowStockMaterials.length === 1 ? "material" : "materiais"} com
                  menos de {lowStockThreshold} unidades
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-emerald-400">
                ✅ Estoque OK
              </p>
            )}
          </div>
        )}
      </div>

      {/* Production Suggestions Table */}
      <div className="rounded-xl border border-gray-700 bg-gray-800 shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Sugestões de Produção
          </h2>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Spinner size="sm" />
              Carregando...
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-sm text-gray-400">
                <th className="px-6 py-3 font-medium">Produto</th>
                <th className="px-6 py-3 font-medium">Qtd. a Produzir</th>
                <th className="px-6 py-3 font-medium">Valor Total Potencial</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : sortedSuggestions.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Nenhuma sugestão de produção disponível no momento.
                  </td>
                </tr>
              ) : (
                sortedSuggestions.map((suggestion, index) => (
                  <tr
                    key={`${suggestion.productName}-${index}`}
                    className="border-b border-gray-700/50 transition-colors duration-150 hover:bg-gray-700/30"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {suggestion.productName}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className="inline-flex items-center rounded-full bg-indigo-900/40 px-3 py-1 text-sm font-medium text-indigo-300">
                        {suggestion.quantityToProduce}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {formatCurrency(suggestion.totalValue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block sm:hidden divide-y divide-gray-700">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Spinner size="lg" />
            </div>
          ) : sortedSuggestions.length === 0 ? (
            <p className="px-6 py-10 text-center text-gray-500">
              No production suggestions available at this time.
            </p>
          ) : (
            sortedSuggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.productName}-${index}`}
                className="px-6 py-4 space-y-2"
              >
                <p className="font-medium text-white">
                  {suggestion.productName}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Qtd. a Produzir</span>
                  <span className="inline-flex items-center rounded-full bg-indigo-900/40 px-3 py-1 font-medium text-indigo-300">
                    {suggestion.quantityToProduce}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Valor Total</span>
                  <span className="font-semibold text-emerald-400">
                    {formatCurrency(suggestion.totalValue)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
