import React from "react";
import DetailedTable from "../components/DetailedTable";

const TableModal = ({ isVisible, reportData, reportType, choice, onClose, startDate, endDate }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black backdrop-filter backdrop-blur-lg">
      <div className="bg-white p-8 rounded-md shadow-lg max-h-96 overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-white hover:text-red-500"
          onClick={onClose}
        >
          CLOSE X
        </button>

        <DetailedTable reportData={reportData} reportType={reportType} choice={choice} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
};

export default TableModal;
