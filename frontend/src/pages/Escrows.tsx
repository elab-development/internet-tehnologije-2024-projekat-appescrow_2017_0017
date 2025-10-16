import { useState } from "react";
import { useEscrows } from "../hooks/useEscrows";
import { Row, Col, Card, Badge, Form, Button, Pagination, Alert } from "react-bootstrap";

function statusVariant(s?: string) {
  switch (s) {
    case "released": return "success";
    case "accepted": return "warning";
    case "cancelled": return "danger";
    default: return "secondary";
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
      <div className="d-flex align-items-end gap-2 mb-3">
        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Select value={status} onChange={(e)=>{ setStatus(e.target.value); setPage(1); }}>
            <option value="">(any)</option>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="released">released</option>
            <option value="cancelled">cancelled</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Buyer ID</Form.Label>
          <Form.Control placeholder="npr. 1" value={buyerId} onChange={(e)=>{ setBuyerId(e.target.value); setPage(1); }} />
        </Form.Group>
        <div className="ms-auto">
          <Button variant="outline-secondary" onClick={()=>setPage(1)}>Primeni</Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} xl={3} className="g-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Col key={i}><Card body className="placeholder-glow">
                <span className="placeholder col-4" /> <span className="placeholder col-2 ms-2" />
                <div className="mt-2"><span className="placeholder col-6" /></div>
                <div className="mt-2"><span className="placeholder col-8" /></div>
              </Card></Col>
            ))
          : items.map((row:any) => (
              <Col key={row.id}>
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="text-muted">#{row.id}</div>
                        <div className="fw-semibold">{row.currency} {row.amount}</div>
                      </div>
                      <Badge bg={statusVariant(row.status)} className="text-uppercase">{row.status}</Badge>
                    </div>
                    {row.description && <div className="mt-2 small text-muted">{row.description}</div>}
                    <div className="mt-2 small text-muted">Created: {new Date(row.created_at).toLocaleString()}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))
        }
      </Row>

      {!loading && items.length === 0 && (
        <Alert variant="secondary" className="mt-3">Nema rezultata — promeni filtere.</Alert>
      )}

      <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
        <Pagination>
          <Pagination.Prev disabled={current<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}/>
          <Pagination.Item active>{current}</Pagination.Item>
          <Pagination.Next disabled={current>=last} onClick={()=>setPage(p=>p+1)}/>
        </Pagination>
      </div>
    </>
  );
}
