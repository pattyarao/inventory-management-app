"use client";

import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { BsFillGrid3X2GapFill } from "react-icons/bs";
import { BsViewList } from "react-icons/bs";
import { GET as GETMaterialMaster } from '../api/materialmaster/route';
import { GET as GETForecast  } from '../api/forecast/route';

const MaterialList = ({ searchTerm, view }) => {
  const [materials, setMaterials] = useState([]);
  const [sortOption, setSortOption] = useState('nameAscending'); // Default sort option
  const [prediction, setPrediction] = useState([]);

  useEffect(() => {
    async function getMaterials() {
      const response = await GETMaterialMaster();

      if (response.status === 200) {
        const data = await response.json();
        const apiMaterials = data.materials;

        // Dummy data
        const dummyData = [
          {
            name: 'Glutamine',
            qty_available: 20,
            suggested_amt: 100,
            REF_METRIC: { metric_unit: 'g' },
          },
          {
            name: 'Pepsi',
            qty_available: 150,
            suggested_amt: 300,
            REF_METRIC: { metric_unit: 'mL' },
          },
        ];

        // Combine API data with dummy data
        const combinedMaterials = [...apiMaterials];

        setMaterials(combinedMaterials);
      } else {
        console.error('API Error:', response);
      }
    }

    getMaterials();
  }, []);

  useEffect(() => {
    async function getForecast() {
      const response = await GETForecast();

      if (response.status === 200) {
        const data = await response.json();
        setPrediction(data.data);
      } else {
        console.error('API Error:', response);
      }
    }

    getForecast();
  }, []);

  // calculate the priority of restock
  // const calculatePriority = (current, suggested) => {
  //   const disparityPercentage = (current / suggested) * 100;

  //   if (disparityPercentage < 50) {
  //     return 1; // High priority
  //   } else if (disparityPercentage === 50) {
  //     return 2; // Medium priority
  //   } else {
  //     return 3; // Low priority
  //   }
  // };

  // Filter materials based on the search term
  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort materials based on selected option
  const sortedMaterials = filteredMaterials.slice().sort((a, b) => {
    switch (sortOption) {
      // case 'highPriority':
      //   return calculatePriority(a.qty_available, a.suggested_amt) - calculatePriority(b.qty_available, b.suggested_amt);
      // case 'lowPriority':
      //   return calculatePriority(b.qty_available, b.suggested_amt) - calculatePriority(a.qty_available, a.suggested_amt);
      case 'nameAscending':
        return a.name.localeCompare(b.name);
      case 'nameDescending':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  console.log('PREDIKSYONNN: ', prediction);
  console.log('MATERYALES: ', materials)
  return (
    <div className="mb-2 bg-[#D6E0F0] p-4 flex flex-col rounded-md">
      {/* Headings and Filter dropdown */}
      <div
        className={`${
          view === 'grid'
            ? 'grid grid-cols-4 gap-4 items-center'
            : 'flex justify-between items-center'
        } bg-[#D6E0F0] rounded-lg p-4 `}
      >
        <h1 className="pl-10 w-1/5 font-black text-2xl text-gray-500" style={{ color: 'black' }}>
          Material
        </h1>
        <h1 className="pl-10 w-1/5 whitespace-normal font-black text-2xl text-gray-500" style={{ color: 'black' }}>
          Current Stock
        </h1>
        <h1 className="pl-10 w-1/5 whitespace-normal text-center font-black text-2xl text-gray-500" style={{ color: 'black' }}>
          Suggested Restock Amount
        </h1>
        <select
          className="p-2 rounded-md bg-white"
          value={sortOption}
          onChange={handleSortChange}
        >
          {/* <option value="highPriority">High Priority</option>
          <option value="lowPriority">Low Priority</option> */}
          <option value="nameAscending">Sort by Name (A-Z)</option>
          <option value="nameDescending">Sort by Name (Z-A)</option>
        </select>
      </div>

      {/* Render the filtered and sorted materials */}
      <div className="m-auto w-full">
        <div className="flex flex-col gap-4">
          {sortedMaterials.map((material, index) => (
            <div id={material.id} key={index} className="p-4 flex flex-col rounded-md">
              <div
                className={`${
                  view === 'grid'
                    ? 'grid grid-cols-4 gap-4 items-center'
                    : 'flex justify-between items-center'
                } p-2 bg-[#F1F3F8] rounded-lg`}
              >
                <p className="pl-10 font-semibold w-1/5 whitespace-normal">
                  {material.name}</p>
                <p className="p-2 text-right font-semibold w-2/5 whitespace-normal">
                  {material.qty_available}
                  {material.REF_METRIC.metric_unit}
                </p>
                <p className="p-2 text-right font-semibold w-2/5 whitespace-normal">
                  {(prediction[material.id] != null) ? prediction[material.id] : "No Data"}
                  {((prediction[material.id] === "N/A" || prediction[material.id] === "Stock is Sufficient") && prediction[material.id] != null) ? " " : material.REF_METRIC.metric_unit}
                  
                </p>

                {/* <p
                  className={`w-fit px-8 py-8 rounded-md rounded-tl-none rounded-bl-none ${
                    calculatePriority(material.qty_available, material.suggested_amt) === 1
                      ? 'bg-red-300'
                      : calculatePriority(material.qty_available, material.suggested_amt) === 2
                      ? 'bg-yellow-200'
                      : calculatePriority(material.qty_available, material.suggested_amt) === 3
                      ? 'bg-lime-200'
                      : 'bg-neutral-200'
                  }`}
                ></p> */}
                <p
                  className={`w-flex p-2 text-right font-semibold w-2/5 whitespace-normal rounded-md rounded-tl-none rounded-bl-none ${
                    'bg-[#F1F3F8]'
                  }`} 
                ></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialList;