import "./App.css";
import * as React from "react";
import SearchBox from "./Component/Searchbox/SearchBox";
import DropDown from "./Component/DropDown/DropDown";
import Table from "./Component/Table/Table";
import Statistics from "./Component/Statistics/Statistics";
import PieChart from "./Component/PieChart/PieChart"
import  BarChart from "./Component/BarChart/BarChart";
import { useState } from "react";

const ariaLabel = { "aria-label": "description" };

function App() {
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [searchBox, setSearchBox] = useState('');
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  return (
    <>
      <div className="header">
        <p>
          Transaction<br></br> Dashboard
        </p>
      </div>

      <div className="buttons">
        <SearchBox searchBox = {searchBox} setSearchBox = {setSearchBox}/>
        <DropDown selectedMonth = {selectedMonth} setSelectedMonth = {setSelectedMonth} />
      </div>

      <div className="table">
        <Table selectedMonth = {selectedMonth} searchBox = {searchBox}/>
      </div>

      <div className = "statistics">
        <h1>Statistics - {month[selectedMonth - 1]}</h1>
        <Statistics selectedMonth = {selectedMonth}  />
      </div>

      <div className = "barChart">
        <h1>Bar Chart - {month[selectedMonth - 1]}</h1>
        <BarChart selectedMonth = {selectedMonth} />
      </div>

       <div className = "pieChart">
        <h1>Pie Chart - {month[selectedMonth - 1]}</h1>
        <PieChart selectedMonth = {selectedMonth}/>
      </div>
    </>
  );
}

export default App;
