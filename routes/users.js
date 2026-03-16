const express = require('express');
const router = express.Router();
const { createUserValidator } = require('../validators/userValidator');
const { validationResult } = require('express-validator');
const usersService = require('../services/usersService');
const authenticateToken = require('../middleware/auth'); 


function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await usersService.loginUser(username, password);
  if (!result) return res.status(401).json({ error: 'Invalid credentials' });
  res.json(result);
});


router.use(authenticateToken);


router.get('/', async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  const users = await usersService.getAllUsers();
  res.json(users);
});


router.get('/:id', async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (req.user.role !== 'admin' && req.user.id !== user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(user);
});


router.put('/:id', async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (req.user.role !== 'admin' && req.user.id !== user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const updatedUser = await usersService.updateUser(req.params.id, req.body);
  res.json({ message: 'User updated', user: updatedUser });
});


router.delete('/:id', async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });

  const deleted = await usersService.deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'User not found' });

  res.json({ message: 'User deleted' });
});

module.exports = router;