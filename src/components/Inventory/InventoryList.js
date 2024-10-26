// src/components/Inventory/Inventory.js
import React, { useState } from 'react';
import Sidebar from '../Dash/Sidebar'; // The sidebar with navigation links
import * as XLSX from 'xlsx'; // Import xlsx library
import './Inventory.css';

const Inventory = () => {
  const [data, setData] = useState([]); // State to hold the inventory data

  // Mapping of Excel column names to expected column names
  const columnMapping = {
    'Product_Category': 'Product_Category',
    'Brand': 'Brand',
    'Product_Price': 'Product_Price',
    'Stock_Level': 'Stock_Level',
    'Product_ID': 'Product_ID',
    'Product_Name': 'Product_Name',
    'Excel Predicted_Demand': 'Predicted_Demand',
    'Excel Recommendation': 'Recommendation',
    'Excel Reason': 'Reason',
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (!file) {
      console.error("No file selected"); // Log error if no file is selected
      return; // Exit if no file is selected
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result; // Get the file result
      const workbook = XLSX.read(binaryStr, { type: 'binary' }); // Use 'binary' type
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // Convert to JSON and set default value as empty string

      // Log the raw data for debugging
      console.log("Raw data from Excel:", jsonData);

      // Transform data according to the mapping
      const transformedData = jsonData.map((item) => {
        const newItem = {};
        for (const excelKey in columnMapping) {
          // Use Excel key to find value in the item and map to newItem
          const mappedKey = columnMapping[excelKey];
          newItem[mappedKey] = item[excelKey] || "N/A"; // Use mapped key and default to "N/A" if undefined
        }
        return newItem;
      });

      console.log("Transformed data:", transformedData); // Log transformed data for debugging
      setData(transformedData); // Set the transformed inventory data
    };

    reader.readAsBinaryString(file); // Use readAsBinaryString
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data); // Convert JSON data to worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Data"); // Append the worksheet to the workbook
    XLSX.writeFile(wb, "Inventory_Data.xlsx"); // Export the workbook to a file
  };

  return (
    <div className="inventory-page">
      <Sidebar />
      <div className="inventory-content">
        <div className="top-bar">
          <input
            type="file"
            accept=".xlsx, .xls" // Accept only Excel files
            onChange={handleFileUpload} // Handle file upload
          />
          <input
            type="text"
            placeholder="Search anything here"
            className="search-input"
          />
          <div className="actions">
            <button className="export-btn" onClick={handleExport}>Export</button>
            <button className="add-btn">Add Inventory</button>
          </div>
        </div>
        <div className="breadcrumb">
          <span>Dashboard / Inventory</span>
        </div>
        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Product_Category</th>
                <th>Brand</th>
                <th>Product_Price</th>
                <th>Stock_Level</th>
                <th>Product_ID</th>
                <th>Product_Name</th>
                <th>Predicted_Demand</th>
                <th>Recommendation</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Product_Category}</td>
                    <td>{item.Brand}</td>
                    <td>{item.Product_Price}</td>
                    <td>{item.Stock_Level}</td>
                    <td>{item.Product_ID}</td>
                    <td>{item.Product_Name}</td>
                    <td>{item.Predicted_Demand}</td>
                    <td>{item.Recommendation}</td>
                    <td>{item.Reason}</td>
                    <td>
                      <button className="view-btn">👁</button>
                      <button className="edit-btn">✏️</button>
                      <button className="delete-btn">🗑</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Showing 1 to {data.length} of {data.length} entries</span>
          <div className="page-controls">
            <button>1</button>
            <button>2</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
