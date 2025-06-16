import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

function FormularAdaugareOptiune({ onAdaugaOptiune }) {
  const [input, setInput] = useState('');
  const [imagine, setImagine] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const formData = new FormData();
    formData.append("nume", input.trim());
    if (imagine) formData.append("imagine", imagine);

    try {
      await axios.post('http://localhost:5000/add-option', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onAdaugaOptiune(input.trim());
      setInput('');
      setImagine(null);
      setError(null);
    } catch (err) {
      const raspuns = err.response?.data?.error || 'Eroare necunoscută';
      setError(raspuns);
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card className="p-4 shadow-sm mt-4" style={{ maxWidth: '600px', width: '100%' }}>
        <Card.Body>
          <Card.Title className="mb-3">Adaugă o opțiune nouă</Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Denumire opțiune</Form.Label>
              <Form.Control
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nume candidat"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagine opțională</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImagine(e.target.files[0])}
                accept="image/*"
              />
            </Form.Group>

            <Button variant="success" type="submit">Adaugă</Button>
          </Form>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FormularAdaugareOptiune;
