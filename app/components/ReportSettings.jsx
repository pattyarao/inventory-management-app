import { useState } from "react";
import { useRouter } from "next/navigation";

const ReportSettings = (props) => {
  const router = useRouter();

  // State to control the expand/collapse of product selection
  const [isProductSelectionOpen, setProductSelectionOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

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

    // Function to generate the report and log selectedProducts
    const generateReport = () => {
        console.log("Selected Products:", selectedProducts);
        // You can add additional logic for report generation here
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
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio" name="reportType" value="summary" /> Summary
            </label>
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio" name="reportType" value="detailed" /> Detailed
            </label>
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
            <input type="date" className="w-full p-2 bg-white border rounded" />
          </div>
          <div>
            <label className="text-lg font-semibold">End Date:</label>
            <input type="date" className="w-full p-2 bg-white border rounded" />
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

    </>
  );
};

export default ReportSettings;
