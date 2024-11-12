import { useState, useEffect } from "react";
import { getBalanceHistory } from "../../services/api";
import { useBalance } from "../../context/BalanceProvider";
import HistoryItem from "../common/HistoryItem";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";

type HistoryEntry = {
  date: string;
  amount: number;
  type: string;
};

type BalanceHistory = {
  username: string;
  balance: number;
  history: HistoryEntry[];
};

const ProfilePage = () => {
  const [history, setHistory] = useState<BalanceHistory | undefined>(undefined);
  const { setBalance } = useBalance();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getBalanceHistory();
      setHistory(data);
      if (data?.balance !== undefined) setBalance(data.balance);
    };
    fetchHistory();
  }, []);

  const manageBalance = () => {
    navigate("/manage/balance");
  };

  return (
    <div>
      <h2>Balance History</h2>
      <button onClick={manageBalance}>Deposit/Withdraw</button>
      <ul>
        {history?.history.map((item, index) => (
          <HistoryItem
            key={index}
            date={item.date}
            amount={item.amount}
            type={item.type}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
