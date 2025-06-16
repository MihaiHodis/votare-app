const express = require('express');
const router = express.Router();
const voturiController = require('../controllers/voturiController');

// ordinea este importantă: întâi upload, apoi handler
router.get('/votes', voturiController.getVotes);
router.post('/vote', voturiController.voteOption); // ✅ Aici era problema
router.post('/add-option', voturiController.upload.single('imagine'), voturiController.addOption);
router.get('/check-cnp/:cnp', voturiController.checkCnp);

module.exports = router;