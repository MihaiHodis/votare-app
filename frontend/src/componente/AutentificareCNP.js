import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

function AutentificareCNP({ onCnpConfirmat }) {
  const [cnp, setCnp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cnp || cnp.length !== 13) {
      setError("Introduceți un CNP valid (13 cifre)");
      return;
    }

    try {
      // Cerere la backend pentru a verifica CNP-ul
      const res = await axios.get(`http://localhost:5000/check-cnp/${cnp}`);

      if (res.data.hasVoted) {
        localStorage.setItem("votCNP", cnp);
        localStorage.setItem("hasVoted", "true");
      } else {
        localStorage.setItem("votCNP", cnp);
        localStorage.setItem("hasVoted", "false");
      }

      onCnpConfirmat(cnp);
    } catch (err) {
      setError("Eroare la verificarea CNP-ului.");
    }
  };

  return (
    <Card className="p-4 m-4">
      <h4>Introduceți CNP-ul pentru a vota</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          placeholder="CNP (13 cifre)"
          value={cnp}
          onChange={(e) => setCnp(e.target.value)}
          maxLength={13}
          className="mb-3"
        />
        <Button type="submit" variant="primary">Continuă</Button>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Form>
    </Card>
  );
}

export default AutentificareCNP;