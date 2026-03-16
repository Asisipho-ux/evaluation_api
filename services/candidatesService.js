const pool = require('../db/pool');


async function getAllCandidates(page = 1, limit = 10) {

  const offset = (page - 1) * limit;

  const result = await pool.query(
  `SELECT *
   FROM candidate_progress_view
   LIMIT $1 OFFSET $2`,
  [limit, offset]
);

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM candidate_progress_view`
  );

  const total = parseInt(countResult.rows[0].count);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: result.rows
  };
}

async function getCandidateById(id) {
  const result = await pool.query(
    'SELECT * FROM candidate_progress_view WHERE candidate_id = $1',
    [id]
  );
  return result.rows[0];
}

async function getCandidatesByBranch(branchId) {
  const result = await pool.query(
    'SELECT * FROM candidate_progress_view WHERE branch_id = $1',
    [branchId]
  );
  return result.rows;
}


async function createCandidate(data) {
  const { name, surname, email } = data;

  if (!name || !surname || !email) {
    throw new Error('Name, surname, and email are required');
  }

  const result = await pool.query(
    `INSERT INTO candidates (id, name, surname, email)
     VALUES (gen_random_uuid(), $1, $2, $3)
     RETURNING *`,
    [name, surname, email]
  );

  return result.rows[0];
}

async function updateCandidate(id, data) {
  const { name, surname, email, phone, source, status, branch_id } = data;

  const result = await pool.query(
    `UPDATE candidates
     SET name=$1, surname=$2, email=$3, phone=$4, source=$5, status=$6, branch_id=$7
     WHERE id=$8
     RETURNING *`,
    [name, surname, email, phone, source, status, branch_id, id]
  );

  if (!result.rows[0]) throw new Error('Candidate not found');
  return result.rows[0];
}

async function patchCandidate(id, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) throw new Error('No fields provided for update');

  const setQuery = keys.map((key, i) => `${key}=$${i + 1}`).join(', ');
  const result = await pool.query(
    `UPDATE candidates SET ${setQuery} WHERE id=$${keys.length + 1} RETURNING *`,
    [...values, id]
  );

  if (!result.rows[0]) throw new Error('Candidate not found');
  return result.rows[0];
}

async function deleteCandidate(id) {
  const result = await pool.query(
    `DELETE FROM candidates WHERE id=$1 RETURNING *`,
    [id]
  );

  if (!result.rows[0]) throw new Error('Candidate not found');
  return result.rows[0];
}

module.exports = {
  getAllCandidates,
  getCandidateById,
  getCandidatesByBranch,
  createCandidate,
  updateCandidate,
  patchCandidate,
  deleteCandidate
};