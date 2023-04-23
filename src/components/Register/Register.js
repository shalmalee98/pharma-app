import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";
import Web3 from "web3";
import { PharmaSupplyChain } from "../../abi/abi";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(Number);
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
  const contractAddress = "0x718c016c33227Fc0Dc0cC88b44117d07f31DcfDe";
  const pharmaContract = new web3.eth.Contract(
    PharmaSupplyChain,
    contractAddress
  );

  const registerUserOnBloackchain = async () => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(account);

    const registerUser = await pharmaContract.methods
      .onBoardUser(walletAddress, role)
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
        registerUserOnBloackchain().then((error, result) => {
          setMessage(
            `User with wallet address ${walletAddress} has been registered as ${role} successfully on chain and offchain!`
          );
        });
      }
    });
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/register");
  }, [user, loading]);
  return (
    <div className="register">
      <div className="register__container">
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
          <option value={Roles.Admin}>Admin</option>
          <option value={Roles.Manufacturer}>Manufacturer</option>
          <option value={Roles.Pharmacist}>Pharmacist</option>
          <option value={Roles.Buyer}>Buyer</option>
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
  );
}
export default Register;
