import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBalance } from "../../context/BalanceProvider";
import { getBalance } from "../../services/api";
import coin from "../../assets/coin.svg";
import logo from "../../assets/logo.png";

import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

type NavbarProps = {
  onLogout: () => void;
};

const Navbar = ({ onLogout }: NavbarProps) => {
  const { isSignedIn } = useAuth();
  const { balance, setBalance } = useBalance();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuthStatus = async () => {
      const userBalance = await getBalance();
      if (userBalance !== null) {
        setBalance(userBalance);
      }
    };
    checkAuthStatus();
  }, [isSignedIn, balance]);

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Coin" className="logo-image" />
      </div>
      <span className="slogan">Feel the Rush, Win Big</span>
      {isSignedIn ? (
        <>
          <div className="balance-indicator">
            <img src={coin} alt="Coin" className="coin-image" />
            <div className="balance-info">
              <span className="balance-amount">Balance</span>
              <span className="balance-amount">{balance}</span>
            </div>
          </div>
          <div className="account-control">
            <button
              className="button-profile"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button className="button-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <div>
          <button className="button-sign" onClick={() => navigate("/signin")}>
            Sign In
          </button>
          <button className="button-sign" onClick={() => navigate("/signup")}>
            Sign Up
          </button>{" "}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
