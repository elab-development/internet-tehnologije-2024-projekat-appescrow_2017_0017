import { useState } from "react";
import { api } from "../lib/api";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Payments() {
  const [paymentId, setPaymentId] = useState("1");
  const [file, setFile] = useState<File|null>(null);
  const [url, setUrl] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setMsg(""); setUrl("");
    if (!file) { setMsg("Odaberi fajl."); return; }

    const fd = new FormData();
    fd.append("file", file);

    const { data } = await api.post(`/payments/${paymentId}/attachment`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUrl(data.attachment_url);
    setMsg("Upload uspešan.");
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Breadcrumbs />
      <h1 className="text-2xl font-semibold mb-4">Upload potvrde uz Payment</h1>

      <form className="space-y-3" onSubmit={onUpload}>
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Payment ID"
          value={paymentId}
          onChange={(e)=>setPaymentId(e.target.value)}
        />
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
        <button className="px-3 py-2 rounded bg-black text-white" type="submit">Upload</button>
      </form>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
      {url && <p className="mt-2 text-sm">URL: <a className="underline" href={url} target="_blank">{url}</a></p>}
    </div>
  );
}
// Prikazuje formu za upload fajla kao potvrde uz određeni Payment ID