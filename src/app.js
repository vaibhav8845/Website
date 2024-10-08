const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const visitorRoutes = require('./routes/Visitor'); 
const emailRoutes = require('./routes/email');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api', contactRoutes);
app.use('/api', visitorRoutes); 
app.use('/api',emailRoutes)

// connect with mongodb
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

module.exports = app;

