import express from 'express';
const router = express.Router();
const authController = require('../controllers/authController.ts');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
