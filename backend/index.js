const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bienvenue sur l’API' });
});

app.listen(3000, () => {
  console.log('API en ligne sur http://localhost:3000');
});
