import React from "react";
import { GET as getDetailedRejOrders} from '../api/detailedrejected/route';
import { useState, useEffect } from "react";

const DetailedRejOrdersModal = ({ isVisible, startDate, endDate, choice, onClose }) => {
  if (!isVisible) return null;

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


  return (
        <div className="w-full">
            <div className="w-full flex flex-col mb-4 gap-2">
            <h2 className="text-2xl font-bold">Detailed Rejeceted Sales Report</h2>
            <p className="font-semibold">Created at: {currentDate}</p>
            <hr className="w-full border border-gray-300"/>
            </div>     
            <div key="detailed-rejectedorders" className="mb-8">
                <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr>
                        <th className="border-b px-4 py-2">Date</th>
                        <th className="border-b px-4 py-2">Material Name</th>
                        <th className="border-b px-4 py-2">User</th>
                        <th className="border-b px-4 py-2">Insufficient Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportData
                        .map((item, index) => (
                        <tr key={index}>
                            <td className="border-b px-4 py-2">{new Date(item.created_at).toLocaleDateString("en-GB")}</td>
                            <td className="border-b px-4 py-2">{item.name}</td>
                            <td className="border-b px-4 py-2">{item.full_name}</td>
                            <td className="border-b px-4 py-2">{item.insufficient_qty} {item.metric_unit}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

                <h1>*** END OF REPORT ***</h1>
                </div>

  );
};

export default DetailedRejOrdersModal;
