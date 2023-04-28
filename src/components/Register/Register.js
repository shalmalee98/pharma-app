import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";
import Web3 from "web3";
import { PharmaSupplyChain } from "../../abi/abi";
import "./Register.css";
import { contractAddress } from "../../constants";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();
  const Roles = {
    Manufacturer: 0,
    Pharmacist: 1,
    Buyer: 2,
    Admin: 3,
  };

  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:7545")
  );
  const pharmaContract = new web3.eth.Contract(
    PharmaSupplyChain,
    contractAddress
  );

  const registerUserOnBlockchain = async () => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(account);

    const registerUser = await pharmaContract.methods
      .onBoardUser(walletAddress, Roles[role])
      .send({
        from: account,
      });
  };

  const registerInFirebase = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(
      name,
      email,
      password,
      role,
      walletAddress
    ).then((res, err) => {
      if (!err) {
        registerUserOnBlockchain()
          .then((error, result) => {
            setMessage(
              `User with wallet address ${walletAddress} has been registered as ${role} successfully on chain and offchain!`
            );
          })
          .then((res) => {
            signInWithEmailAndPassword("ss@gmail.com", "123456");
          });
      }
    });
  };
  useEffect(() => {
    if (loading) return;
    if (user) if (user.role == "admin") navigate("/register");
  }, [user, loading]);
  return (
    <div className="backgroundImg_login">
      <div class="nine">
        <h1 style={{ marginTop: "0px", paddingTop: "4%" }}>
          Register<span>Tagline Keywords</span>
        </h1>
      </div>
      <div className="login">
        <div className="login__container">
          <input
            type="text"
            className="register__textBox"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <select
            name="Role"
            id="role"
            className="register__textBox"
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option value="Admin">Admin</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Buyer">Buyer</option>
          </select>
          <input
            type="text"
            className="register__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <input
            type="password"
            className="register__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type="text"
            className="register__textBox"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Wallet Address"
          />
          <button className="register__btn" onClick={registerInFirebase}>
            Register
          </button>
          <h5>{message}</h5>
          <div>
            Already have an account? <Link to="/">Login</Link> now.
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;
