import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../Login/Login.css";
import Web3 from "web3";
import { PharmaSupplyChain } from "../../abi/abi";
import { contractAddress } from "../../constants";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { create } from "@mui/material/styles/createTransitions";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const pharmaContract = new web3.eth.Contract(
  PharmaSupplyChain,
  contractAddress
);
function Manufacturer() {
  const [walletAddress, setWalletAddress] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogTransfer, setOpenDialogTransfer] = useState(false);
  const [batchNumber, setBatchNumber] = useState(Number);
  const [nameOfItem, setNameOfItem] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [price, setPrice] = useState(Number);
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [ownerOfShipment, setOwnerOfShipment] = useState("");
  const [inputTokenID, setInputTokenID] = useState("");

  const [nameOfPOItem, setNameOfPOItem] = useState("");
  const [descOfPOItem, setDescfPOItem] = useState("");
  const [batchNoShipment, setBatchNoShipment] = useState(Number);
  const [nameShipment, setNameShipment] = useState("");
  const [expDateShipment, setExpDateShipment] = useState("");
  const [priceShipment, setPriceShipment] = useState(Number);

  const [inputTokenIDTransfer, setInputTokenIDTransfer] = useState("");
  const [inputOwnerAddressTransfer, setInputOwnerAddressTransfer] =
    useState("");

  const location = useLocation();

  const viewRole = async () => {
    const account = location.state.walletAddress;
    const str = await pharmaContract.methods.viewRole().call({
      from: walletAddress == "" ? account : walletAddress,
    });
    setMessage(`The role of the given wallet address is ` + str.toString());
    console.log(str.toString());
  };

  const viewPurchaseOrders = async () => {
    const account = location.state.walletAddress;
    console.log(account);
    if (walletAddress == "" ? setWalletAddress(account) : null);
    const str = await pharmaContract.methods.viewPurchaseOrders().call({
      from: walletAddress == "" ? account : walletAddress,
    });
    setNameOfPOItem(str[0]);
    setDescfPOItem(str[1]);
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

  const createShipment = async () => {
    const account = location.state.walletAddress;
    if (walletAddress == "" ? setWalletAddress(account) : null);
    const createShipment = await pharmaContract.methods
      .createShipment(batchNumber, nameOfItem, expiryDate, price)
      .send({
        from: account,
        gasLimit: "1000000",
      });
    if (createShipment.blockHash) {
      setOpenDialog(false);
      setAlert("Shipment is created!");
      setShowAlert(true);
    }

    console.log("Shipment created: ", createShipment);
  };

  const transferShipment = async () => {
    const account = location.state.walletAddress;
    if (walletAddress == "" ? setWalletAddress(account) : null);
    const transferShipment = await pharmaContract.methods
      .transferShipment(inputTokenIDTransfer, inputOwnerAddressTransfer)
      .send({
        from: account,
        gasLimit: "1000000",
      });
    if (transferShipment.blockHash) {
      setOpenDialogTransfer(false);
      setAlert("Shipment is transferred!");
      setShowAlert(true);
    }

    console.log("Shipment created: ", transferShipment);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
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
            Manufacturer<span>Pharmaceutial Supply Chain</span>
          </h1>
        </div>
        <div style={{ paddingRight: "10%", paddingTop: "2%" }}>
          <button className="login__btn " onClick={handleClickOpen}>
            Create Shipment
          </button>
          <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Create Shipment</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create a shipment for a batch of medicines (This will
                essentially create an NFT), enter the medicine detail here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Batch number"
                type="text"
                fullWidth
                variant="standard"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Name of item"
                type="text"
                fullWidth
                variant="standard"
                value={nameOfItem}
                onChange={(e) => setNameOfItem(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="address"
                label="Expiry date"
                type="text"
                fullWidth
                variant="standard"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="address"
                label="Price"
                type="number"
                fullWidth
                variant="standard"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={createShipment}>Create</Button>
            </DialogActions>
          </Dialog>
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
            <div>
              <h4>Owner of Shipment: {ownerOfShipment}</h4>
            </div>
          ) : null}
          <button className="login__btn" onClick={viewPurchaseOrders}>
            View Purchase Orders
          </button>
          {nameOfPOItem ? (
            <div>
              <h4>Batch Number: {batchNumber}</h4>
              <h4>Description of Item: {descOfPOItem}</h4>
            </div>
          ) : null}
          <Dialog open={showAlert} onClose={() => setShowAlert(false)}>
            <DialogTitle>{alert}</DialogTitle>
          </Dialog>

          <button
            className="login__btn"
            onClick={() => setOpenDialogTransfer(true)}
          >
            Transfer Shipment
          </button>
          <Dialog
            open={openDialogTransfer}
            onClose={(e) => setOpenDialogTransfer(false)}
          >
            <DialogTitle>Transfer Shipment</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To transfer a shipment for a batch of medicines, enter the token
                ID and new owner address detail here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="tokenId"
                label="Token ID"
                type="text"
                fullWidth
                variant="standard"
                value={inputTokenIDTransfer}
                onChange={(e) => setInputTokenIDTransfer(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Address of New Owner"
                type="text"
                fullWidth
                variant="standard"
                value={inputOwnerAddressTransfer}
                onChange={(e) => setInputOwnerAddressTransfer(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialogTransfer(false)}>
                Cancel
              </Button>
              <Button onClick={transferShipment}>Transfer</Button>
            </DialogActions>
          </Dialog>
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
          {message != "" ? <h5>{message}</h5> : null}
          <button className="login__btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
export default Manufacturer;
