const express = require('express');
const app = express();
const path = require('path');

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.json());

app.use((req, res, next) => {
    const error = { message: `page not found ${req.url} for ${req.method}`, status: 404 };
    next(error);
  });
  
  app.use((err, req, res, next) => {
    console.log(err.status);
    res.status(err.status || 500).send({ message: err.message });
  });

module.exports = app