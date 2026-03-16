const express = require('express');
const router = express.Router();

const candidatesService = require('../services/candidatesService');
const controller = require('../controllers/candidatesController');

const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

const {
  createCandidateValidator,
  updateCandidateValidator
} = require('../validators/candidateValidator');

const validate = require('../middleware/validate');


router.use(authenticateToken);

// -------------------- GET ROUTES --------------------
router.get('/', controller.getCandidates);
router.get('/:id', controller.getCandidate);
router.get('/branch/:branchId', controller.getCandidatesByBranch);


router.post(
  '/',
  authorizeRoles('admin'),
  createCandidateValidator,
  validate,
  controller.createCandidate
);

router.put(
  '/:id',
  authorizeRoles('admin'),
  controller.updateCandidate
);


router.patch(
  '/:id',
  authorizeRoles('admin'),
  updateCandidateValidator,
  validate,
  controller.patchCandidate
);


router.delete(
  '/:id',
  authorizeRoles('admin'),
  controller.deleteCandidate
);

module.exports = router;