    // src/components/Dashboard/Sidebar.js
    import React from 'react';
    import { Link } from 'react-router-dom';
    import './Dashboard.css';
    // import logo from '../../assets/logo.png'; // Make sure to save your logo in the specified path

    const Sidebar = () => {
    return (
        <div className="sidebar">
        {/* <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
        </div> */}
        <h2>Navigation</h2>
        <hr />
        <ul>
            <li><Link to="/inventory">Inventory</Link></li>
            <hr />
            <li><Link to="/add-product">Add Product</Link></li>
            <hr />
            <li><Link to="/logout">Logout</Link></li>
        </ul>
        </div>
    );
    };

    export default Sidebar;
