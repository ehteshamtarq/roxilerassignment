import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BasicPie({ selectedMonth }) {
  const [pieChart, setPieChart] = useState([]);

  useEffect(() => {
    loadTransactions(selectedMonth);
  }, [selectedMonth]);

  const loadTransactions = async (month, search, page) => {
    try {
      const response = await axios.get(
        `https://roxilerassignment-zkvx.onrender.com/pie-chart?month=${selectedMonth}`
      );

      let data = [];

      for (let i = 0; i < response.data.length; i++) {
        var ans = {
          id: i,
          value: response.data[i]["count"],
          label: response.data[i]["category"],
        };
        data.push(ans);
      }

      setPieChart(data)
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <PieChart
      series={[
        {
          data:pieChart,
        },
      ]}
      width={500}
      height={200}
    />
  );
}
