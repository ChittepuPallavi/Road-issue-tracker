const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`MongoDB Connected...`))
  .catch((err) => console.log('MongoDB connection error:', err));

const app = express();
const server = http.createServer(app);

// Body parser
app.use(express.json());

const path = require('path');

// Enable CORS
app.use(cors());

// Make uploads folder manually accessible via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/Issues'));

const PORT = process.env.PORT || 5000;

// Setup Socket.io for Real-time
const io = new Server(server, {
  cors: {
    origin: '*', // For development
  }
});
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
// Attach io to app to emit events from controllers
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});