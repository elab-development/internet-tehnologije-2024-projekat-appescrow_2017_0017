import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Header from "../components/Header";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/EmptyState";
import { useEscrows } from "../hooks/useEscrows";

function statusColor(s?: string) {
  switch (s) {
    case "released": return "green";
    case "accepted": return "yellow"; 
    case "cancelled": return "red";
    default: return "gray";
  }
}

export default function Escrows() {
  const [status, setStatus] = useState<string>("released");
  const [buyerId, setBuyerId] = useState<string>("");
  const [page, setPage] = useState(1);

  const buyer_id = buyerId ? Number(buyerId) : undefined;
  const { data, loading, error } = useEscrows({ status, buyer_id, page });

  const items = data?.data ?? [];
  const current = data?.current_page ?? page;
  const last = data?.last_page ?? current;

  return (
    <>
      <Breadcrumbs />
      <Header
        title="Escrows"
        subtitle="Pregled, filter i paginacija escrow transakcija"
        right={
          <div className="flex gap-2">
            <Select label="Status" value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}}>
              <option value="">(any)</option>
              <option value="pending">pending</option>
              <option value="accepted">accepted</option>
              <option value="released">released</option>
              <option value="cancelled">cancelled</option>
            </Select>
            <Input label="Buyer ID" placeholder="npr. 1" value={buyerId} onChange={e=>{setBuyerId(e.target.value); setPage(1);}} />
            <Button variant="secondary" onClick={()=>setPage(1)}>Primeni</Button>
          </div>
        }
      />

      {loading && <Card>Učitavanje…</Card>}
      {error && <Card className="text-red-600">{error}</Card>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((row:any)=>(
          <Card key={row.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500">#{row.id}</div>
                <div className="font-semibold">{row.currency} {row.amount}</div>
              </div>
              <Badge color={statusColor(row.status)}>{row.status}</Badge>
            </div>
            {row.description && <p className="text-sm text-gray-700 mt-2">{row.description}</p>}
            <div className="text-xs text-gray-500 mt-3">Created: {new Date(row.created_at).toLocaleString()}</div>
          </Card>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <EmptyState title="Nema rezultata" subtitle="Pokušaj drugi status ili buyer_id." />
      )}

      <div className="flex items-center gap-2 mt-6">
        <Button variant="secondary" disabled={current<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</Button>
        <span className="text-sm">Page {current} / {last}</span>
        <Button variant="secondary" disabled={current>=last} onClick={()=>setPage(p=>p+1)}>Next</Button>
      </div>
    </>
  );
}
