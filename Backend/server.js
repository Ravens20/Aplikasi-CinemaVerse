require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/assets/static', express.static(path.join(__dirname, 'assets/static')));

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const ticketRoutes = require('./routes/tickets');
const errorHandler = require('./middleware/errorHandler');

// Use routes
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

// Koneksi ke MongoDB Atlas
const { mongoURI } = require('./config');
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Koneksi ke MongoDB Atlas berhasil!');
  })
  .catch((err) => console.error('Koneksi ke MongoDB Atlas gagal:', err));

// Apply error handling middleware
app.use(errorHandler);

// Jalankan server
app.listen(port, host, () => {
  console.log(`Server berjalan di http://${host}:${port}`);
});
