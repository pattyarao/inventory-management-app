import React from "react";
import DetailedTable from "../components/DetailedTable";

const TableModal = ({ isVisible, reportData, reportType, choice, onClose, startDate, endDate }) => {
  if (!isVisible) return null;

  return (
    
    
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-opacity-50 bg-black backdrop-filter backdrop-blur-lg">
      <div className="w-[90%] h-[90vh] bg-white rounded-md shadow-lg h-[80%] overflow-y-auto">
        <div className="w-full flex justify-between items-center top-0 sticky bg-neutral-400/60 p-2 px-6 drop-shadow-md">
          <h1 className="font-black">Report</h1>
        <button
            className="text-black px-6 py-2 bg-gray-200 hover:bg-red-500 hover:text-white rounded-md transition ease duration-70"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>

        <div className="p-8">
        <DetailedTable reportData={reportData} reportType={reportType} choice={choice} startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </div>
  );
};

export default TableModal;
