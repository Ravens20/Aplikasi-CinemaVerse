const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config');
const validate = require('../middleware/validate');
const { registerSchema } = require('../validation/user');
const router = express.Router();

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Semua field harus diisi' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Pendaftaran berhasil' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data pengguna' });
  }
});

router.post('/register-admin', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Semua field harus diisi' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ username, email, password: hashedPassword, role: 'admin' });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin berhasil didaftarkan' });
  } catch (err) {
    console.error('Error registering admin:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data admin' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password harus diisi' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah' });

    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ message: 'Login berhasil', token, username: user.username });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa data pengguna' });
  }
});

router.post('/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password harus diisi' });

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) return res.status(400).json({ message: 'Admin tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah' });

    const token = jwt.sign({ userId: admin._id, role: admin.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ message: 'Login admin berhasil', token, username: admin.username });
  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa data admin' });
  }
});

module.exports = router;
