const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'Sublime Intelligence API' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sublime Intelligence API a correr em http://localhost:${PORT}`);
});

module.exports = app;
