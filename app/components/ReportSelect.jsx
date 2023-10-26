import { useState } from "react";
import ReportSettings from "../components/ReportSettings";

const ReportSelect = () => {
  const [choice, setChoice] = useState(null);

  const handleLinkClick = (clickedChoice) => {
    setChoice(clickedChoice);
  };

  return (
    <div className="w-[90%] h-fit mb-8 bg-[#D6E0F0] p-4 flex flex-col gap-4 rounded-md">
      <div className="flex">
        <button
          onClick={() => handleLinkClick(1)}
          className={`w-1/2 p-2 rounded-md flex items-center justify-center ${
            choice === 1 ? "bg-[#8D93AB]" : "bg-[#F1F3F8]"
          }`}
        >
          <p className="text-lg ...">Sales Transaction Report</p>
        </button>
        <button
          onClick={() => handleLinkClick(2)}
          className={`w-1/2 p-2 rounded-md flex items-center justify-center ${
            choice === 2 ? "bg-[#8D93AB]" : "bg-[#F1F3F8]"
          }`}
        >
          <p className="text-lg ...">Material Transaction Report</p>
        </button>
      </div>

      {choice !== null && <ReportSettings choice={choice} />}
    </div>
  );
};

export default ReportSelect;
