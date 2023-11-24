import React from "react";
import { GET as getDetailedMaterials} from '../api/detailedmaterials/route';
import { useState, useEffect } from "react";

const DetailedMaterialsModal = ({ isVisible, startDate, endDate, choice, onClose }) => {
  if (!isVisible) return null;

  const [groupedData, setGroupedData] = useState({});
  const [reportData, setReportData] = useState([]); 
  const currentDate = new Date().toLocaleDateString('en-GB');
  useEffect(() => {
    async function getMaterials() {

            try{
            const response = await getDetailedMaterials(startDate, endDate, [choice]);

              if (response.status === 200) {
                // Request was successful, log the data
                const data = await response.json();
                
                setReportData(data.detailedReport); // Store the data in the state variable
                console.log("API Response:", data.detailedReport);
              } else {
                // Request failed, log the error
                console.error("API Error:", response);
              }
              
            }
            catch(error){
                console.log(error)
            }
    }
  
    getMaterials();
  }, [choice]);


  useEffect(() => {
    const grouped = {};
    async function groupData() {
        reportData.forEach((item) => {
            const productName = item.product_name;
    
            if (!grouped[productName]) {
              grouped[productName] = [];
            }
    
            grouped[productName].push(item);
          });

          setGroupedData(grouped);

    }
  
    groupData();
  }, [reportData]);



  console.log(groupedData)

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black backdrop-filter backdrop-blur-lg">
      <div className="w-[90%] h-[90vh] bg-white rounded-md shadow-lg overflow-y-auto">
      <div className="top-0 sticky w-full flex flex-col gap-2 items-center justify-between bg-neutral-400/80 px-6 py-2">
              <div className="w-full flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black">{choice} Drilled Down Report</h2>
                  <p className="text-sm">Created at: {currentDate}</p>
                </div>
                <button className="text-black py-2 px-6 bg-gray-200 hover:bg-red-500 hover:text-white rounded-md transition ease duration-70"
                onClick={onClose}>
                  CLOSE</button>
              </div>
            </div>
        <div className="p-8">
            
            <h3 className="text-xl font-bold mb-4">No Variations</h3>    
            {Object.keys(groupedData).map((materialName) => (
      <div key={materialName} className="mb-8">
        <h3 className="text-lg font-bold mb-4">{choice}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Date</th>
                <th className="border-b px-4 py-2">Material Name</th>
                <th className="border-b px-4 py-2">Quantity</th>
                <th className="border-b px-4 py-2">Transaction Type</th>
                <th className="border-b px-4 py-2">User</th>
                <th className="border-b px-4 py-2">Variation</th>
                <th className="border-b px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {groupedData[materialName]
                .filter((item) => item.variation === "No Variation")
                .map((item, index) => (
                  <tr key={index}>
                    <td className="border-b px-4 py-2">{new Date(item.date).toLocaleDateString("en-GB")}</td>
                    <td className="border-b px-4 py-2">{item.material_name}</td>
                    <td className="border-b px-4 py-2">{item.qty}</td>
                    <td className="border-b px-4 py-2">{item.transac_type}</td>
                    <td className="border-b px-4 py-2">{item.user}</td>
                    <td className="border-b px-4 py-2">{item.variation}</td>
                    <td className="border-b px-4 py-2">{item.amount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}
        
        <h3 className="text-xl font-bold mb-4">With Variations</h3>            
        {Object.keys(groupedData).map((materialName) => (
        <div key={materialName} className="mb-8">
            <h3 className="text-lg font-bold mb-4">{choice}</h3>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="border-b px-4 py-2">Date</th>
                    <th className="border-b px-4 py-2">Material Name</th>
                    <th className="border-b px-4 py-2">Quantity</th>
                    <th className="border-b px-4 py-2">Transaction Type</th>
                    <th className="border-b px-4 py-2">User</th>
                    <th className="border-b px-4 py-2">Variation</th>
                    <th className="border-b px-4 py-2">Amount</th>
                </tr>
                </thead>
                <tbody>
                {groupedData[materialName]
                    .filter((item) => item.variation !== "No Variation")
                    .map((item, index) => (
                    <tr key={index}>
                         <td className="border-b px-4 py-2">{new Date(item.date).toLocaleDateString("en-GB")}</td>
                        <td className="border-b px-4 py-2">{item.material_name}</td>
                        <td className="border-b px-4 py-2">{item.qty}</td>
                        <td className="border-b px-4 py-2">{item.transac_type}</td>
                        <td className="border-b px-4 py-2">{item.user}</td>
                        <td className="border-b px-4 py-2">{item.variation}</td>
                        <td className="border-b px-4 py-2">{item.amount}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
        ))}

            <h1>*** END OF REPORT ***</h1>
            </div>

      </div>
    </div>

  );
};

export default DetailedMaterialsModal;
