import React, { useState } from "react";
import './DropDown.css';

function App({selectedMonth, setSelectedMonth}) {

  const handleChange = (event) => {
    setSelectedMonth(event.target.value)
  };

  return (
    <div>
      <select className="month-dropdown" value={selectedMonth} onChange={handleChange}>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
    </div>
  );
}

export default App;
