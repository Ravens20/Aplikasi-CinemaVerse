const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  synopsis: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  director: { type: String, required: true },
  rating: { type: Number, required: true },
  votes: { type: Number, required: true },
  cast: [castSchema],
  youtubeLink: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
