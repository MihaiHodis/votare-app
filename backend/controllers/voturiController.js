const pool = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurare multer pentru salvarea imaginilor
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'), // ✅ corect
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const numeFaraExtensie = path.basename(file.originalname, ext);
    const uniqueName = `${numeFaraExtensie}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
  



// Funcții pentru gestionarea voturilor
const getVotes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.id, o.nume, o.voturi, p.image_path
      FROM optiuni o
      LEFT JOIN option_paths p ON o.id = p.optiune_id
    `);

    // Formatează ca array de obiecte
    const result = rows.map(row => ({
      id: row.id,
      nume: row.nume,
      voturi: row.voturi,
      imagine: row.image_path || null
    }));

    res.json(result);
  } catch (err) {
    console.error("Eroare la preluarea voturilor:", err);
    res.status(500).json({ error: "Eroare server la citire voturi" });
  }
};

const voteOption = async (req, res) => {
  const { option_id, cnp } = req.body;
  console.log("Votare opțiune:", option_id, cnp);

  if (!option_id || !cnp || cnp.length !== 13) {
    return res.status(400).json({ error: "Date incorecte (opțiune sau CNP lipsă/incorect)" });
  }

  try {
    // Verifică dacă opțiunea există
    const [exists] = await pool.query('SELECT * FROM optiuni WHERE id = ?', [option_id]);
    if (exists.length === 0) {
      return res.status(400).json({ error: "Opțiune invalidă" });
    }

    // Verifică dacă acest CNP a mai votat
    const [cnpExists] = await pool.query('SELECT * FROM votanti WHERE cnp = ?', [cnp]);
    if (cnpExists.length > 0) {
      return res.status(403).json({ error: "Acest CNP a votat deja" });
    }

    // Incrementează voturile pentru opțiunea selectată
    await pool.query('UPDATE optiuni SET voturi = voturi + 1 WHERE id = ?', [option_id]);

    // Salvează CNP-ul și opțiunea votată
    try {
      await pool.query('INSERT INTO votanti (cnp, optiune_id) VALUES (?, ?)', [cnp, option_id]);
    } catch (insertErr) {
      console.error("Eroare la inserarea în votanti:", insertErr);
      return res.status(500).json({ error: "Eroare la salvarea CNP-ului" });
    }

    // Returnează lista actualizată de voturi
    const [updated] = await pool.query('SELECT id, nume, voturi FROM optiuni');
    const result = updated.map(row => ({
      id: row.id,
      nume: row.nume,
      voturi: row.voturi
    }));

    res.json(result);
  } catch (err) {
    console.error("Eroare la votare:", err);
    res.status(500).json({ error: "Eroare server la vot" });
  }
};

const addOption = async (req, res) => {
  const { nume } = req.body;
  const imagine = req.file?.filename;

  if (!nume || !imagine) {
    return res.status(400).json({ error: 'Numele și imaginea sunt obligatorii' });
  }

  try {
    const [rezultat] = await pool.query('INSERT INTO optiuni (nume) VALUES (?)', [nume]);
    const optiuneId = rezultat.insertId;

    const caleImagine = `${imagine}`;
    await pool.query(
      'INSERT INTO option_paths (optiune_id, image_path) VALUES (?, ?)',
      [optiuneId, caleImagine]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la inserare opțiune:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Opțiunea există deja' });
    } else {
      res.status(500).json({ error: 'Eroare la inserare' });
    }
  }
};


const checkCnp = async (req, res) => {
  const { cnp } = req.params;

  if (!cnp || cnp.length !== 13) {
    return res.status(400).json({ hasVoted: false });
  }

  const [rows] = await pool.query('SELECT * FROM votanti WHERE cnp = ?', [cnp]);
  res.json({ hasVoted: rows.length > 0 });
};

module.exports = {
  upload,
  getVotes,
  voteOption,
  addOption,
  checkCnp
};
