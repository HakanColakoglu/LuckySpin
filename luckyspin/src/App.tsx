import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import SigninPage from "./components/pages/SigninPage";
import SignupPage from "./components/pages/SignupPage";
import ProfilePage from "./components/pages/ProfilePage";
import ManageBalancePage from "./components/pages/ManageBalancePage";
import Navbar from "./components/common/Navbar";
import "./App.css";

import { getBalance, logout } from "./services/api";
import { BalanceProvider } from "./context/BalanceProvider";
import GamePage from "./components/pages/GamePage";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isSignedIn, setIsSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const userBalance = await getBalance();
      if (userBalance !== null) {
        setIsSignedIn(true);
      }
    };
    checkAuthStatus();
  }, [isSignedIn]);

  const handleLogout = async () => {
    await logout();
    setIsSignedIn(false);
    navigate("/signin");
  };

  return (
    <div className="app-container">
      <BalanceProvider>
        <Navbar onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/profile"
            element={isSignedIn ? <ProfilePage /> : <SigninPage />}
          />
          <Route
            path="/manage/balance"
            element={isSignedIn ? <ManageBalancePage /> : <SigninPage />}
          />
          <Route path="/game/coin" element={<GamePage />} />
        </Routes>{" "}
      </BalanceProvider>
    </div>
  );
};

export default App;
