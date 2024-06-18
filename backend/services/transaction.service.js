const ProductTransaction = require("../models/Transaction");

const calculateTransaction = async (month, search, page, perPage) => {
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

  console.log(month, search, page);
  console.log(dateQuery2021, dateQuery2022);

  const transactions = await ProductTransaction.find({
    $or: [{ ...dateQuery2021 }, { ...dateQuery2022 }],
    ...searchQuery,
  })
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage, 10));

console.log(transactions);

  return transactions;
};
