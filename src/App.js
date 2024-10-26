// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AddProduct from './components/Inventory/AddProduct';
import InventoryList from './components/Inventory/InventoryList';
import Expiry from './components/Inventory/Expiry'; 
import Dashboard from './components/Dash/Dashboard'; 

const App = () => {
  return (
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/Expiry" element={<Expiry />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  
  );
};

export default App;
