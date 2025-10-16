import { useState } from "react";
import { api } from "../lib/api";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";

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
    <Card body>
      <Form onSubmit={onUpload}>
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <Form.Label>Payment ID</Form.Label>
            <Form.Control value={paymentId} onChange={(e)=>setPaymentId(e.target.value)} />
          </Col>
          <Col md={6}>
            <Form.Label>Fajl</Form.Label>
            <Form.Control type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
          </Col>
          <Col md="auto">
            <Button type="submit">Upload</Button>
          </Col>
        </Row>
      </Form>
      {msg && <Alert variant="success" className="mt-3">{msg}</Alert>}
      {url && <div className="mt-2 small">URL: <a href={url} target="_blank">{url}</a></div>}
    </Card>
  );
}
