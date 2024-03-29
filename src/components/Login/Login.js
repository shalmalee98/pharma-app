import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/home");
  }, [user, loading]);

  const signIn = (email, password) => {
    logInWithEmailAndPassword(email, password).then((res, err) => {
      if (!err) {
        console.log(res.toString());
      }
    });
  };
  return (
    <div className="backgroundImg_login">
      <div class="nine">
        <h1 style={{ marginTop: "0px", paddingTop: "4%" }}>
          Login<span>Pharmaceutial Supply Chain</span>
        </h1>
      </div>
      <div className="login">
        <div className="login__container">
          <input
            type="text"
            className="login__textBox1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <input
            type="password"
            className="login__textBox1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="login__btn1"
            onClick={() => signIn(email, password)}
          >
            Login
          </button>
          {/* <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div> */}
        </div>
      </div>
    </div>
  );
}
export default Login;
