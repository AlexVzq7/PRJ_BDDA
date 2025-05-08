const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bienvenue sur l’API' });
});

app.listen(3000, () => {
  console.log('API en ligne sur http://localhost:3000');
});
