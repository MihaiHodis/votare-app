const express = require('express');
const cors = require('cors');
require('dotenv').config();

const voturiRoutes = require('./routes/voturiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const chatRoute = require('./routes/chat');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoute); // Rute pentru chat

// Rute
app.use('/', voturiRoutes);

// Pornire server
app.listen(PORT, () => {
  console.log(`✅ Serverul rulează pe http://localhost:${PORT}`);
});