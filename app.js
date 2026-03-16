const express = require('express');
const cors = require('cors');

const candidatesRoutes = require('./routes/candidates');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/candidates', candidatesRoutes);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});