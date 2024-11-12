type HistoryItemProps = {
  date: string;
  amount: number;
  type: string;
};

const HistoryItem = ({ date, amount, type }: HistoryItemProps) => {
  return (
    <li className={`history-item ${type}`}>
      <strong>Date:</strong> {new Date(date).toLocaleString()}
      <br />
      <strong>Amount:</strong> {amount}
      <br />
      <strong>Type:</strong> {type}
    </li>
  );
};

export default HistoryItem;
