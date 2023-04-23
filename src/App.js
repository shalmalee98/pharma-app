import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Web3 from "web3";
import { PharmaSupplyChain } from "./abi/abi";
import logo from "./logo.svg";
import "./App.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Admin from "./components/AdminScreen/Admin";
import HomeScreen from "./components/HomeScreen/HomeScreen";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const contractAddress = "0x718c016c33227Fc0Dc0cC88b44117d07f31DcfDe";
const pharmaContract = new web3.eth.Contract(
  PharmaSupplyChain,
  contractAddress
);

console.log(pharmaContract.methods);

const Roles = {
  Manufacturer: 0,
  Pharmacist: 1,
  Buyer: 2,
  Admin: 3,
};

function App() {
  const [addressOfUser, setAddessOfUser] = React.useState("");
  const [roleOfUser, setRoleOfUser] = React.useState(Roles);
  const [response, setResponse] = React.useState("");

  const registerUser = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(account);

    const registerUser = await pharmaContract.methods
      .onBoardUser(addressOfUser, roleOfUser)
      .send({
        from: account,
      })
      .then(() => setResponse("User has been successfully registered"));
  };

  const viewRole = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(account);
    const str = await pharmaContract.methods.viewRole().call({
      from: account,
    });
    console.log(str.toString());

    setResponse("User role is: " + str.toString());
  };

  return (
    <div className="App">
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/home" element={<HomeScreen />} />
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </div>
      {/* <form onSubmit={registerUser}>
        <label>Set user address</label>
        <input
          type="text"
          name="userAddress"
          onChange={(e) => setAddessOfUser(e.target.value)}
        />
        <label>Set user role</label>
        <select
          name="role"
          id="role"
          onChange={(e) => setRoleOfUser(e.target.value)}
        >
          <option value={Roles.Manufacturer}>Manufacturer</option>
          <option value={Roles.Pharmacist}>Pharmacist</option>
          <option value={Roles.Buyer}>Buyer</option>
          <option value={Roles.Admin}>Admin</option>
        </select>
        <input type="submit" value="Submit"></input>
      </form> */}

      {/* <FormControl onSubmit={registerUser}>
        <TextField
          id="outlined-controlled"
          label="Enter User Address"
          // value={}
          onChange={(e) => {
            setAddessOfUser(e.target.value);
          }}
        />
        <br />
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={roleOfUser}
          label="User role"
          onChange={(e) => setRoleOfUser(e.target.value)}
        >
          <MenuItem value={Roles.Manufacturer}>Manufacturer</MenuItem>
          <MenuItem value={Roles.Pharmacist}>Pharmacist</MenuItem>
          <MenuItem value={Roles.Buyer}>Buyer</MenuItem>
          <MenuItem value={Roles.Admin}>Admin</MenuItem>
        </Select>
      </FormControl>

      <button onClick={viewRole}>View Role</button>

      <h4>{response}</h4> */}
    </div>
  );
}

export default App;
