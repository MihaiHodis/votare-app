const express = require('express');
const router = express.Router();
const voturiController = require('../controllers/voturiController');

router.get('/votes', voturiController.getVotes);
router.post('/vote', voturiController.voteOption);
router.post('/add-option', voturiController.addOption);
router.get("/check-cnp/:cnp", voturiController.checkCnp);

module.exports = router;
