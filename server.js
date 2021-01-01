const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'missing.html'));
});

app.listen(3364);

console.log('wawjr3d is up at http://localhost:3364');
