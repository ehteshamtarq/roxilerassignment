// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ehteshamtarique1:o3IZcu0uY8JgnOb9@transaction1.tnrxijn.mongodb.net/?retryWrites=true&w=majority&appName=transaction1', );
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectDB;
