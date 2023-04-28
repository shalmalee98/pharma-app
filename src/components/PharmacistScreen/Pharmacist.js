import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../Login/Login.css";
import Web3 from "web3";
import { PharmaSupplyChain } from "../../abi/abi";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { contractAddress } from "../../constants";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const pharmaContract = new web3.eth.Contract(
  PharmaSupplyChain,
  contractAddress
);
function Pharmacist() {
  const [walletAddress, setWalletAddress] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [nameOfMedicine, setNameOfMedicine] = useState("");
  const [descriptionOfMedicine, setDescriptionOfMedicine] = useState("");
  const [addressOfManufacturer, setAddressOfManufacturer] = useState("");
  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState("");

  const [openDialogTransfer, setOpenDialogTransfer] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [ownerOfShipment, setOwnerOfShipment] = useState("");
  const [inputTokenID, setInputTokenID] = useState("");
  const [batchNoShipment, setBatchNoShipment] = useState(Number);
  const [nameShipment, setNameShipment] = useState("");
  const [expDateShipment, setExpDateShipment] = useState("");
  const [ownerShipment, setOwnerShipment] = useState("");
  const [priceShipment, setPriceShipment] = useState(Number);

  const [inputTokenIDTransfer, setInputTokenIDTransfer] = useState("");
  const [inputOwnerAddressTransfer, setInputOwnerAddressTransfer] =
    useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // const background = "../..//background.jpeg";

  const viewRole = async () => {
    const account = location.state.walletAddress;
    const str = await pharmaContract.methods.viewRole().call({
      from: walletAddress == "" ? account : walletAddress,
    });
    setMessage(`The role of the given wallet address is ` + str.toString());
    console.log(str.toString());
  };

  const createPurchaseOrder = async () => {
    const account = location.state.walletAddress;
    if (walletAddress == "" ? setWalletAddress(account) : null);
    const createPurchaseOrder = await pharmaContract.methods
      .createPurchaseOrder(
        nameOfMedicine,
        descriptionOfMedicine,
        addressOfManufacturer
      )
      .send({
        from: account,
        gasLimit: "1000000",
      });
    if (createPurchaseOrder.blockHash) {
      setOpenDialog(false);
      setAlert("Purchase order is created!");
      setShowAlert(true);
    }
    console.log("Purchase order created: ", createPurchaseOrder);
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
    <div
      // className="login__container"
      // style={{
      //   size: "1040px",
      //   height: "960px",
      //   // backgroundImage: `url("http://127.0.0.1:8887/background3.jpeg")`,
      //   backgroundImage: `url("https://www.lahacienda.com/wp-content/uploads/2022/06/Norco-Drug-Information.jpg)`,
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "contain",
      //   // height: "100%",
      //   // width: "100%",
      // }}
      className="backgroundImg"
    >
      <div>
        <div class="nine">
          <h1 style={{ marginTop: "0px", paddingTop: "4%" }}>
            Pharmacist<span>Tagline Keywords</span>
          </h1>
        </div>
        <div style={{ paddingRight: "10%", paddingTop: "2%" }}>
          <button
            variant="contained"
            className="login__btn"
            onClick={handleClickOpen}
          >
            Create Purchase Order
          </button>
          <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create a purchase order for a batch of medicines, enter the
                medicine detail here.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name of Item"
                type="text"
                fullWidth
                variant="standard"
                value={nameOfMedicine}
                onChange={(e) => setNameOfMedicine(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                type="text"
                fullWidth
                variant="standard"
                value={descriptionOfMedicine}
                onChange={(e) => setDescriptionOfMedicine(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="address"
                label="Address of manufacturer"
                type="text"
                fullWidth
                variant="standard"
                value={addressOfManufacturer}
                onChange={(e) => setAddressOfManufacturer(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={createPurchaseOrder}>Create</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={showAlert} onClose={() => setShowAlert(false)}>
            <DialogTitle>{alert}</DialogTitle>
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
            <div>
              <h4>Owner of Shipment: {ownerOfShipment}</h4>
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
export default Pharmacist;
