const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const adminRoute = require('./routes/adminRoute');
const billRoute = require('./routes/billRoute');
const userRoute = require('./routes/userRoute');
const coneRoutes = require('./routes/coneRoute');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.log(err);
  });

app.use('/user',userRoute);
app.use('/admin',adminRoute);
app.use('/bills',billRoute);
app.use('/cones', coneRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});