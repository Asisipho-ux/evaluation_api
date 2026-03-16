const { body } = require('express-validator');

const createCandidateValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('surname')
    .notEmpty()
    .withMessage('Surname is required'),

  body('email')
    .isEmail()
    .withMessage('Valid email is required')
];

const updateCandidateValidator = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty'),

  body('surname')
    .optional()
    .notEmpty()
    .withMessage('Surname cannot be empty'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Email must be valid')
];

module.exports = {
  createCandidateValidator,
  updateCandidateValidator
};