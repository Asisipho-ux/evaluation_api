console.log('Loading usersService...');

const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';


// ---------------- CREATE USER ----------------
async function createUser({ username, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      `INSERT INTO users (username, password, role)
       VALUES ($1, $2, $3)
       RETURNING id, username, role`,
      [username, hashedPassword, role || 'user']
    );
    return result.rows[0];
  } catch (err) {
    throw new Error('User creation failed: ' + err.message);
  }
}

// ---------------- LOGIN USER ----------------
async function loginUser(username, password) {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  const user = result.rows[0];
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  };
}

// ---------------- GET ALL USERS ----------------
async function getAllUsers() {
  const result = await pool.query('SELECT id, username, role FROM users');
  return result.rows;
}

// ---------------- GET USER BY ID ----------------
async function getUserById(id) {
  const result = await pool.query(
    'SELECT id, username, role FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

// ---------------- UPDATE USER ----------------
async function updateUser(id, data) {
  const fields = [];
  const values = [];
  let i = 1;

  if (data.username) {
    fields.push(`username = $${i++}`);
    values.push(data.username);
  }
  if (data.password) {
    const hashed = await bcrypt.hash(data.password, 10);
    fields.push(`password = $${i++}`);
    values.push(hashed);
  }
  if (data.role) {
    fields.push(`role = $${i++}`);
    values.push(data.role);
  }

  if (fields.length === 0) return getUserById(id);

  values.push(id); // for WHERE
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${i} RETURNING id, username, role`;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

// ---------------- DELETE USER ----------------
async function deleteUser(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};