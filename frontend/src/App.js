// src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; // Importă fișierul CSS pentru stiluri globale
import NavbarPersonalizat from "./componente/NavbarPersonalizat";

import AsistentGPT from "./componente/AsistentGPT";
import OptiuniVot from "./componente/OptiuniVot";
import Rezultate from "./componente/Rezultate";
import FormularAdaugareOptiune from "./componente/FormularAdaugareOptiune";
import AutentificareCNP from "./componente/AutentificareCNP";

function App() {
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [cnp, setCnp] = useState(localStorage.getItem("votCNP"));
  const [aVotat, setAVotat] = useState(false);

  // Obține voturile la montarea componentei
  useEffect(() => {
    axios
      .get("http://localhost:5000/votes")
      .then((res) => {
        setVotes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la preluarea voturilor:", err);
        setLoading(false);
      });
  }, []);

  const handleVote = (optiuneNoua, voturiActualizate) => {
    setVotes(voturiActualizate);
    setAVotat(true); // Setează starea că a votat
  };

  const adaugaOptiune = (nouaOptiune) => {
    if (!votes.hasOwnProperty(nouaOptiune)) {
      setVotes((prevVotes) => ({
        ...prevVotes,
        [nouaOptiune]: 0,
      }));
    }
  };

  if (loading) return <p>Se încarcă voturile...</p>;

  const handleLogout = () => {
    // Elimina CNP-ul salvat la autentificare si starea de vot
    localStorage.removeItem("votCNP");
    localStorage.removeItem("hasVoted");
    setCnp(null); // trimite la componenta de autentificare
  };

  // Dacă nu există CNP, afișăm formularul de autentificare
  if (!cnp) {
    return <AutentificareCNP onCnpConfirmat={(cnpNou) => setCnp(cnpNou)} />;
  }

  const hasVoted = localStorage.getItem("hasVoted") === "true";
  return (
    <Router>
      <NavbarPersonalizat handleLogout={handleLogout} />

      <Container className="mt-4">
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <p>Se încarcă voturile...</p>
              ) : hasVoted ? (
                <Rezultate voturi={votes} />
              ) : (
                <>
                  <Row>
                    {votes.map((optiune) => (
                      <Col key={optiune.id} xs={12} md={6} lg={4}>
                        <OptiuniVot
                          key={optiune.id}
                          optiuneId={optiune.id}
                          nume={optiune.nume}
                          voturi={optiune.voturi}
                          imagine={optiune.imagine}
                          cnp={cnp}
                          onVote={handleVote}
                          aVotat={aVotat}
                        />
                      </Col>
                    ))}
                  </Row>
                  <Rezultate voturi={votes} />
                </>
              )
            }
          />
          <Route
            path="/adauga"
            element={
              <FormularAdaugareOptiune onAdaugaOptiune={adaugaOptiune} />
            }
          />
          <Route path="/asistent" element={<AsistentGPT />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
