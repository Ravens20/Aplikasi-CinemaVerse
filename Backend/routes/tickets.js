const express = require('express');
const Ticket = require('../models/Ticket');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Create a new ticket
router.post('/confirm', verifyToken, async (req, res) => {
  try {
    const { movieTitle, selectedSeats, totalPrice, paymentMethod } = req.body; // Correct field names
    console.log('Request body:', req.body); // Log the request body
    if (!movieTitle || !selectedSeats || !totalPrice || !paymentMethod) {
      throw new Error('All fields are required');
    }
    const userId = req.userId; // Use userId from token
    const newTicket = new Ticket({ userId, movieTitle, seats: selectedSeats, totalPrice, paymentMethod });
    await newTicket.save();
    console.log('Ticket created:', newTicket); // Log the created ticket
    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (err) {
    console.error('Error creating ticket:', err.message, err.stack);
    console.error('Request body:', req.body); // Log the request body on error
    res.status(500).json({ message: 'Error creating ticket', error: err.message });
  }
});

// Get tickets for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    console.log('Fetching tickets for user ID:', userId); // Log user ID
    const tickets = await Ticket.find({ userId });
    console.log('Fetched tickets:', tickets); // Log fetched tickets
    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err.message, err.stack);
    console.error('User ID:', req.userId); // Log the user ID on error
    res.status(500).json({ message: 'Error fetching tickets', error: err.message });
  }
});

module.exports = router;
