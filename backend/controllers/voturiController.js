const pool = require('../database');

const getVotes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT nume, voturi FROM optiuni');
    const result = {};
    rows.forEach(row => result[row.nume] = row.voturi);
    res.json(result);
  } catch (err) {
    console.error("Eroare la preluarea voturilor:", err);
    res.status(500).json({ error: "Eroare server la citire voturi" });
  }
};

const voteOption = async (req, res) => {
  const { option, cnp } = req.body;
  console.log("CNP primit:", cnp);
  console.log("Request body:", req.body);
  if (!option || !cnp || cnp.length !== 13) {
    return res.status(400).json({ error: "Date incorecte (opțiune sau CNP lipsă/incorect)" });
  }

  try {
    // Verificăm dacă opțiunea există
    const [exists] = await pool.query('SELECT * FROM optiuni WHERE nume = ?', [option]);
    if (exists.length === 0) {
      return res.status(400).json({ error: "Opțiune invalidă" });
    }

    // Verificăm dacă acest CNP a mai votat
    const [cnpExists] = await pool.query('SELECT * FROM votanti WHERE cnp = ?', [cnp]);
    if (cnpExists.length > 0) {
      return res.status(403).json({ error: "Acest CNP a votat deja" });
    }

    // Incrementează voturile
    await pool.query('UPDATE optiuni SET voturi = voturi + 1 WHERE nume = ?', [option]);

    // Salvează CNP-ul în tabela votanti
    try {
      await pool.query('INSERT INTO votanti (cnp, optiune_votata) VALUES (?, ?)', [cnp, option]);
    } catch (insertErr) {
      console.error("Eroare la inserarea în votanti:", insertErr);
      return res.status(500).json({ error: "Eroare la salvarea CNP-ului" });
    }

    // Returnează datele actualizate
    const [updated] = await pool.query('SELECT nume, voturi FROM optiuni');
    const result = {};
    updated.forEach(row => result[row.nume] = row.voturi);
    res.json(result);
  } catch (err) {
    console.error("Eroare la votare:", err);
    res.status(500).json({ error: "Eroare server la vot" });
  }
};

const addOption = async (req, res) => {
  const { option } = req.body;
  if (!option) return res.status(400).json({ error: 'Opțiune lipsă' });

  try {
    await pool.query('INSERT INTO optiuni (nume) VALUES (?)', [option]);
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Opțiunea există deja' });
    } else {
      console.error("Eroare la inserare opțiune:", err);
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
  getVotes,
  voteOption,
  addOption,
  checkCnp
};
