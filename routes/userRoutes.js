const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createClient,
  getAllClients,
  getCurrentUser,
  deleteClient,
  createAdmin,
  updateMyProfile,
  getAllAdmins
} = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Validation rules for creating a client
const createClientValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

router.delete('/:id', authenticate, requireAdmin, deleteClient);

router.put('/me', authenticate, updateMyProfile);

router.post('/', authenticate, requireAdmin, createClientValidation, createClient);
router.post('/admin', authenticate, requireAdmin, createAdmin,);

router.get('/clients', authenticate, requireAdmin, getAllClients);
router.get('/admins', authenticate, requireAdmin, getAllAdmins);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;