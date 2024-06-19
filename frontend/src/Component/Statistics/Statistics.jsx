import './Statistics.css';
import { useEffect, useState } from "react";
import axios from "axios";

const Statistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState([]);
  const [setMonths, setSelectedMonths] = useState("");
  const [totalSales, setTotalSales] = useState("");
  const [sold, setSold] = useState("");
  const [notSold, setNotSold] = useState("");

  useEffect(() => {
    loadTransactions(selectedMonth);
  }, [selectedMonth]);

  const loadTransactions = async (month, search, page) => {
    try {
      const response = await axios.get(
        `https://roxilerassignment-zkvx.onrender.com/statistics?month=${selectedMonth}`
      );
      setTotalSales(response.data["totalSaleAmount"]);
      setSold(response.data["totalItemsSold"]);
      setNotSold(response.data["totalItemsNotSold"]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div className="statistics-table">
      <table>
        <tbody>
          <tr>
            <td>Total Sale</td>
            <td>{totalSales}</td>
          </tr>
          <tr>
            <td>Total Sold item</td>
            <td>{sold}</td>
          </tr>
          <tr>
            <td>Total Not sold item</td>
            <td>{notSold}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
