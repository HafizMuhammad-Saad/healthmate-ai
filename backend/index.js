require('dotenv').config();
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');
const vitalsRoutes = require('./routes/vitalsRoutes');

const app = express();

// Middleware to handle CORS
app.use(cors({
    origin: process.env.ORIGIN,
    exposedHeaders: ['X-Total-Count'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],}));

//Connect database
connectDB();

// Middleware to parse JSON data
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analyze", aiRoutes);
app.use("/api/vitals", vitalsRoutes);

//serve uploaded files (for backward compatibility)
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// module.exports = app;