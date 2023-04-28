import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../Login/Login.css";
import Web3 from "web3";
import { PharmaSupplyChain } from "../../abi/abi";
import { contractAddress } from "../../constants";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const pharmaContract = new web3.eth.Contract(
  PharmaSupplyChain,
  contractAddress
);
function Admin() {
  const [walletAddress, setWalletAddress] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  const viewRole = async () => {
    const account = location.state.walletAddress;
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
    if (!user) navigate("/");
  }, [user, loading]);
  return (
    <div className="backgroundImg">
      <div>
        <div class="nine">
          <h1 style={{ marginTop: "0px", paddingTop: "4%" }}>
            Admin<span>Tagline Keywords</span>
          </h1>
        </div>
        <div style={{ paddingRight: "10%", paddingTop: "2%" }}>
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
      </div>
    </div>
  );
}
export default Admin;
