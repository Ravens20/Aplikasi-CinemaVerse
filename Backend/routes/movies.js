const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Movie = require('../models/Movie');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const router = express.Router();

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'assets', 'static');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage });

const uploadFields = [
  { name: 'image', maxCount: 1 },
  { name: 'castImages', maxCount: 10 },
];

router.post('/add-movie', upload.fields(uploadFields), async (req, res) => {
  try {
    console.log('File received:', req.files);
    console.log('Body:', req.body);

    const { title, synopsis, genre, duration, director, rating, votes, youtubeLink, cast } = req.body;
    const image = req.files['image'] ? `/assets/static/${req.files['image'][0].filename}` : null;
    const castArray = cast ? JSON.parse(cast) : [];

    if (!Array.isArray(castArray)) {
      return res.status(400).json({ message: 'Cast must be an array' });
    }

    if (!title || !synopsis || !genre || !duration || !director || !rating || !votes || !youtubeLink) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const castWithImages = castArray.map((actor, index) => ({
      ...actor,
      image: req.files['castImages'] && req.files['castImages'][index] ? `/assets/static/${req.files['castImages'][index].filename}` : null,
    }));

    const newMovie = new Movie({
      title,
      image,
      synopsis,
      genre,
      duration,
      director,
      rating,
      votes,
      cast: castWithImages,
      youtubeLink,
    });

    await newMovie.save();
    console.log('New movie added:', newMovie); // Log new movie data
    res.status(201).json({ message: 'Film berhasil ditambahkan', movie: newMovie });
  } catch (err) {
    console.error('Error adding movie:', err.message);
    res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data film' });
  }
});

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({ message: 'Film tidak ditemukan' });
    }
    console.log('Movie deleted:', movie); // Log deleted movie data
    res.json({ message: 'Film berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus film' });
  }
});

router.put('/:id', upload.fields(uploadFields), verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { id } = req.params;
    const { title, synopsis, genre, duration, director, rating, votes, youtubeLink, cast } = req.body;
    const image = req.files['image'] ? `/assets/static/${req.files['image'][0].filename}` : null;
    const castArray = cast ? JSON.parse(cast) : [];

    if (!Array.isArray(castArray)) {
      return res.status(400).json({ message: 'Cast must be an array' });
    }

    const castWithImages = castArray.map((actor, index) => ({
      ...actor,
      image: req.files['castImages'] && req.files['castImages'][index] ? `/assets/static/${req.files['castImages'][index].filename}` : actor.image,
    }));

    const updateData = {
      title,
      synopsis,
      genre,
      duration,
      director,
      rating,
      votes,
      youtubeLink,
      cast: castWithImages,
    };

    if (image) {
      updateData.image = image;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Film tidak ditemukan' });
    }

    console.log('Movie updated:', updatedMovie); // Log updated movie data
    res.json({ message: 'Film berhasil diperbarui', movie: updatedMovie });
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui film' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { title } = req.query;
    let movies;
    if (title) {
      movies = await Movie.findOne({ title });
    } else {
      movies = await Movie.find();
    }
    console.log('Movies fetched:', movies); // Log fetched movies data
    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data film' });
  }
});

module.exports = router;
