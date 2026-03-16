const candidatesService = require('../services/candidatesService');

// -------------------- GET ALL CANDIDATES --------------------
async function getCandidates(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await candidatesService.getAllCandidates(page, limit);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// -------------------- GET SINGLE CANDIDATE --------------------
async function getCandidate(req, res) {
  try {
    const { id } = req.params;

    const data = await candidatesService.getCandidateById(id);

    if (!data) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// -------------------- GET CANDIDATES BY BRANCH --------------------
async function getCandidatesByBranch(req, res) {
  try {
    const { branchId } = req.params;

    const data = await candidatesService.getCandidatesByBranch(branchId);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// -------------------- CREATE CANDIDATE --------------------
async function createCandidate(req, res) {
  try {
    const newCandidate = await candidatesService.createCandidate(req.body);

    res.status(201).json(newCandidate);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

// -------------------- UPDATE CANDIDATE (PUT) --------------------
async function updateCandidate(req, res) {
  try {
    const { id } = req.params;

    const updatedCandidate = await candidatesService.updateCandidate(
      id,
      req.body
    );

    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(updatedCandidate);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

// -------------------- PATCH CANDIDATE --------------------
async function patchCandidate(req, res) {
  try {
    const { id } = req.params;

    const updatedCandidate = await candidatesService.patchCandidate(
      id,
      req.body
    );

    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(updatedCandidate);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

// -------------------- DELETE CANDIDATE --------------------
async function deleteCandidate(req, res) {
  try {
    const { id } = req.params;

    await candidatesService.deleteCandidate(id);

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getCandidates,
  getCandidate,
  getCandidatesByBranch,
  createCandidate,
  updateCandidate,
  patchCandidate,
  deleteCandidate
};