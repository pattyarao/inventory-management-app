"use client";

import { useState } from "react";

const AddMaterialCount = () => {
  //stores all products in the database
  const [materialsList, setMaterialsList] = useState([
    "Material F",
    "Material G",
    "Material H",
    "Material I",
  ]);

  //determines if the modal for adding a product is shown or not
  const [showModal, setShowModal] = useState(false);

  //closes the modal and removes all previous personalizations
  const handleClose = () => {
    setSearchTerm("");
    setSortOption("name-asc");
    setFilteredProductsList(materialsList);
    setShowModal(false);
  };

  //Sort and Search Mechanisms
  const [filteredProductsList, setFilteredProductsList] =
    useState(materialsList);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc"); // Initialize the default sorting option

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue === "") {
      // Show all products when the search input is empty
      setFilteredProductsList(materialsList);
    } else {
      // Filter products based on the search term
      const filteredProducts = materialsList.filter((product) =>
        product.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredProductsList(filteredProducts);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);

    if (sortOption === "name-desc") {
      filteredProductsList.sort((a, b) => {
        // Compare two items for sorting in descending order (Z-A)
        const nameA = a;
        const nameB = b;

        // Use localeCompare to perform a case-insensitive comparison
        return nameA.localeCompare(nameB);
      });
    } else if (sortOption === "name-asc") {
      filteredProductsList.sort((a, b) => {
        // Compare two items for sorting in ascending order (A-Z)
        const nameA = a;
        const nameB = b;

        // Use localeCompare to perform a case-insensitive comparison
        return nameB.localeCompare(nameA);
      });
    }
  };

  return (
    <>
      <button
        className="text-sm font-semibold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        style={{ backgroundColor: "#8D93AB", color: "black" }}
        type="button"
        onClick={() => setShowModal(true)}
      >
        Add Materials to the List
      </button>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div
              className="relative w-auto my-6 mx-auto max-w-5xl"
              style={{ minWidth: "40%" }}
            >
              {/*content*/}
              <div
                className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none"
                style={{ backgroundColor: "#D6E0F0" }}
              >
                {/*header*/}
                <div
                  className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
                  style={{ backgroundColor: "#8D93AB" }}
                >
                  <h3 className="text-3xl font-semibold">
                    Select Materials to Add
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div
                  className="relative p-6 flex-auto rounded-b-lg"
                  style={{ backgroundColor: "#D6E0F0" }}
                >
                  <div className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      placeholder="Search Products"
                      className="flex-grow p-2 rounded"
                      style={{ backgroundColor: "#F1F3F8", color: "#27374D" }}
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <select
                      style={{ backgroundColor: "#F1F3F8", color: "#27374D" }}
                      value={sortOption}
                      onChange={handleSortChange}
                      className="p-2 rounded"
                    >
                      <option value="name-asc">Sort by Name (A-Z)</option>
                      <option value="name-desc">Sort by Name (Z-A)</option>
                    </select>
                  </div>
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    {filteredProductsList.length !== 0 ? (
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Material Name
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProductsList.map((product, index) => (
                            <tr key={product.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                              <th
                                scope="row"
                                className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                <input
                                  id="vue-checkbox"
                                  type="checkbox"
                                  value=""
                                  className="me-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                {product}
                              </th>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div
                        className="w-full p-20 text-xs rounded-lg"
                        style={{ backgroundColor: "#9DB2BF", color: "#27374D" }}
                      >
                        <div className="font-black text-xl flex items-center justify-center">
                          No Records Found
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-5">
                    <div className="flex justify-end">
                      <button
                        className="text-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        style={{ backgroundColor: "#A12323" }}
                        type="button"
                        onClick={handleClose}
                      >
                        Close
                      </button>
                      <button
                        className="text-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        style={{ backgroundColor: "#097969" }}
                        type="button"
                        onClick={handleClose}
                      >
                        Add Materials
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default AddMaterialCount;
