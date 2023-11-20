"use client";

import { useState } from "react";
import MaterialList from "../components/MaterialList";
import Navbar from "../components/Navbar";

const MaterialStockLevel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(""); // State for the selected option

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
    <Navbar userType={"Stock Controller"}/>
    <div className="p-8" style={{ backgroundColor: "#F1F3F8", color: "black" }}>
      {/* Header */}
      <div
        className="flex items-center justify-center w-full h-16 px-10 bg-blue-400 rounded-md"
        style={{ backgroundColor: "#8D93AB", color: "white" }}
      >
        <h1 className="font-black text-xl" style={{ color: "black", fontSize: "28px" }}>
          Material Stock Levels
        </h1>
      </div>

      {/* Search bar and dropdown for options */}
      <div className="w-full mt-8">
        <div className="p-6 flex items-center">
          <input
            type="text"
            placeholder="Search Material"
            className="w-1/3 p-2 rounded"
            style={{ backgroundColor: "#FFFFFF", color: "#27374D" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Dropdown for options */}
          <select
            className="ml-4 p-2 rounded"
            style={{ backgroundColor: "#FFFFFF", color: "#27374D" }}
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="">Select Algorithm</option>
            <option value="a">Algorithm A</option>
            <option value="b">Algorithm B</option>
            <option value="c">Algorithm C</option>
            <option value="d">Algorithm D</option>
            <option value="e">Algorithm E</option>
          </select>
        </div>

        {/* Material List component with fixed "list" view */}
        <MaterialList searchTerm={searchTerm} view="list" />

        {/* You can use the selectedOption state as needed in your application */}
        {selectedOption && (
          <div className="mt-4">
            Selected Option: {selectedOption}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default MaterialStockLevel;
