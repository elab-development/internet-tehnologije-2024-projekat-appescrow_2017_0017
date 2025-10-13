import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import Header from "../components/Header";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { api } from "../lib/api";

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
    <>
      <Breadcrumbs />
      <Header title="Payments" subtitle="Upload potvrde o uplati (PDF/JPG/PNG)" />
      <Card>
        <form className="grid md:grid-cols-3 gap-4 items-end" onSubmit={onUpload}>
          <Input label="Payment ID" value={paymentId} onChange={e=>setPaymentId(e.target.value)} />
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Fajl</span>
            <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
          </label>
          <Button type="submit">Upload</Button>
        </form>
        {msg && <p className="text-sm mt-3">{msg}</p>}
        {url && <p className="text-sm mt-1">URL: <a className="underline" href={url} target="_blank">{url}</a></p>}
      </Card>
    </>
  );
}
// Prikazuje login formu sa opcijom brzog registrovanja