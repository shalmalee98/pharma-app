import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
function Buyer() {
  const [walletAddress, setWalletAddress] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [ownerOfShipment, setOwnerOfShipment] = useState("");
  const [inputTokenID, setInputTokenID] = useState("");
  const [batchNoShipment, setBatchNoShipment] = useState(Number);
  const [nameShipment, setNameShipment] = useState("");
  const [expDateShipment, setExpDateShipment] = useState("");
  const [ownerShipment, setOwnerShipment] = useState("");
  const [priceShipment, setPriceShipment] = useState(Number);

  const navigate = useNavigate();
  const location = useLocation();

  const viewRole = async () => {
    const account = location.state.walletAddress;
    console.log(account);
    if (walletAddress == "" ? setWalletAddress(account) : null);
    const str = await pharmaContract.methods.viewRole().call({
      from: walletAddress == "" ? account : walletAddress,
    });
    setMessage(`The role of the given wallet address is ` + str.toString());
    console.log(str.toString());
  };

  const viewShipment = async () => {
    const account = location.state.walletAddress;
    console.log(account);
    if (walletAddress == "" ? setWalletAddress(account) : null);
    const str = await pharmaContract.methods.viewShipment(tokenId).call({
      from: walletAddress == "" ? account : walletAddress,
    });
    setBatchNoShipment(str[0]);
    setNameShipment(str[1]);
    setExpDateShipment(str[2]);
    setOwnerShipment(str[4]);
    setPriceShipment(str[5]);
    console.log(str);
  };

  const viewOwnerAddress = async () => {
    const account = location.state.walletAddress;
    const ownerOfShipment = await pharmaContract.methods
      .ownerOf(inputTokenID)
      .call({
        from: account,
        gasLimit: "1000000",
      });
    setOwnerOfShipment(JSON.stringify(ownerOfShipment));
  };

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (!user) return navigate("/");
  }, [user, loading]);
  return (
    <div className="backgroundImg">
      <div>
        <div class="nine">
          <h1 style={{ marginTop: "0px", paddingTop: "4%" }}>
            Buyer<span>Pharmaceutial Supply Chain</span>
          </h1>
        </div>
        <div style={{ paddingRight: "10%", paddingTop: "2%" }}>
          <input
            type="text"
            className="login__textBox"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter Wallet Address"
          />
          <button className="login__btn" onClick={viewRole}>
            View Role
          </button>
          <h5>{message}</h5>

          <input
            type="text"
            className="login__textBox"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter Token ID to View Shipment"
          />
          <button className="login__btn" onClick={viewShipment}>
            View Shipment
          </button>

          {batchNoShipment ? (
            <div>
              <h4>Batch no: {batchNoShipment}</h4>
              <h4>Name of Item: {nameShipment}</h4>
              <h4>Expiry date: {expDateShipment}</h4>
              <h4>Owner of shipment: {ownerShipment}</h4>
              <h4>Price of shipment: {priceShipment}</h4>
            </div>
          ) : null}

          <input
            type="text"
            className="login__textBox"
            value={inputTokenID}
            onChange={(e) => setInputTokenID(e.target.value)}
            placeholder="Enter Token ID to View Shipment Owner ID"
          />
          <button className="login__btn" onClick={viewOwnerAddress}>
            View Shipment Owner Address
          </button>

          {ownerOfShipment ? (
            // <div>
            <h4>Owner of Shipment: {ownerOfShipment}</h4>
          ) : // </div>
          null}
          <button className="login__btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
export default Buyer;
