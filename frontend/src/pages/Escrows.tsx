import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { useEscrows } from "../hooks/useEscrows";

export default function Escrows() {
  const [status, setStatus] = useState<string>("released"); // primer default
  const [buyerId, setBuyerId] = useState<string>("");
  const [page, setPage] = useState(1);

  const buyer_id = buyerId ? Number(buyerId) : undefined;
  const { data, loading, error } = useEscrows({ status, buyer_id, page });

  const items = data?.data ?? [];             // Laravel paginator
  const current = data?.current_page ?? page;
  const last = data?.last_page ?? current;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Breadcrumbs />
      <h1 className="text-2xl font-semibold mb-4">Escrows</h1>

      {/* Filteri */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2"
        >
          <option value="">(any status)</option>
          <option value="pending">pending</option>
          <option value="accepted">accepted</option>
          <option value="released">released</option>
          <option value="cancelled">cancelled</option>
        </select>

        <input
          className="border rounded px-3 py-2"
          placeholder="buyer_id (npr. 1)"
          value={buyerId}
          onChange={(e)=> { setBuyerId(e.target.value); setPage(1); }}
        />
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-3">
        {items.map((row:any) => (
          <div key={row.id} className="rounded-xl shadow p-4 bg-white">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">#{row.id} — {row.status}</div>
                <div className="text-sm text-gray-600">
                  {row.currency} {row.amount}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(row.created_at).toLocaleString()}
              </div>
            </div>
            {row.description && <p className="text-sm mt-2">{row.description}</p>}
          </div>
        ))}
        {!loading && items.length === 0 && <p>No results.</p>}
      </div>

      {/* Paginacija */}
      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-black text-white disabled:opacity-40"
          disabled={current <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span>Page {current} / {last}</span>
        <button
          className="px-3 py-1 rounded bg-black text-white disabled:opacity-40"
          disabled={current >= last}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
// Prikazuje listu escrow transakcija sa filterima i paginacijom