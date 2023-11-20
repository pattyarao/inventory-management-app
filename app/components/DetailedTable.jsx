import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DetailedSalesModal from "./DetailedSalesModal"
import DetailedMaterialsModal from "./DetailedMaterialsModal"

const DetailedTable = ({ reportData, reportType, choice, startDate, endDate  }) => {
  const [groupedData, setGroupedData] = useState({});
  const [showDetailedSalesModal, setDetailedSalesShowModal]= useState(false)
  const [salesDrillDown, setSalesDrillDown] = useState()
  const [showDetailedMaterialsModal, setDetailedMaterialsShowModal]= useState(false)
  const [materialDrillDown, setMaterialDrillDown] = useState()
  

      // Function to close the modal
      const closeDetailedSalesModal = () => {
        setDetailedSalesShowModal(false)
      };

      const openDetailedSalesModal = () => {
        setDetailedSalesShowModal(true)
      };

      const closeDetailedMaterials = () => {
        setDetailedMaterialsShowModal(false)
      };

      const openDetailedMaterials = () => {
        setDetailedMaterialsShowModal(true)
      };

      const handleMaterialDrillDown = (material_name) => {
        setMaterialDrillDown(material_name);
        console.log(materialDrillDown)
        openDetailedMaterials()
      };

      const handlesSalesDrillDown = (product_name) => {
        setSalesDrillDown(product_name);
        // console.log(materialDrillDown)
        openDetailedSalesModal()
      };
  

  const currentDate = new Date().toLocaleDateString('en-GB');
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


      );
    } else if (reportType === "summary" && choice === 1) {
      // Render summary content for reportType 1
      return (
      <div>
          <h2 className="text-2xl font-bold mb-4">Summarized Sales Report</h2>
          <p className="text-lg font-semibold mb-2">Created at: {currentDate}</p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Product Name</th>
                <th className="border-b px-4 py-2">Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2" onClick={() => handlesSalesDrillDown(item.product_name)}>{item.product_name}</td>
                  <td className="border-b px-4 py-2">{item.total_sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h1 className="text-3xl font-bold mt-8 text-center">*** END OF REPORT ***</h1>
        <DetailedSalesModal isVisible={showDetailedSalesModal} startDate={startDate} endDate={endDate} choice={salesDrillDown} onClose={closeDetailedSalesModal}/>
      </div>

      );
    } else if (reportType === "detailed" && choice === 2) {
      // Render detailed content for reportType 2
          console.log("DETAILED MATERIALS", groupedData)
          return (
            <div className="w-[60%]">
            <h2 className="text-2xl font-bold mb-4">Detailed Material Report</h2>
            <p className="text-lg font-semibold mb-2">Created at: {currentDate}</p>
            <h3 className="text-2xl font-bold mb-4">No Variations</h3>    
            {Object.keys(groupedData).map((materialName) => (
      <div key={materialName} className="mb-8">
        <h3 className="text-2xl font-bold mb-4">{materialName}</h3>
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

      <h3 className="text-2xl font-bold mb-4">With Variations</h3>            
      {Object.keys(groupedData).map((materialName) => (
      <div key={materialName} className="mb-8">
        <h3 className="text-2xl font-bold mb-4">{materialName}</h3>
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
      );
    } else if (reportType === "summary" && choice === 2) {
      // Render summary content for reportType 2
      console.log("SUMMARY MATERIAL", groupedData)
      return (
        <div>
        {Object.keys(groupedData).map((materialName) => (
          <div key={materialName} className="mb-8">
            <h2 className="text-2xl font-bold mb-4" onClick={() => handleMaterialDrillDown(materialName)}>{materialName}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2">Transaction Type</th>
                    <th className="border-b px-4 py-2">Material Name</th>
                    <th className="border-b px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData[materialName].map((item, index) => (
                    <tr key={index}>
                      <td className="border-b px-4 py-2">{item.grouped_transac_type}</td>
                      <td className="border-b px-4 py-2" >{item.material_name}</td>
                      <td className="border-b px-4 py-2">{item.total_amt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <DetailedMaterialsModal isVisible={showDetailedMaterialsModal} startDate={startDate} endDate={endDate} choice={materialDrillDown} onClose={closeDetailedMaterials}/>
            </div>
          </div>
        ))}
        <h1 className="text-3xl font-bold mt-8 text-center">*** END OF REPORT ***</h1>
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