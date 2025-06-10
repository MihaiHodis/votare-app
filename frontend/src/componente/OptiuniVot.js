import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

function OptiuniVot({ optiune, voturi, imagePath, cnp, onVote, aVotat }) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleVote = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/vote", {
        option: optiune,
        cnp: cnp, // vine din props
      });

      setSuccess("Votul a fost înregistrat cu succes!");
      onVote(optiune, res.data); // trimitem voturile actualizate
      localStorage.setItem('votCNP', cnp); // salvăm CNP-ul în localStorage
    } catch (err) {
      console.error("Eroare la vot:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Eroare la trimiterea votului");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Img
        variant="top"
        src={imagePath || "/images/vote-bg.jpg"}
        alt={`Imagine ${optiune}`}
      />
      <Card.Body>
        <Card.Title>{optiune}</Card.Title>
        <Card.Text>{voturi} voturi</Card.Text>
        <Button
          variant="primary"
          onClick={handleVote}
          disabled={loading || aVotat}
        >
          {loading
            ? "Se trimite..."
            : aVotat
            ? "Vot deja înregistrat"
            : "Votează"}
        </Button>
        {success && <p className="text-success mt-2">{success}</p>}
        {error && <p className="text-danger mt-2">{error}</p>}
      </Card.Body>
    </Card>
  );
}

export default OptiuniVot;
