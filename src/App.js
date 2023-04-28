import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Admin from "./components/AdminScreen/Admin";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import Pharmacist from "./components/PharmacistScreen/Pharmacist";
import Manufacturer from "./components/ManufacturerScreen/Manufacturer";
import Buyer from "./components/BuyerScreen/Buyer";

function App() {
  return (
    <div className="App">
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/home" element={<HomeScreen />} />
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/admin" element={<Admin />} />
            <Route exact path="/pharmacist" element={<Pharmacist />} />
            <Route exact path="/manufacturer" element={<Manufacturer />} />
            <Route exact path="/buyer" element={<Buyer />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
