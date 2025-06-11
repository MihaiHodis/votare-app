import React from 'react';
import { Card, ListGroup, Badge, ProgressBar } from 'react-bootstrap';

function Rezultate({ voturi }) {
  if (!Array.isArray(voturi) || voturi.length === 0) {
    return <p className="mt-4">Nu s-a înregistrat niciun vot încă.</p>;
  }

  const totalVoturi = voturi.reduce((sum, opt) => sum + opt.voturi, 0);

  const voturiSortate = [...voturi].sort((a, b) => b.voturi - a.voturi);

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-4">Rezultate</Card.Title>
        <ListGroup variant="flush">
          {voturiSortate.map((opt) => {
            const procent = totalVoturi ? ((opt.voturi / totalVoturi) * 100).toFixed(1) : 0;
            return (
              <ListGroup.Item key={opt.id}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>{opt.nume}</strong>
                  <Badge bg="info">{procent}%</Badge>
                </div>
                <ProgressBar
                  now={procent}
                  label={`${opt.voturi} voturi`}
                  striped
                  variant="primary"
                />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
        <p className="mt-3 text-end text-muted">
          Total voturi: <strong>{totalVoturi}</strong>
        </p>
      </Card.Body>
    </Card>
  );
}

export default Rezultate;
