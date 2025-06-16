import React, { useState } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';

function AsistentGPT() {
  const [intrebare, setIntrebare] = useState('');
  const [raspuns, setRaspuns] = useState('');
  const [loading, setLoading] = useState(false);

  const trimiteIntrebare = async (e) => {
    e.preventDefault();
    if (!intrebare.trim()) return;

    setLoading(true);
    setRaspuns('');
    setIntrebare(''); // Resetează câmpul de întrebare după trimitere

    try {
      const res = await axios.post('http://localhost:5000/api/chat/ask', {
        message: intrebare,
      });
      setRaspuns(res.data.reply);
    } catch (err) {
      setRaspuns('Eroare la comunicarea cu GPT.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mt-4 shadow-sm">
      <h4>Asistent Alegere Vot</h4>
      <Form onSubmit={trimiteIntrebare}>
        <Form.Control
          type="text"
          placeholder="Ex: Ce avantaje are candidatul x?"
          value={intrebare}
          onChange={(e) => setIntrebare(e.target.value)}
          className="mb-3"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Trimite întrebare'}
        </Button>
      </Form>

      {raspuns && (
        <Card.Text className="mt-4">
          <strong>Răspuns GPT:</strong><br />
          {raspuns}
        </Card.Text>
      )}
    </Card>
  );
}

export default AsistentGPT;