const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.Login);
router.get('/dashboard', authController.Dashboard);
router.delete('/logout', authController.Logout);

module.exports = router;