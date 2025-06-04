import React, { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function NavbarPersonalizat({ handleLogout }) {
  const locatie = useLocation();
  const { tema, toggleTema } = useContext(ThemeContext);

  return (
    <Navbar
      bg={tema === "dark" ? "dark" : "light"}
      variant={tema === "dark" ? "dark" : "light"}
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🗳️ Aplicație Votare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={locatie.pathname === "/"}>
              Acasă
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/adauga"
              active={locatie.pathname === "/adauga"}
            >
              Adaugă opțiune
            </Nav.Link>
            <Nav.Link as={Link} to="/asistent">
              Votează informat
            </Nav.Link>
          </Nav>

          <Button
            onClick={handleLogout}
            variant="outline-danger"
            className="ms-2"
          >
            Deconectare
          </Button>
          <Button
            onClick={toggleTema}
            variant={tema === "dark" ? "secondary" : "outline-dark"}
          >
            {tema === "dark" ? "🌙 Dark" : "☀️ Light"}
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarPersonalizat;
