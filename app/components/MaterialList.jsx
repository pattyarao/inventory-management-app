"use client";

import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { BsFillGrid3X2GapFill } from "react-icons/bs";
import { BsViewList } from "react-icons/bs";
import { GET } from '../api/materialmaster/route';

const MaterialList = ({ searchTerm, view }) => {
   const materials = [
     {
       name: "Material A",
       amount: 50,
       metric_unit: "mL",
       suggested_amt: 300,
       level_status: 1,
     },
     {
       name: "Material B",
       amount: 100,
       metric_unit: "g",
       suggested_amt: 200,
       level_status: 2,
     },
     {
       name: "Material C",
       amount: 50,
       metric_unit: "mL",
       suggested_amt: 500,
       level_status: 3,
     },
     {
       name: "Material D",
       amount: 200,
       metric_unit: "kg",
       suggested_amt: 300,
       level_status: 2,
     },
     {
       name: "Material E",
       amount: 2,
       metric_unit: "L",
       suggested_amt: 10,
       level_status: 1,
     },
   ];
  // const [materials, setMaterials] = useState([])
  
  useEffect(() => {
    async function getMaterials() {
      const response = await GET();
            
              if (response.status === 200) {
                // Request was successful, log the data
                const data = await response.json();
                setMaterials(data.materials); // Store the data in the state variable
                console.log("API Response:", data.materials);
              } else {
                // Request failed, log the error
                console.error("API Error:", response);
              }
    }
  
    getMaterials();
  }, []); 


  // Filter materials based on the search term
  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort materials based on level_status
  const sortedMaterials = filteredMaterials.slice().sort((a, b) => a.level_status - b.level_status);

  return (
    <div>
      {/* Render the filtered and sorted materials */}
      <div className="m-auto w-full">
        {/* Headings */}
        <div className="flex items-center justify-between w-full h-16 px-20">
          <h1 className="font-black text-2xl text-gray-500" style={{ color: "black" }}>
            Material
          </h1>
          <h1 className="font-black text-2xl text-gray-500" style={{ color: "black" }}>
            Current Stock
          </h1>
          <h1 className="font-black text-2xl text-gray-500" style={{ color: "black" }}>
            Suggested Restock Amount
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          {sortedMaterials.map((material, index) => (
            <div key={index} className="mb-2 bg-[#D6E0F0] p-4 flex flex-col rounded-md">
              <div
                className={`${
                  view === "grid"
                    ? "w-[30%] bg-[#F1F3F8] p-4 rounded-lg flex flex-col gap-2"
                    : "w-full bg-[#F1F3F8] flex justify-between items-center rounded-lg"
                }`}
              >
                <div className="flex items-center justify-between w-full ">
                    <p className="pl-6 font-semibold">
                      {material.name} 
                    </p>
                  <p className="pl-2 pr-10 text-right font-semibold">
                      {material.amount}{material.metric_unit}
                  </p> 
                  <p className="pl-2 pr-10 text-right font-semibold">
                      {material.suggested_amt}{material.metric_unit}
                  </p>  
                </div>
                
                <div className="ml-auto">
                  <p
                    className={`w-fit px-6 py-6 rounded-md rounded-tl-none rounded-bl-none p-0 ${
                      material.level_status === 1
                        ? "bg-red-300"
                        : material.level_status === 2
                        ? "bg-yellow-200"
                        : material.level_status === 3
                        ? "bg-green-200"
                        : "bg-neutral-200"
                    }`}
                  ></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialList;
