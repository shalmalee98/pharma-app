import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../Login/Login.css";
import Web3 from "web3";
import { PharmaSupplyChain } from "../../abi/abi";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const contractAddress = "0x718c016c33227Fc0Dc0cC88b44117d07f31DcfDe";
const pharmaContract = new web3.eth.Contract(
  PharmaSupplyChain,
  contractAddress
);
function Admin() {
  const [walletAddress, setWalletAddress] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const viewRole = async () => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(account);
    if (walletAddress == "" ? setWalletAddress(account) : null);
    const str = await pharmaContract.methods.viewRole().call({
      from: walletAddress == "" ? account : walletAddress,
    });
    setMessage(`The role of the given wallet address is ` + str.toString());
    console.log(str.toString());
  };

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/admin");
  }, [user, loading]);
  return (
    // <div className="admin">
    <div className="login__container">
      <button className="login__btn" onClick={() => navigate("/register")}>
        Register a User
      </button>

      <input
        type="text"
        className="login__textBox"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Enter Wallet Address"
      />
      <button className="login__btn login__google" onClick={viewRole}>
        View Role
      </button>
      <h5>{message}</h5>
      <button className="dashboard__btn" onClick={logout}>
        Logout
      </button>
    </div>
    // </div>
  );
}
export default Admin;
