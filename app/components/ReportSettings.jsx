import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DetailedTable from "../components/DetailedTable"
import { GET as getDetailedMaterials} from '../api/detailedmaterials/route';
import { GET as getDetailedProducts} from '../api/detailedproducts/route';
import { GET as getSummaryMaterials} from '../api/summarymaterials/route';
import { GET as getSummaryProducts} from '../api/summaryproducts/route';

const ReportSettings = (props) => {
  const router = useRouter();
  
  // State to control the expand/collapse of product selection
  const [isProductSelectionOpen, setProductSelectionOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("detailed"); // Initialize to "detailed"
  const [reportData, setReportData] = useState([]); // State variable to store report data
  const [options, setOptions]= useState([])


  useEffect(() => {
    async function getOptions() {
      try {
        let endpoint = "";
        if (props.choice === 1) {
          endpoint = "/api/allproducts";
        } else if (props.choice === 2) { // Change this to 2 if it's a different choice
          endpoint = "/api/allmaterials";
        }
  
        if (endpoint) {
          const response = await fetch(endpoint, {
            cache: "no-store",
          });
          const data = await response.json();
          
          if (data.error) {
            console.error(data.error);
          } else {
            // Extract the 'name' property from the response data

            if (props.choice === 1) {
              const names = data.products.map(item => item.name);
              setOptions(names);
            } else if (props.choice === 2) { 
              const names = data.materials.map(item => item.name);
              setOptions(names);
            }
            
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    getOptions();
  }, [props.choice]); // Add props.choice as a dependency
  

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
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((product) => product !== value);
      } else {
        return [...prevSelected, value];
      }
    });
  };

    const handleSelectAll = () => {
      if (selectedOptions.length === options.length) {
        // If all options are selected, deselect all
        setSelectedOptions([]);
      } else {
        // If not all options are selected, select all
        setSelectedOptions(options);
      }
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
        // console.log("Selected Products:", selectedOptions);
        // console.log("Start Date:", startDate);
        // console.log("End Date:", endDate);
        // console.log(reportType)


        if (props.choice === 1) {
          

          if(reportType === "detailed"){
            const response = await getDetailedProducts(startDate, endDate, selectedOptions);
          
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
          else if (reportType === "summary"){
            const response = await getSummaryProducts(startDate, endDate, selectedOptions);
          
            if (response.status === 200) {
              // Request was successful, log the data
              const data = await response.json();
              setReportData(data.data); // Store the data in the state variable
              console.log("API Response:", data.data);
            } else {
              // Request failed, log the error
              console.error("API Error:", response);
            }

          }
        } else if (props.choice === 2) { 
          
          if(reportType === "detailed"){
              const response = await getDetailedMaterials(startDate, endDate, selectedOptions);
          
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
          else if (reportType === "summary"){
              const response = await getSummaryMaterials(startDate, endDate, selectedOptions);
            
              if (response.status === 200) {
                // Request was successful, log the data
                const data = await response.json();
                setReportData(data.data); // Store the data in the state variable
                console.log("API Response:", data.data);
              } else {
                // Request failed, log the error
                console.error("API Error:", response);
              }
          }
        }




      } catch (error) {
        console.error("Error:", error);
      }
    };
    

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
                  {options.map((product) => (
                <label key={product} className="inline-flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox mr-2"
                    value={product}
                    checked={selectedOptions.includes(product) || (selectedOptions.length === options.length)}
                    onChange={handleProductChange}
                  />
                  {product}
                </label>
              ))}
              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  className="form-checkbox mr-2"
                  value="Select All"
                  checked={selectedOptions.length === options.length}
                  onChange={handleSelectAll}
                />
                Select All
              </label>
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

        <DetailedTable reportData={reportData} reportType={reportType} choice={props.choice}/>

    </>
  );
};

export default ReportSettings;
