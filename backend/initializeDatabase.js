// initializeDatabase.js
const axios = require('axios');
const connectDB = require('./db');
const transaction = require('./models/Transaction');

const fetchAndSeedData = async () => {
    try {
        await connectDB();
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await transaction.deleteMany({});

        await transaction.insertMany(transactions);

        console.log('Database initialized with seed data');
        process.exit();
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

fetchAndSeedData();
