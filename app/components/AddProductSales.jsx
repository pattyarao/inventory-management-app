"use client";

import { useState, useEffect} from "react";
import { GET } from "../api/order/route";

const AddProductSales = (props) => {

    //stores all products in the database
    const [productsList, setProductsList] = useState([]);
    const [filteredProductsList, setFilteredProductsList] = useState([]);
    const [error, setError] = useState(null);

    
    
    //determines if the modal for adding a product is shown or not
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      async function getProducts() {
        try {
          const response = await GET();
          const { products, error } = await response.json();
    
          if (error) {
            setError(error);
            console.log("err0 " + error);
          } else {
            // Filter out products  that are already in props.orderList

            const filteredProducts = products.filter((product) =>
            props.orderList.every(
                 (orderProduct) => orderProduct.id !== product.id
               )
             );

            setProductsList(filteredProducts);
            setFilteredProductsList(filteredProducts);
            setLoading(false); // Data has been loaded
          }
        } catch (error) {
          setError(error.message);
        }
      }
      getProducts();
    }, [showModal]);

    
    
    

    //closes the modal and removes all previous personalizations
    const handleClose= () => {
        setSearchTerm('');
        setSortOption('name-asc')
        setFilteredProductsList(productsList);
        setShowModal(false);
      };

    //Sort and Search Mechanisms
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('name-asc'); // Initialize the default sorting option

    const handleAddtoOrderList = () => {
      // Filter selected products based on the 'checked' property
      const selectedProducts = filteredProductsList.filter((mat) => mat.checked);
  
      // Call the parent component's function to update selected products
      props.onAddProducts(selectedProducts);
      // Close the modal or perform any other action
      setShowModal(false);
    };
  
  
    const handleSearchChange = (e) => {
      const searchValue = e.target.value;
      setSearchTerm(searchValue);
  
      if (searchValue === "") {
        // Show all products when the search input is empty
        setFilteredProductsList(productsList);
      } else {
        // Filter products based on the search term
        const filteredProducts = productsList.filter((product) =>
          product.name.toLowerCase().includes(searchValue.toLowerCase()),
        );
        setFilteredProductsList(filteredProducts);
      }
    };
  
    const handleSortChange = (e) => {
      setSortOption(e.target.value);
  
      if (sortOption === "name-desc") {
        filteredProductsList.sort((a, b) => {
          // Compare two items for sorting in descending order (Z-A)
          const nameA = a.name;
          const nameB = b.name;
  
          // Use localeCompare to perform a case-insensitive comparison
          return nameA.localeCompare(nameB);
        });
      } else if (sortOption === "name-asc") {
        filteredProductsList.sort((a, b) => {
          // Compare two items for sorting in ascending order (A-Z)
          const nameA = a.name;
          const nameB = b.name;
  
          // Use localeCompare to perform a case-insensitive comparison
          return nameB.localeCompare(nameA);
        });
      }
    };

    const handleCheckboxChange = (product) => {
      const updatedProducts = filteredProductsList.map((item) => {
        if (item === product) {
          return {
            ...item,
            checked: !item.checked, // Toggle the checked status
          };
        }
        return item;
      });
      setProductsList(updatedProducts);
      setFilteredProductsList(updatedProducts);
    };
  
   
  
    return (
      <>
        <button
          className="text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
          style={{ backgroundColor: '#27374D', color: 'white' }}
          type="button"
          onClick={() => setShowModal(true)}
        >
          Add Products to Order List
        </button>

        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-5xl" style={{ minWidth: '40%' }} >
                {/*content*/}
                <div className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none" style={{ backgroundColor: '#526D82'}}>
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t" style={{ backgroundColor: '#27374D'}}>
                    <h3 className="text-3xl font-semibold">
                      Select Products to Add
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
                  <div className="relative p-6 flex-auto rounded-b-lg" style={{ backgroundColor: '#526D82'}}>
                    
                  <div className="flex space-x-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search Products"
                        className="flex-grow p-2 rounded"
                        style={{ backgroundColor: '#DDE6ED', color:"#27374D"}}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <select
                        style={{ backgroundColor: '#DDE6ED', color:"#27374D"}}
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
                                        Product name
                                    </th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                            {filteredProductsList.map((product, index) => (
                            <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={product.id}>
                              <th
                                scope="row"
                                className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                <input
                                  id={`checkbox-${product.id}`} // Use a unique ID for each checkbox
                                  type="checkbox"
                                  value=""
                                  checked={product.checked} // Bind the checked status to the 'checked' property
                                  onChange={() => handleCheckboxChange(product)} // Handle checkbox change
                                  className="me-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                {product.name}
                              </th>
                            </tr>
                          ))}
                            </tbody>
                        </table>
                        ):(
                            <div className="w-full p-20 text-xs rounded-lg" style={{ backgroundColor: '#9DB2BF', color: '#27374D' }}>
                            <div className="font-black text-xl flex items-center justify-center">
                            No Records Found
                            </div>
                        </div>
                        )}
                    </div>
                    <div className="mt-5">
                  <div className="flex justify-end"> 
                    <button
                      className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#A12323"}}
                      type="button"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <button
                      className="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      style={{ backgroundColor: "#097969"}}
                      type="button"
                      onClick={handleAddtoOrderList}
                    >
                      Add Products
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

export default AddProductSales;
