import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SigninPage.css";
import { signin } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SigninPage = () => {
  const { isSignedIn, setIsSignedIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signin(username, password);
    if (success) {
      setIsSignedIn(true);
      navigate("/");
    }
  };

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="signin-page">
      <form onSubmit={handleSignin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default SigninPage;
