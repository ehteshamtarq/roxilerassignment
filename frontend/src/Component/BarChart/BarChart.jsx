import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BasicBars({ selectedMonth }) {
  const [xAxis, setXAxis] = useState([]);
  const [yAxis, setYAxis] = useState([]);

  useEffect(() => {
    loadTransactions(selectedMonth);
  }, [selectedMonth]);

  const loadTransactions = async (month, search, page) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/bar-chart?month=${selectedMonth}`
      );

      let dataXAxis = [];
      let dataYAxis = [];

      for (let i = 0; i < response.data.length; i++) {
        dataXAxis.push(response.data[i]["range"]);
        dataYAxis.push(response.data[i]["count"]);
      }

      setXAxis(dataXAxis);
      setYAxis(dataYAxis);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  return (
    <BarChart
      xAxis={[{ scaleType: "band", data: xAxis }]}
      series={[{ data: yAxis }]}
      width={500}
      height={300}
    />
  );
}
