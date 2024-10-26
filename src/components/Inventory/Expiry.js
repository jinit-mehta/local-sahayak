import React, { useState } from 'react';
import Sidebar from '../Dash/Sidebar';
import * as XLSX from 'xlsx';
import './Expiry.css';

const Expiry = () => {
    const [data, setData] = useState([]);
    const [expiryData, setExpiryData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("No file selected");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            console.log("Raw data from Excel:", jsonData); // Log to inspect data
            setData(jsonData);
            await calculateExpiry(jsonData);
        };

        reader.readAsBinaryString(file);
    };

    const calculateExpiry = async (products) => {
        const results = await Promise.all(products.map(async (product) => {
            if (!product.Expiry_Date) {
                console.error(`Missing Expiry_Date for product: ${product.Product_Name}`);
                return { Product_Name: product.Product_Name, Expiry_Date: product.Expiry_Date };
            }

            try {
                const response = await fetch('http://localhost:5000/expiry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    //body: JSON.stringify({ Expiry_Date: product.Expiry_Date }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                return { Product_Name: product.Product_Name, Expiry_Date: product.Expiry_Date };
            } catch (error) {
                console.error(`Error fetching expiry for ${product.Product_Name}: ${error.message}`);
                return { Product_Name: product.Product_Name, Expiry_Date: product.Expiry_Date };
            }
        }));

        setExpiryData(results);
    };

    return (
        <div className="inventory-page">
            <Sidebar />
            <div className="inventory-content">
                <div className="top-bar">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                    />
                    <input
                        type="text"
                        placeholder="Search anything here"
                        className="search-input"
                    />
                    <div className="actions">
                        <button className="add-btn">Add Expiry</button>
                    </div>
                </div>
                <div className="breadcrumb">
                    <span>Dashboard / Expiry</span>
                </div>
                <div className="inventory-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expiryData.length > 0 ? (
                                expiryData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Product_Name}</td>
                                        <td>{item.Expiry_Date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expiry;
