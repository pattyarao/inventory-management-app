"use client";

import { useState, useEffect } from "react";
import withAuthentication from "../auth";
import MaterialList from "../components/MaterialList";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
// import { GET as GETModels } from '../api/modelchoices/route';

const MaterialStockLevel = ({userType, userInfo}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [sortOption, setSortOption] = useState('nameAscending'); // Default sort option
  const [loading, setLoading] = useState(false);
  const [predmodels, setPredmodels] = useState([])

  useEffect(() => {
    async function getModels() {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/modelchoices');
      
      if (response.status === 200) {
        const models = await response.json();
        setPredmodels(models.models);
        setSelectedOption(models.models[0]?.route)
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

  useEffect (() => console.log(predmodels), [predmodels]);

  const handleLoadingChange = (newLoadingState) => {
    // Update loading state in MaterialStockLevel
    setLoading(newLoadingState);
  };

  if (!userType) {
    return (
      <Loader/>
    );
  }
  return (
    <div className="w-full">
      <Navbar userType={userType} email={userInfo.email}  />
      <div className="p-8 bg-[#F1F3F8]">
        {/* Header */}
        <div className="w-full top-0 sticky bg-slate-400 p-4 rounded-md flex justify-between">
          <h1 className="text-2xl font-black">
            Material Stock Level
          </h1>
        </div>

        {/* Search bar and dropdown for options */}
        <div className="w-full rounded">
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
                <option key={index} value={option.route}>
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
                {/* <option value="predictionValue">No Sort</option> */}
                <option value="nameAscending">A - Z</option>
                <option value="nameDescending">Z - A</option>
              </select>
            </div>
          </div>

          {/* Conditionally render loader or MaterialList */}
          {loading && (
            <Loader />
          )}
            <MaterialList
              searchTerm={searchTerm}
              view="list"
              sortOption={sortOption}
              selected_model={selectedOption}
              onLoadingChange={handleLoadingChange} // Pass the callback function
            />

          {/* You can use the selectedOption state as needed in your application */}
          {selectedOption && (
            <div className="mt-4">Selected Option: {selectedOption}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuthentication(MaterialStockLevel, ['Stock Controller'])
