import React, { useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function OptiuniVot({ optiuneId, nume, voturi, imagine, cnp, onVote, aVotat }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVote = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!cnp || cnp.length !== 13) {
      setError('Introduceți un CNP valid (13 cifre)');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/vote', {
        option_id: optiuneId,
        cnp: cnp,
      });

      setSuccess('Votul a fost înregistrat cu succes!');
      localStorage.setItem('hasVoted', 'true'); // marchează că a votat
      onVote(optiuneId, res.data); // actualizează voturile în App
    } catch (err) {
      console.error('Eroare la vot:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Eroare la trimiterea votului');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 h-150 shadow-sm">
      {imagine && (
        <Card.Img
          variant="top"
          src={`/images/${imagine}`}
          alt={`Imagine pentru ${nume}`}
          style={{
            height: '370px',
            objectFit: 'cover',
            objectPosition: 'top center'
          }}
        />
      )}
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="fw-semibold">{nume}</Card.Title>
          <Card.Text>{voturi} voturi</Card.Text>
        </div>

        {aVotat ? (
          <Alert variant="info" className="mt-2">Ați votat deja.</Alert>
        ) : (
          <Form onSubmit={handleVote} className="mt-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Se trimite...' : 'Votează'}
            </Button>
          </Form>
        )}

        {success && <Alert variant="success" className="mt-2">{success}</Alert>}
        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      </Card.Body>
    </Card>
  );
}

export default OptiuniVot;
