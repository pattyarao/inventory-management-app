import React from "react";
import { useState, useEffect } from "react";
import { GET as getDetailedProducts} from '../api/detailedproducts/route';

const DetailedSummaryModal = ({ isVisible, startDate, endDate, choice, onClose }) => {
  if (!isVisible) return null;

  const [groupedData, setGroupedData] = useState({});
  const [reportData, setReportData] = useState([]); 
  const currentDate = new Date().toLocaleDateString('en-GB');
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

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black backdrop-filter backdrop-blur-lg">
      <div className="bg-white p-8 rounded-md shadow-lg max-h-96 overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-white hover:text-red-500"
          onClick={onClose}
        >
          CLOSE X
        </button>

        <div>
        <h2 className="text-2xl font-bold mb-4">Detailed Sales Report</h2>
        <p className="text-lg font-semibold mb-2">Created at: {currentDate}</p>
        {Object.keys(groupedData).map((productName) => (
          <div key={productName} className="mb-8">

            <h3 className="text-2xl font-bold mb-4">{productName}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2">Date</th>
                    <th className="border-b px-4 py-2">Product Name</th>
                    <th className="border-b px-4 py-2">Product Status</th>
                    <th className="border-b px-4 py-2">User</th>
                    <th className="border-b px-4 py-2">Quantity Ordered</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData[productName].map((item, index) => (
                    <tr key={index}>
                      <td className="border-b px-4 py-2">
                      {new Date(item.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="border-b px-4 py-2">{item.product_name}</td>
                      <td className="border-b px-4 py-2">{item.product_status}</td>
                      <td className="border-b px-4 py-2">{item.user}</td>
                      <td className="border-b px-4 py-2">{item.qty_ordered}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <h1 className="text-3xl font-bold mt-8 text-center">*** END OF REPORT ***</h1>
      </div>

      </div>
    </div>
  );
};

export default DetailedSummaryModal;