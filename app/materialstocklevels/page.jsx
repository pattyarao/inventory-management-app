"use client";

import { useState, useEffect } from "react";
import MaterialList from "../components/MaterialList";
import Navbar from "../components/Navbar";
import { GET as GETModels } from '../api/modelchoices/route';

const MaterialStockLevel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [sortOption, setSortOption] = useState('predictionValue'); // Default sort option
  const [predmodels, setPredmodels] = useState([])

  useEffect(() => {
    async function getModels() {
      const response = await GETModels();

      if (response.status === 200) {
        const models = await response.json();

        setPredmodels(models.models);
        setSelectedOption(models.models[0]?.id)
      } else {
        console.error('API Error:', response);
      }
    }

    getModels();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <>
      <Navbar userType={"Stock Controller"} />
      <div className="p-8 bg-[#F1F3F8]">
        {/* Header */}
        <div
          className="flex items-center justify-center w-full h-16 px-10 rounded-md bg-[#8D93AB]"
        >
          <h1 className="font-black text-xl">Material Stock Levels</h1>
        </div>

        {/* Search bar and dropdown for options */}
        <div className="w-full mt-8 p-3 rounded">
          <div className="p-6 flex items-center">
            <input
              type="text"
              placeholder="Search Material"
              className="w-1/3 p-2 rounded"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="ml-8">
              <label className="font-semibold ">Select Algorithm: </label>
              <select
              className="ml-4 p-3 rounded"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              {predmodels.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            </div>

            {/* Sort dropdown */}
            <div className="ml-auto">
              <label className="font-semibold mr-4">Sort by: </label>
              <select
                className="p-3 rounded-md bg-white"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="predictionValue">No Sort</option>
                <option value="nameAscending">A - Z</option>
                <option value="nameDescending">Z - A</option>
              </select>
            </div>
          </div>

          {/* Material List component with fixed "list" view */}
          <MaterialList
            searchTerm={searchTerm}
            view="list"
            sortOption={sortOption}
            selected_model={selectedOption}
          />

          {/* You can use the selectedOption state as needed in your application */}
          {selectedOption && (
            <div className="mt-4">Selected Option: {selectedOption}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default MaterialStockLevel;
