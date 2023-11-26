import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import DetailedTable from "../components/DetailedTable"
import { GET as getDetailedDiscrepancy} from '../api/detaileddiscrepancy/route';
import { GET as getDetailedMaterials} from '../api/detailedmaterials/route';
import { GET as getDetailedProducts} from '../api/detailedproducts/route';
import { GET as getDetailedRejOrders} from '../api/detailedrejected/route';
import { GET as getSummaryMaterials} from '../api/summarymaterials/route';
import { GET as getSummaryProducts} from '../api/summaryproducts/route';
import { GET as getSummaryRejOrders} from '../api/summaryrejected/route';
import { GET as getSummaryDiscrepancy} from '../api/summarydiscrepancy/route';
import TableModal from "../components/TableModal"; 
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";

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
  const [showModal, setShowModal]= useState(false)

  useEffect(() => {
    async function getOptions() {
      try {
        let endpoint = "";
        if (props.choice === 1) {
          endpoint = "/api/allproducts";
        } else if (props.choice === 2 || props.choice === 3 || props.choice === 4) { // Change this to 2 if it's a different choice
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
            } else if (props.choice === 2 || props.choice === 3 || props.choice === 4) { 
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
  
    // Function to close the modal
    const closeModal = () => {
      setShowModal(false)
    };

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
              setShowModal(true)
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
              setShowModal(true)
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
                setShowModal(true)
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
                setShowModal(true)
              } else {
                // Request failed, log the error
                console.error("API Error:", response);
              }
          }
        } else if (props.choice === 3) { 
          
          if(reportType === "detailed"){
              const response = await getDetailedRejOrders(startDate, endDate, selectedOptions);
          
              if (response.status === 200) {
                // Request was successful, log the data
                const data = await response.json();
                setReportData(data.detailedReport); // Store the data in the state variable
                console.log("API Response:", data.detailedReport);
                setShowModal(true)
              } else {
                // Request failed, log the error
                console.error("API Error:", response);
              }
          }
          else if (reportType === "summary"){
              const response = await getSummaryRejOrders(startDate, endDate, selectedOptions);
            
              if (response.status === 200) {
                // Request was successful, log the data
                const data = await response.json();
                setReportData(data.data); // Store the data in the state variable
                console.log("API Response:", data.data);
                setShowModal(true)
              } else {
                // Request failed, log the error
                console.error("API Error:", response);
              }
          }
        }else if (props.choice === 4) { 
          
          if(reportType === "detailed"){
              const response = await getDetailedDiscrepancy(startDate, endDate, selectedOptions);
          
              if (response.status === 200) {
                // Request was successful, log the data
                const data = await response.json();
                setReportData(data.detailedReport); // Store the data in the state variable
                console.log("API Response:", data.detailedReport);
                setShowModal(true)
              } else {
                // Request failed, log the error
                console.error("API Error:", response);
              }
          }
          else if (reportType === "summary"){
              const response = await getSummaryDiscrepancy(startDate, endDate, selectedOptions);
            
              if (response.status === 200) {
                // Request was successful, log the data
                const data = await response.json();
                setReportData(data.data); // Store the data in the state variable
                console.log("API Response:", data.data);
                setShowModal(true)
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
    <div className="w-full py-2 px-4 flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          {/* Conditional rendering for the heading based on props.choice */}
          
          {props.choice === 1 ? (
            <h2 className="text-2xl font-black">Sales Report</h2>
          ) : props.choice === 2 ? (
            <h2 className="text-2xl font-black">Material Report</h2>
          ) : props.choice === 3 ? (
            <h2 className="text-2xl font-black">Rejected Orders Report</h2>
          ) : props.choice === 4 ? (
            <h2 className="text-2xl font-black">Discrepancy Report</h2>
          ) : null}
          
          <div className="w-[20%]">
            <button
              onClick={generateReport}
              className="bg-blue-800 text-white rounded p-1 w-full"
            >
            Generate Report
            </button>
          </div>
        </div>
        <div className="w-full flex gap-4">
          <div className="w-full flex flex-col justify-start gap-4">
            <p>Fill in the necessary details to generate a report.</p>
            <div className="w-full p-2 flex flex-col gap-2 bg-slate-300 rounded-md">
              <label className="font-semibold">Select Report Type:</label>
              <div className="w-full flex items-center gap-2">
                <button className={`w-1/2 p-2 bg-slate-400 rounded-md text-sm transition ease duration-70 ${reportType === "summary" ? "bg-slate-500 text-white" : null}`} value="summary"
                  onClick={handleReportTypeChange}>Summary</button>
                <button className={`w-1/2 p-2 bg-slate-400 rounded-md text-sm transition ease duration-70 ${reportType === "detailed" ? "bg-slate-500 text-white" : null}`} value="detailed"
                    onClick={handleReportTypeChange}>Detailed</button>
              </div>
            </div>
            <div className="w-full p-2 flex items-center justify-center gap-4 bg-slate-300 rounded-md">
              <div>
                <label className="font-semibold">Start Date:</label>
                <input
                  type="date"
                  className="w-full p-2 bg-white border rounded"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </div>
              <div>
                <label className="font-semibold">End Date:</label>
                <input
                  type="date"
                  className="w-full p-2 bg-white border rounded"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
            
          </div>
          <div className="w-full flex flex-col rounded-md">
              <div className="p-1 flex justify-between bg-gray-200 rounded-md" onClick={toggleProductSelection}>
                <label className="text-sm font-semibold">Select Products:</label>
                <button
                  className="text-black"
                  
                  >
                  {isProductSelectionOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                </button>
              </div>
              {isProductSelectionOpen && (
              <div className="w-full p-2 bg-white flex justify-between flex-wrap gap-2 rounded-md">  
                  {options.map((product) => (
                  <div key={product} className="w-[170px] px-2 py-0.5 rounded-md flex items-center gap-2 bg-slate-200 text-sm">
                    <input
                      type="checkbox"
                      value={product}
                      checked={selectedOptions.includes(product) || (selectedOptions.length === options.length)}
                      onChange={handleProductChange}
                    />
                    <p>{product}</p>
                  </div>
                  ))}
                  <div className="w-full flex gap-2 bg-slate-300 px-2 py-0.5 rounded-md">
                    <input
                    type="checkbox"
                    value="Select All"
                    checked={selectedOptions.length === options.length}
                    onChange={handleSelectAll}
                    />
                    Select All
                  </div>
                  {/* Add more product options as needed */}
              </div>
              )}
            </div>
          </div>

        <TableModal isVisible={showModal} reportData={reportData} reportType={reportType} choice={props.choice} onClose={closeModal} startDate={startDate} endDate={endDate} />
              
    </div>
  );
};

export default ReportSettings;
