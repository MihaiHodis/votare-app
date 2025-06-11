const pool = require('../database');

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
