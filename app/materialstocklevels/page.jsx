"use client";

import { useState } from "react";
import MaterialList from "../components/MaterialList";

const MaterialStockLevel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="p-10" style={{ backgroundColor: "#F1F3F8", color: "black" }}>
      {/* Header */}
      <div
        className="flex items-center justify-center w-full h-16 px-10 bg-blue-400 rounded-t-lg"
        style={{ backgroundColor: "#8D93AB", color: "white" }}
      >
        <h1 className="font-black text-xl" style={{ color: "black", fontSize: "28px" }}>
          Material Stock Levels
        </h1>
      </div>

      {/* Search bar and button */}
      <div className="w-full mt-8">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search Material"
            className="w-1/3 p-2 rounded"
            style={{ backgroundColor: "#FFFFFF", color: "#27374D" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            onClick={() => {
              console.log(`Searching for: ${searchTerm}`);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover-bg-blue-600"
          >
            Search
          </button>
        </div>

        <MaterialList searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default MaterialStockLevel;







