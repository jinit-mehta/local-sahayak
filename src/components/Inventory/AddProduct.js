// src/components/Dashboard/AddProduct.js
import React, { useState } from 'react';
import './AddProduct.css';
import Sidebar from '../Dash/Sidebar'; // Import the Sidebar component
import { FaBox, FaTags, FaMoneyBillWave, FaClipboardList, FaIndustry, FaMapMarkerAlt, FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa'; // Importing icons

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [stockLevel, setStockLevel] = useState('');
  const [manufactureDate, setManufactureDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Added:", {
      productName,
      quantity,
      price,
      category,
      brand,
      location,
      stockLevel,
      manufactureDate,
      expiryDate,
    });
    setProductName('');
    setQuantity('');
    setPrice('');
    setCategory('');
    setBrand('');
    setLocation('');
    setStockLevel('');
    setManufactureDate('');
    setExpiryDate('');
  };

  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Include Sidebar here */}
      <div className="add-product-container">
        <h2 className="page-title">Add Product</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <FaBox className="form-icon" />
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <FaClipboardList className="form-icon" />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <FaMoneyBillWave className="form-icon" />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <FaTags className="form-icon" />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <FaIndustry className="form-icon" />
            <input
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <FaMapMarkerAlt className="form-icon" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <FaClipboardList className="form-icon" />
            <input
              type="number"
              placeholder="Stock Level"
              value={stockLevel}
              onChange={(e) => setStockLevel(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <FaCalendarAlt className="form-icon" /> {/* Icon for Manufacture Date */}
            <input
              type="date"
              placeholder="Manufacture Date"
              value={manufactureDate}
              onChange={(e) => setManufactureDate(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <FaCalendarCheck className="form-icon" /> {/* Icon for Expiry Date */}
            <input
              type="date"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
