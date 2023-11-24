import { useState } from "react";
import ReportSettings from "../components/ReportSettings";

const ReportSelect = () => {
  const [choice, setChoice] = useState(null);

  const handleLinkClick = (clickedChoice) => {
    setChoice(clickedChoice);
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 rounded-md">
      <div className="w-full flex flex-col gap-2">
        <h1 className="w-full rounded-t-md text-lg font-black">Select a report to generate</h1>
        <div className="w-full h-full flex justify-center gap-6">
          <button
            onClick={() => handleLinkClick(1)}
            className={`w-full p-2 rounded-md flex items-center justify-center drop-shadow-md border border-slate-300 text-sm transition ease duration-70 ${
              choice === 1 ? "bg-[#8D93AB]" : "bg-[#F1F3F8]"
            }`}
          >
            Sales Transaction Report
          </button>
          <button
            onClick={() => handleLinkClick(2)}
            className={`w-full p-2 rounded-md flex items-center justify-center drop-shadow-md border border-slate-300 text-sm transition ease duration-70 ${
              choice === 2 ? "bg-[#8D93AB]" : "bg-[#F1F3F8]"
            }`}
          >
            Material Transaction Report
          </button>
        <button 
            onClick={() => handleLinkClick(3)}
            className={`w-full p-2 rounded-md flex items-center justify-center drop-shadow-md border border-slate-300 text-sm transition ease duration-70 ${
            choice === 3 ? "bg-[#8D93AB]" : "bg-[#F1F3F8]"
            }`}>Rejected Orders Report
        </button>
        </div>
      </div>

      <div className="w-full h-full">
      {choice !== null && <ReportSettings choice={choice} />}
      </div>
    </div>
  );
};

export default ReportSelect;
