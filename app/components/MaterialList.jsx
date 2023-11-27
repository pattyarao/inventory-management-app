"use client";

import { useState, useEffect } from "react";
import { GET as GETMaterialMaster } from '../api/materialmaster/route';
import Loader from "../components/Loader";

const MaterialList = ({ searchTerm, view, sortOption, selected_model, onLoadingChange }) => {
  const [materials, setMaterials] = useState([]);
  const [filterOption, setFilterOption] = useState('All');
  const [prediction, setPrediction] = useState([]);
  const [loading, setLoading] = useState(false);

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

    // async function getForecast() {
      
    //   const response = await GETForecast(selected_model);

    //   if (response.status === 200) {
    //     const data = await response.json();
    //     setPrediction(data.data);
    //   } else {
    //     console.error('API Error:', response);
    //   }
    // }

    async function forecast() {
      setLoading(true);

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/forecast/" + selected_model);

        if (response.status === 200) {
          const data = await response.json();
          setPrediction(data.data);
        } else {
          console.error("API Error:", response);
        }
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
        // Call the callback function to update loading state in MaterialStockLevel
        onLoadingChange && onLoadingChange(false);
      }
    }

    forecast();
  }, [selected_model, onLoadingChange]);
  
    useEffect(() => console.log(prediction), [prediction]);  

  // Filter materials based on the search term and filter option
  const filteredMaterials = materials.filter((material) => {
    const matchesSearchTerm = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isQtyZero = material.qty_available === 0;

    switch (filterOption) {
      case 'N/A':
        return matchesSearchTerm && prediction[material.id] === 'N/A';
      case 'stockIsSufficient':
        return matchesSearchTerm && prediction[material.id] === 'Stock is Sufficient';
      case 'predictedValue':
        return matchesSearchTerm && prediction[material.id] !== 'N/A' && prediction[material.id] !== 'Stock is Sufficient';
      case 'qtyIsZero':
          return matchesSearchTerm && isQtyZero;
      default:
        return matchesSearchTerm;
    }
  });

  // Sort materials based on selected option
  const sortedMaterials = filteredMaterials.slice().sort((a, b) => {
    switch (sortOption) {
      case 'nameAscending':
        return a.name.localeCompare(b.name);
      case 'nameDescending':
        return b.name.localeCompare(a.name);
      case 'predictionValue':
        // Custom sorting logic for predictions
        const order = { "N/A": 1, "Stock is Sufficient": 2 };

        const predictionA = order[prediction[a.id]] || 0;
        const predictionB = order[prediction[b.id]] || 0;

        // Compare based on the numerical values assigned to predictions
        if (predictionA !== predictionB) {
          return predictionA - predictionB;
        }

        // If predictions are the same, fallback to alphabetical sorting by name
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  // console.log('MATERYALES: ', materials);
  // console.log('PREDIKSYONNN: ', prediction);
  

  return (
    <div className="mb-2 bg-[#D6E0F0] p-4 flex flex-col rounded-md">
      {/* Display loader if loading is true */}
      {loading && <Loader />}
  
      {/* Headings and Filter dropdown */}
      {!loading && (
        <div
          className={`${
            view === 'grid'
              ? 'grid grid-cols-4 gap-4 items-center'
              : 'flex justify-between items-center'
          } bg-[#D6E0F0] rounded-lg p-4 `}
        >
          <h1 className="pl-10 w-1/5 font-black text-xl text-black">
            Material
          </h1>
          <h1 className="pl-10 w-1/5 whitespace-normal text-left font-black text-xl text-black">
            Current Stock
          </h1>
          <h1 className="pl-10 w-1/5 whitespace-normal text-center font-black text-xl text-black">
            Suggested Restock Amount
          </h1>
          <select
            className="p-3 ml-2 rounded-md bg-white"
            value={filterOption}
            onChange={handleFilterChange}
          >
            <option value="All">All Materials</option>
            <option value="qtyIsZero">Materials with No Stock</option>
            <option value="predictedValue">Materials for Restocking</option>
            <option value="stockIsSufficient">Sufficient Stock</option>
            <option value="N/A">Insufficient Data for Prediction</option>
          </select>
        </div>
      )}
  
      {/* Render the filtered and sorted materials */}
      {!loading && (
        <div className="m-auto w-full">
          <div className="flex flex-col gap-4">
            {sortedMaterials.map((material, index) => (
              <div id={material.id} key={index} className="flex flex-col rounded-md">
                <div
                  className={`${
                    view === 'grid'
                      ? 'grid grid-cols-4 gap-4 items-center'
                      : 'flex justify-between items-center'
                  } bg-[#F1F3F8] rounded-lg`}
                >
                  <p className="pl-10 text-left font-semibold w-1/5 whitespace-normal">
                    {material.name}
                  </p>
                  <p className="p-6 text-right font-semibold w-2/5 whitespace-normal">
                    {material.qty_available}
                    {material.REF_METRIC.metric_unit}
                  </p>
                  <p className="p-6 font-semibold text-right w-2/5 whitespace-normal">
                    {prediction[material.id] != null ? (
                      prediction[material.id] === 'N/A' ? (
                        'Insufficient Data for Prediction'
                      ) : prediction[material.id] === 'Stock is Sufficient' ? (
                        'Stock is Sufficient'
                      ) : (
                        `${prediction[material.id]} ${material.REF_METRIC.metric_unit || ''}`
                      )
                    ) : (
                      'No Data'
                    )}
                  </p>
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
      )}
    </div>
  );
};

export default MaterialList;