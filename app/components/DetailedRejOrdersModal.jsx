import React from "react";
import { GET as getDetailedRejOrders} from '../api/detailedrejected/route';
import { useState, useEffect } from "react";

const DetailedRejOrdersModal = ({ isVisible, startDate, endDate, choice, onClose }) => {
  

  const [reportData, setReportData] = useState([]); 
  const currentDate = new Date().toLocaleDateString('en-GB');
  useEffect(() => {
    async function getRejectedOrders() {

            try{
            const response = await getDetailedRejOrders(startDate, endDate, [choice]);

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
  
    getRejectedOrders();
  }, [choice]);

  if (!isVisible) return null;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black backdrop-filter backdrop-blur-lg">
      <div className="w-[70%] h-[90vh] bg-white rounded-md shadow-lg overflow-y-auto pb-8">
        <div className="w-full">
        <div className="w-full flex justify-between items-center px-6 py-2 bg-neutral-400/80 top-0 sticky">
            <div>
            <h2 className="text-2xl font-bold ">Drilled Down Rejected Orders Report</h2>
            <p className="text-sm">Created at: {currentDate}</p>
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
               
            <div key="detailed-rejectedorders" className="w-full p-8">
                <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr>
                        <th className="border-b border-r px-4 py-2 text-left">Date</th>
                        <th className="border-b border-r px-4 py-2 text-left">Material Name</th>
                        <th className="border-b border-r px-4 py-2 text-left">User</th>
                        <th className="border-b border-r px-4 py-2 text-right">Insufficient Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportData
                        .map((item, index) => (
                        <tr key={index}>
                            <td className="border-b border-r px-4 py-2 text-left">{new Date(item.created_at).toLocaleDateString("en-GB")}</td>
                            <td className="border-b border-r px-4 py-2 text-left">{item.name}</td>
                            <td className="border-b border-r px-4 py-2 text-left">{item.full_name}</td>
                            <td className="border-b border-r px-4 py-2 text-right">{item.insufficient_qty} {item.metric_unit}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            <h1 className="text-3xl font-bold mt-8 text-center">*END OF REPORT*</h1>
                </div>
                </div>
                </div>

  );
};

export default DetailedRejOrdersModal;
