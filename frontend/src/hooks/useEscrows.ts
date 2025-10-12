import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Params = { status?: string; buyer_id?: number; page?: number };

export function useEscrows(params: Params) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.get("/escrows", { params })
      .then(r => setData(r.data))
      .catch(e => setError(e?.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [params.status, params.buyer_id, params.page]);

  return { data, loading, error };
}
// Hook za učitavanje escrow transakcija sa opcionalnim filterima (status, buyer_id, page)