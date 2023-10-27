import { useState } from "react";
import { useRouter } from "next/navigation";
import DetailedTable from "../components/DetailedTable"
import { GET } from '../api/detailedmaterials/route';

const ReportSettings = (props) => {
  const router = useRouter();

  // State to control the expand/collapse of product selection
  const [isProductSelectionOpen, setProductSelectionOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("detailed"); // Initialize to "detailed"
  const [reportData, setReportData] = useState([]); // State variable to store report data


  // Function to toggle the selected report type
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };
  
  // Function to toggle product selection section
  const toggleProductSelection = () => {
    setProductSelectionOpen(!isProductSelectionOpen);
  };

  // Function to handle checkbox changes
  const handleProductChange = (e) => {
    const value = e.target.value;
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((product) => product !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

    // Function to handle start date change
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
      };
    
      // Function to handle end date change
      const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
      };

    // Function to generate the report and log selectedProducts
    const generateReport = async () => {
      try {
        console.log("Selected Products:", selectedProducts);
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        console.log(reportType)


        // Call the GET function with start_date and end_date
        const response = await GET(startDate, endDate);
    
        if (response.status === 200) {
          // Request was successful, log the data
          const data = await response.json();
          setReportData(data); // Store the data in the state variable
          console.log("API Response:", data);
        } else {
          // Request failed, log the error
          console.error("API Error:", response);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    console.log("wahoo:", reportData);
    

  return (
    <>

      <div>
          {/* Conditional rendering for the heading based on props.choice */}
          {props.choice === 1 ? (
            <h2 className="text-2xl font-semibold">Sales Report</h2>
          ) : props.choice === 2 ? (
            <h2 className="text-2xl font-semibold">Material Report</h2>
          ) : null}
          <label className="text-lg font-semibold">Report Type:</label>
          <div className="flex gap-4">
        <label className="text-lg font-semibold">Report Type:</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="reportType"
              value="summary"
              checked={reportType === "summary"}
              onChange={handleReportTypeChange}
            /> Summary
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="reportType"
              value="detailed"
              checked={reportType === "detailed"}
              onChange={handleReportTypeChange}
            /> Detailed
          </label>
        </div>
      </div>
        </div>

        <div>
          <div className="flex justify-between">
            <label className="text-lg font-semibold">Product Selection:</label>
            <button
              className={`bg-blue-500 text-white rounded p-2 ${
                isProductSelectionOpen ? "rounded-t" : "rounded"
              }`}
              onClick={toggleProductSelection}
            >
              {isProductSelectionOpen ? "Collapse" : "Expand"}
            </button>
          </div>
          {isProductSelectionOpen && (
            <div>
              <label className="text-sm font-semibold">Select Products:</label>
              <div>
                {/* Replace ["product1", "product2", "product3"] with GET from all product in master data */}
                {["product1", "product2", "product3"].map((product) => (
                  <label
                    key={product}
                    className="inline-flex items-center mb-2"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox mr-2"
                      value={product}
                      checked={selectedProducts.includes(product)}
                      onChange={handleProductChange}
                    />
                    {product}
                  </label>
                ))}
                {/* Add more product options as needed */}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
        <div>
          <label className="text-lg font-semibold">Start Date:</label>
          <input
            type="date"
            className="w-full p-2 bg-white border rounded"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label className="text-lg font-semibold">End Date:</label>
          <input
            type="date"
            className="w-full p-2 bg-white border rounded"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>


        <div className="w-full">
          <button
            onClick={generateReport}
            className="bg-blue-500 text-white rounded p-2 w-full"
          >
            Generate Report
          </button>
        </div>

        <DetailedTable reportData={reportData}/>

    </>
  );
};

export default ReportSettings;
