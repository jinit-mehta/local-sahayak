// src/components/Dashboard/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/add-product">Add Product</Link></li>
        <li><Link to="/expiry">Expiry</Link></li>
        <li><Link to="/">Logout</Link></li>
        {/* Add more navigation items here */}
      </ul>
    </div>
  );
};

export default Sidebar;
