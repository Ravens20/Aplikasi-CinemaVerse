const express = require('express');
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil profil' });
  }
});

router.put('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password lama salah' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengubah password' });
  }
});

module.exports = router;
