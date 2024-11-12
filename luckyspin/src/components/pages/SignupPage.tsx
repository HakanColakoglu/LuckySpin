import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../services/api";

const SignupPage = () => {
  const [signupError, setSignupError] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, msg } = await signup(username, password);
    if (success) {
      navigate("/signin");
    } else {
      setSignupError(msg);
    }
  };

  return (
    <div className="signup-page">
      <form onSubmit={handleSignup}>
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
        <button type="submit">Sign Up</button>
      </form>
      {signupError.length > 0 && (
        <ul>
          {signupError.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <p>
        Already have an account? <Link to="/signin">Sign in here</Link>
      </p>
    </div>
  );
};

export default SignupPage;
