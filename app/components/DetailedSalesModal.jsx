import React from "react";
import { useState, useEffect } from "react";
import { GET as getDetailedProducts} from '../api/detailedproducts/route';

const DetailedSummaryModal = ({ isVisible, startDate, endDate, choice, onClose }) => {
 

  const [groupedData, setGroupedData] = useState({});
  const [reportData, setReportData] = useState([]); 
  const currentDate = new Date().toLocaleDateString('en-GB');
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
  useEffect(() => {
    async function getSales() {

            try{
            const response = await getDetailedProducts(startDate, endDate, [choice]);

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
  
    getSales();
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
  if (!isVisible) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black backdrop-filter backdrop-blur-lg">
      <div className="w-[70%] h-[90vh] bg-white rounded-md shadow-lg overflow-y-auto pb-8">
        <div className="w-full">
          <div className="w-full flex justify-between items-center px-6 py-2 bg-neutral-400/80 top-0 sticky">
            <div>
            <h2 className="text-2xl font-bold ">Drilled Down Sales Report</h2>
            <p className="text-sm">Created at: {currentDate} {currentTime}</p>
            </div>
            <div>
            <button
              className="text-black py-1 px-6 bg-gray-200 hover:bg-red-500 hover:text-white rounded-md transition ease duration-70"
              onClick={onClose}
            >
              CLOSE
            </button>
            </div>
          </div>
            {Object.keys(groupedData).map((productName) => (
            <div key={productName} className="w-full p-8">
              <h3 className="text-2xl font-bold mb-2">{productName}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border-b border-r text-left px-4 py-2">Date of Transaction</th>
                      <th className="border-b border-r text-left px-4 py-2">Recording Sales Person</th>
                      <th className="border-b border-r text-left px-4 py-2 text-right">Quantity Ordered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedData[productName].map((item, index) => (
                      <tr key={index}>
                        <td className="border-b border-r px-4 py-2">
                        {new Date(item.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="border-b border-r px-4 py-2">{item.user}</td>
                        <td className="border-b border-r px-4 py-2 text-right">{item.qty_ordered} units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        ))}
        <h1 className="text-3xl font-bold mt-8 text-center">*END OF REPORT*</h1>
      </div>

      </div>
    </div>
  );
};

export default DetailedSummaryModal;
