import { useEffect, useState } from "react";
import { useBalance } from "../../context/BalanceProvider";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const { balance, setBalance } = useBalance();
  const [betAmount, setBetAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleBet = async (selection: "selectionA" | "selectionB") => {
    try {
      const response = await fetch("http://localhost:31000/play/coinflip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: betAmount,
          selection,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setBalance(result.newBalance);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error playing game:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (!isSignedIn) {
      console.log("not signed in");
      navigate("/signin");
    }
  }, [isSignedIn, navigate]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div>
      <h2>Coin Flip Game</h2>
      <p>Balance: {balance}</p>
      <input
        type="number"
        placeholder="Bet Amount"
        value={betAmount === 0 ? "" : betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
      />
      <div>
        <button onClick={() => handleBet("selectionA")}>Heads</button>
        <button onClick={() => handleBet("selectionB")}>Tails</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GamePage;
