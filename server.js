const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db');   // IMPORTANT

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/food', require('./routes/food'));
app.use('/api/exercise', require('./routes/exercise'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/ai', require('./routes/ai'));

app.listen(3000, () => {
  console.log("FitTrack running on http://localhost:3000");
});