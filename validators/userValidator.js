const { body } = require('express-validator');

const createUserValidator = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be admin or user')
];

module.exports = {
  createUserValidator
};