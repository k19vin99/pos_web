const express               = require('express');
const router                = express.Router();
const { register, login }   = require('../controllers/authController');

router.post('/registro', register);  // /api/auth/registro
router.post('/login',    login);     // /api/auth/login

module.exports = router;
