import React from 'react';
import { Card, ListGroup, Badge, ProgressBar } from 'react-bootstrap';

function Rezultate({ voturi }) {
  const totalVoturi = Object.values(voturi).reduce((sum, val) => sum + val, 0);

  if (totalVoturi === 0) {
    return <p className="mt-4">Nu s-a înregistrat niciun vot încă.</p>;
  }

  // Sortare descrescătoare după număr voturi
  const voturiSortate = Object.entries(voturi).sort((a, b) => b[1] - a[1]);

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-4">Rezultate</Card.Title>
        <ListGroup variant="flush">
          {voturiSortate.map(([optiune, numarVoturi]) => {
            const procent = ((numarVoturi / totalVoturi) * 100).toFixed(1);
            return (
              <ListGroup.Item key={optiune}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-capitalize">{optiune}</strong>
                  <Badge bg="info">{procent}%</Badge>
                </div>
                <ProgressBar
                  now={procent}
                  label={`${numarVoturi} voturi`}
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