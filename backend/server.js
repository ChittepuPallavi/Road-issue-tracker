const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

// Load env vars
dotenv.config();

// ✅ Create app FIRST
const app = express();
const server = http.createServer(app);

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// ✅ Root route (NOW correct)
app.get("/", (req, res) => {
  res.send("🚀 Road Issue Tracker API is running");
});

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("MongoDB connection error:", err));

// Make uploads folder accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/Issues'));

const PORT = process.env.PORT || 5000;

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Attach io to app
app.set('io', io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
