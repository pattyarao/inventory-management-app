import React from "react";
import DetailedTable from "../components/DetailedTable";

const TableModal = ({ isVisible, reportData, reportType, choice, onClose, startDate, endDate }) => {
  if (!isVisible) return null;

  return (
    
    
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-opacity-50 bg-black backdrop-filter backdrop-blur-lg">
                <button
          className="absolute top-4 right-4 text-white hover:text-red-500"
          onClick={onClose}
        >
          CLOSE X
        </button>
      <div className=" w-[90%] bg-white p-8 rounded-md shadow-lg h-[80%] overflow-y-auto">


        <DetailedTable reportData={reportData} reportType={reportType} choice={choice} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
};

export default TableModal;
