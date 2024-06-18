const ProductTransaction = require("../models/Transaction");
const ProductServices = require("../services/transaction.service");

const getTransactions = async (req, res) => {
  const { month, search = "", page = 1, perPage = 10 } = req.query;

  // Convert month to integer and calculate the start and end dates
  const monthInt = parseInt(month, 10);
  const startDate2021 = new Date(2021, monthInt - 1, 1); // Adjust the year as needed
  const endDate2021 = new Date(2021, monthInt, 1);

  const startDate2022 = new Date(2022, monthInt - 1, 1);
  const endDate2022 = new Date(2022, month, 1);

  const dateQuery2021 = {
    dateOfSale: {
      $gte: startDate2021,
      $lte: endDate2021,
    },
  };

  const dateQuery2022 = {
    dateOfSale: {
      $gte: startDate2022,
      $lte: endDate2022,
    },
  };

  // Construct the search query
  const regex = new RegExp(search, "i"); // Case-insensitive regex for search
  const searchQuery = search
    ? {
        $or: [
          { title: regex },
          { description: regex },
          { price: parseFloat(search) || 0 },
        ],
      }
    : {};

  try {
    const transactions = await ProductTransaction.find({
      $or: [{ ...dateQuery2021 }, { ...dateQuery2022 }],
      ...searchQuery,
    })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage, 10));


    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getStatistics = async (req, res) => {
  const { month } = req.query;

  const monthInt = parseInt(month, 10);

  const startDate2021 = new Date(2021, monthInt - 1, 1); // Adjust the year as needed
  const endDate2021 = new Date(2021, monthInt, 1);

  const startDate2022 = new Date(2022, monthInt - 1, 1);
  const endDate2022 = new Date(2022, month, 1);

  const dateQuery2021 = {
    dateOfSale: {
      $gte: startDate2021,
      $lte: endDate2021,
    },
  };

  const dateQuery2022 = {
    dateOfSale: {
      $gte: startDate2022,
      $lte: endDate2022,
    },
  };

  try {
    const totalSales2021 = await ProductTransaction.aggregate([
      { $match: { ...dateQuery2021, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSales2022 = await ProductTransaction.aggregate([
      { $match: { ...dateQuery2022, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSales =
      totalSales2021[0]?.totalAmount || 0 + totalSales2022[0]?.totalAmount || 0;

    const totalItemsSold2021 = await ProductTransaction.countDocuments({
      ...dateQuery2021,
      sold: true,
    });
    const totalItemsSold2022 = await ProductTransaction.countDocuments({
      ...dateQuery2022,
      sold: true,
    });
    const totalItemsSold =
      (await totalItemsSold2021) + (await totalItemsSold2022);

    const totalItemsNotSold2021 = await ProductTransaction.countDocuments({
      ...dateQuery2021,
      sold: false,
    });
    const totalItemsNotSold2022 = await ProductTransaction.countDocuments({
      ...dateQuery2022,
      sold: false,
    });
    const totalItemsNotSold =
      (await totalItemsNotSold2021) + (await totalItemsNotSold2022);

    res.json({
      totalSaleAmount: totalSales || 0,
      totalItemsSold,
      totalItemsNotSold,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getBarChart = async (req, res) => {
  const { month } = req.query;
  const monthInt = parseInt(month, 10);

  const priceRanges = [
    [0, 100],
    [101, 200],
    [201, 300],
    [301, 400],
    [401, 500],
    [501, 600],
    [601, 700],
    [701, 800],
    [801, 900],
    [901, Infinity],
  ];

  const startDate2021 = new Date(2021, monthInt - 1, 1); // Adjust the year as needed
  const endDate2021 = new Date(2021, monthInt, 1);

  const startDate2022 = new Date(2022, monthInt - 1, 1);
  const endDate2022 = new Date(2022, month, 1);

  const dateQuery2021 = {
    dateOfSale: {
      $gte: startDate2021,
      $lte: endDate2021,
    },
  };

  const dateQuery2022 = {
    dateOfSale: {
      $gte: startDate2022,
      $lte: endDate2022,
    },
  };

  try {
    const barChartData2021 = await Promise.all(
      priceRanges.map(async ([min, max]) => {
        const count = await ProductTransaction.countDocuments({
          ...dateQuery2021,
          price: {
            $gte: min,
            $lt: max === Infinity ? Number.MAX_SAFE_INTEGER : max,
          },
        });
        return { range: `${min}-${max === Infinity ? "above" : max}`, count };
      })
    );

    const barChartData2022 = await Promise.all(
      priceRanges.map(async ([min, max]) => {
        const count = await ProductTransaction.countDocuments({
          ...dateQuery2022,
          price: {
            $gte: min,
            $lt: max === Infinity ? Number.MAX_SAFE_INTEGER : max,
          },
        });
        return { range: `${min}-${max === Infinity ? "above" : max}`, count };
      })
    );


    const barChartData = new Map();
    barChartData2021.forEach((item) => {
      barChartData.set(item.range, item.count);
    });

    // Step 2: Iterate over the second array and add counts to the map
    barChartData2022.forEach((item) => {
      if (barChartData.has(item.range)) {
        barChartData.set(item.range, barChartData.get(item.range) + item.count);
      } else {
        barChartData.set(item.range, item.count);
      }
    });

    const barChartDataArray = Array.from(barChartData, ([range, count]) => ({
      range,
      count,
    }));

    res.json(barChartDataArray);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getPieChart = async (req, res) => {
  const { month } = req.query;
  const monthInt = parseInt(month, 10);

  const startDate2021 = new Date(2021, monthInt - 1, 1); // Adjust the year as needed
  const endDate2021 = new Date(2021, monthInt, 1);

  const startDate2022 = new Date(2022, monthInt - 1, 1);
  const endDate2022 = new Date(2022, month, 1);

  const dateQuery2021 = {
    dateOfSale: {
      $gte: startDate2021,
      $lte: endDate2021,
    },
  };

  const dateQuery2022 = {
    dateOfSale: {
      $gte: startDate2022,
      $lte: endDate2022,
    },
  };

  try {
    const pieChartData2021 = await ProductTransaction.aggregate([
      { $match: dateQuery2021 },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
    ]);

    const pieChartData2022 = await ProductTransaction.aggregate([
      { $match: dateQuery2022 },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
    ]);

    const pieChartData = new Map();
    pieChartData2021.forEach((item) => {
      pieChartData.set(item.category, item.count);
    });

    pieChartData2022.forEach((item) => {
      if (pieChartData.has(item.category)) {
        pieChartData.set(
          item.category,
          pieChartData.get(item.category) + item.count
        );
      } else {
        pieChartData.set(item.category, item.count);
      }
    });

    const pieChartDataArray = Array.from(pieChartData, ([category, count]) => ({
      category,
      count,
    }));
    res.json(pieChartDataArray);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getCombinedData = async (req, res) => {
  const { month, search = "", page = 1, perPage = 10 } = req.query;

  // Convert month to integer and calculate the start and end dates
  const monthInt = parseInt(month, 10);
  const startDate2021 = new Date(2021, monthInt - 1, 1); // Adjust the year as needed
  const endDate2021 = new Date(2021, monthInt, 1);

  const startDate2022 = new Date(2022, monthInt - 1, 1);
  const endDate2022 = new Date(2022, month, 1);

  const dateQuery2021 = {
    dateOfSale: {
      $gte: startDate2021,
      $lte: endDate2021,
    },
  };

  const dateQuery2022 = {
    dateOfSale: {
      $gte: startDate2022,
      $lte: endDate2022,
    },
  };

  const priceRanges = [
    [0, 100],
    [101, 200],
    [201, 300],
    [301, 400],
    [401, 500],
    [501, 600],
    [601, 700],
    [701, 800],
    [801, 900],
    [901, Infinity],
  ];

  // Construct the search query
  const regex = new RegExp(search, "i"); // Caseinsensitive regex for search
  const searchQuery = search
    ? {
        $or: [
          { title: regex },
          { description: regex },
          { price: parseFloat(search) || 0 },
        ],
      }
    : {};


  try {
    const transactions = await ProductTransaction.find({
      $or: [{ ...dateQuery2021 }, { ...dateQuery2022 }],
      ...searchQuery,
    })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage, 10));

    //statistics

    const totalSales2021 = await ProductTransaction.aggregate([
      { $match: { ...dateQuery2021, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSales2022 = await ProductTransaction.aggregate([
      { $match: { ...dateQuery2022, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSales =
      totalSales2021[0]?.totalAmount || 0 + totalSales2022[0]?.totalAmount || 0;

    const totalItemsSold2021 = await ProductTransaction.countDocuments({
      ...dateQuery2021,
      sold: true,
    });
    const totalItemsSold2022 = await ProductTransaction.countDocuments({
      ...dateQuery2022,
      sold: true,
    });
    const totalItemsSold =
      (await totalItemsSold2021) + (await totalItemsSold2022);

    const totalItemsNotSold2021 = await ProductTransaction.countDocuments({
      ...dateQuery2021,
      sold: false,
    });
    const totalItemsNotSold2022 = await ProductTransaction.countDocuments({
      ...dateQuery2022,
      sold: false,
    });
    const totalItemsNotSold =
      (await totalItemsNotSold2021) + (await totalItemsNotSold2022);

    const Statistics = {
      totalSaleAmount: totalSales || 0,
      totalItemsSold,
      totalItemsNotSold,
    };

    //bar-chart
    const barChartData2021 = await Promise.all(
      priceRanges.map(async ([min, max]) => {
        const count = await ProductTransaction.countDocuments({
          ...dateQuery2021,
          price: {
            $gte: min,
            $lt: max === Infinity ? Number.MAX_SAFE_INTEGER : max,
          },
        });
        return { range: `${min}-${max === Infinity ? "above" : max}`, count };
      })
    );

    const barChartData2022 = await Promise.all(
      priceRanges.map(async ([min, max]) => {
        const count = await ProductTransaction.countDocuments({
          ...dateQuery2022,
          price: {
            $gte: min,
            $lt: max === Infinity ? Number.MAX_SAFE_INTEGER : max,
          },
        });
        return { range: `${min}-${max === Infinity ? "above" : max}`, count };
      })
    );


    const barChartData = new Map();
    barChartData2021.forEach((item) => {
      barChartData.set(item.range, item.count);
    });

    barChartData2022.forEach((item) => {
      if (barChartData.has(item.range)) {
        barChartData.set(item.range, barChartData.get(item.range) + item.count);
      } else {
        barChartData.set(item.range, item.count);
      }
    });

    const barChartDataArray = Array.from(barChartData, ([range, count]) => ({
      range,
      count,
    }));

    const pieChartData2021 = await ProductTransaction.aggregate([
      { $match: dateQuery2021 },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
    ]);

    const pieChartData2022 = await ProductTransaction.aggregate([
      { $match: dateQuery2022 },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
    ]);

    const pieChartData = new Map();
    pieChartData2021.forEach((item) => {
      pieChartData.set(item.category, item.count);
    });

    pieChartData2022.forEach((item) => {
      if (pieChartData.has(item.category)) {
        pieChartData.set(
          item.category,
          pieChartData.get(item.category) + item.count
        );
      } else {
        pieChartData.set(item.category, item.count);
      }
    });

    const pieChartDataArray = Array.from(pieChartData, ([category, count]) => ({
      category,
      count,
    }));

    res.json({transactions, Statistics, barChartDataArray, pieChartDataArray});
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTransactions = getTransactions;
exports.getStatistics = getStatistics;
exports.getBarChart = getBarChart;
exports.getPieChart = getPieChart;
exports.getCombinedData = getCombinedData;
