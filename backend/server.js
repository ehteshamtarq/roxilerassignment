// server.js
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const ProductTransaction = require("./models/Transaction");
const ProductController = require("./controller/transaction.controller")
const app = express();
const morgan = require("morgan");

app.use(bodyParser.json());
connectDB();
app.use(morgan("dev"));

// API to list all transactions with search and pagination
app.get("/transactions", ProductController.getTransactions );

// API for statistics
app.get("/statistics",ProductController.getStatistics);

// API for bar chart data
app.get("/bar-chart", ProductController.getBarChart );

// API for pie chart data
app.get("/pie-chart", ProductController.getPieChart );

// API to fetch combined data
app.get("/combined-data", ProductController.getCombinedData);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
