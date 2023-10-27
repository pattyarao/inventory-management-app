import { useState } from "react";
import { useRouter } from "next/navigation";

const DetailedTable = ({ reportData }) => {
    console.log("SHEEEEEEEEEESH")
    console.log(reportData)
    return(
        <>
        {reportData.detailedReport != null && (
          <div>
            {reportData.detailedReport.map((reportItem, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold">{reportItem.material_name}</h3>
                <table className="min-w-full divide-y divide-gray-200 shadow-sm">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Type
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Variation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.detailedReport
                      .filter((item) => item.material_name === reportItem.material_name)
                      .map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td className="px-6 py-4 whitespace-no-wrap">{item.date}</td>
                          <td className="px-6 py-4 whitespace-no-wrap">{item.amount}</td>
                          <td className="px-6 py-4 whitespace-no-wrap">{item.qty}</td>
                          <td className="px-6 py-4 whitespace-no-wrap">{item.transac_type}</td>
                          <td className="px-6 py-4 whitespace-no-wrap">{item.user}</td>
                          <td className="px-6 py-4 whitespace-no-wrap">{item.variation}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </>
      
    )

}

export default DetailedTable;
