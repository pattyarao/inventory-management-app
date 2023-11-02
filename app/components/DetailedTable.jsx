import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DetailedTable = ({ reportData, reportType, choice }) => {
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const grouped = {};

    if (reportData && reportData.length > 0 && reportType === "detailed" && choice === 1) {
      reportData.forEach((item) => {
        const productName = item.product_name;

        if (!grouped[productName]) {
          grouped[productName] = [];
        }

        grouped[productName].push(item);
      });
    }
    else if (reportData && reportData.length > 0 && (reportType === "detailed" || reportType === "summary")  && choice === 2){
      reportData.forEach((item) => {
        const materialName = item.material_name;

        if (!grouped[materialName]) {
          grouped[materialName] = [];
        }

        grouped[materialName].push(item);
      });
    }

    setGroupedData(grouped);
  }, [reportData]);


  if (reportData != null && reportData.length > 0) {
    
    if (reportType === "detailed" && choice === 1) {
      console.log("DETAILED SALES", groupedData)
    

      return (
        <div>
          {Object.keys(groupedData).map((productName) => (
            <div key={productName}>
              <h2>{productName}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product Name</th>
                    <th>Product Status</th>
                    <th>User</th>
                    <th>Quantity Ordered</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData[productName].map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.product_name}</td>
                      <td>{item.product_status}</td>
                      <td>{item.user}</td>
                      <td>{item.qty_ordered}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <h1>*** END OF REPORT ***</h1>
        </div>
      );
    } else if (reportType === "summary" && choice === 1) {
      // Render summary content for reportType 1
      return (
        <div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>{item.total_sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h1>*** END OF REPORT ***</h1>
        </div>
      );
    } else if (reportType === "detailed" && choice === 2) {
      // Render detailed content for reportType 2
      console.log("DETAILED MATERIALS", groupedData)
      return (
        <div>
          {Object.keys(groupedData).map((materialName) => (
            <div key={materialName}>
              <h2>{materialName}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Material Name</th>
                    <th>Quantity</th>
                    <th>Transaction Type</th>
                    <th>User</th>
                    <th>Variation</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData[materialName].map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.material_name}</td>
                      <td>{item.qty}</td>
                      <td>{item.transac_type}</td>
                      <td>{item.user}</td>
                      <td>{item.variation}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <h1>*** END OF REPORT ***</h1>
        </div>
      );
    } else if (reportType === "summary" && choice === 2) {
      // Render summary content for reportType 2
      console.log("SUMMARY MATERIAL", groupedData)
      return (
        <div>
          {Object.keys(groupedData).map((materialName) => (
            <div key={materialName}>
              <h2>{materialName}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Transaction Type</th>
                    <th>Material Name</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData[materialName].map((item, index) => (
                    <tr key={index}>
                      <td>{item.grouped_transac_type}</td>
                      <td>{item.material_name}</td>
                      <td>{item.total_amt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <h1>*** END OF REPORT ***</h1>
        </div>
        
      );
    }
  }

  // If none of the conditions match, you can return a default message or null.
  return (<>
    <h1>Invalid.</h1>
  </>);
};

export default DetailedTable;

// (
//   <div>
//     {reportData.detailedReport.map((reportItem, index) => (
//       <div key={index}>
//         <h3 className="text-lg font-semibold">{reportItem.material_name}</h3>
//         <table className="min-w-full divide-y divide-gray-200 shadow-sm">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                 Amount
//               </th>
//               <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                 Quantity
//               </th>
//               <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                 Transaction Type
//               </th>
//               <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                 User
//               </th>
//               <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                 Variation
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {reportData.detailedReport
//               .filter((item) => item.material_name === reportItem.material_name)
//               .map((item, itemIndex) => (
//                 <tr key={itemIndex}>
//                   <td className="px-6 py-4 whitespace-no-wrap">{item.date}</td>
//                   <td className="px-6 py-4 whitespace-no-wrap">{item.amount}</td>
//                   <td className="px-6 py-4 whitespace-no-wrap">{item.qty}</td>
//                   <td className="px-6 py-4 whitespace-no-wrap">{item.transac_type}</td>
//                   <td className="px-6 py-4 whitespace-no-wrap">{item.user}</td>
//                   <td className="px-6 py-4 whitespace-no-wrap">{item.variation}</td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     ))}
//   </div>
// )