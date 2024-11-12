import { useState } from "react";
import { updateBalance } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ManageBalancePage = () => {
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    const success = await updateBalance(amount, type);
    if (success) navigate("/profile");
  };

  return (
    <div className="manage-balance-page">
      <h2>Manage Balance</h2>
      <input
        type="number"
        value={amount === 0 ? "" : amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={() => handleTransaction("deposit")}>Deposit</button>
      <button onClick={() => handleTransaction("withdraw")}>Withdraw</button>
    </div>
  );
};

export default ManageBalancePage;
