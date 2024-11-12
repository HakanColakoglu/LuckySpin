import { Router } from "express";
import { validateTokenAndRole } from "../../middlewares/verifyTokenAndRole";
import {
  getUserBalance,
  getUserBalanceHistory,
  updateUserBalance,
} from "../../controllers/user/userController";
import { flipCoin } from "../../controllers/game/flipCoin";
const router = Router();

// Simple public route
router.get("/", (req, res) => {
  res.send("Main Page!");
});

// User profile can be viewed by a "user" only
router.get(
  "/user/profile",
  validateTokenAndRole(["user"]),
  async (req, res) => {
    try {
      const balance = await getUserBalance(req.user?.id);
      const history = await getUserBalanceHistory(req.user?.id);

      // Respond with user information, balance, and history
      res.json({
        username: req.user?.username,
        balance,
        history,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Route for depositing or withdrawing funds
router.post(
  "/user/credit",
  validateTokenAndRole(["user"]),
  async (req, res) => {
    const { amount, type } = req.body;
    const MAX_BALANCE = 10000; // Should go into a config file
    const creditAmount = parseInt(amount, 10);
    try {
      if (!["deposit", "withdraw"].includes(type) || creditAmount <= 0) {
        return res.status(400).json({ message: "Invalid type or amount" });
      }

      const currentBalance = await getUserBalance(req.user?.id);

      let newBalance = currentBalance;
      if (type === "deposit") {
        newBalance += creditAmount;
        if (newBalance > MAX_BALANCE) {
          return res
            .status(400)
            .json({ message: `Balance cannot exceed ${MAX_BALANCE}` });
        }
      } else if (type === "withdraw") {
        newBalance -= creditAmount;
        if (newBalance < 0) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
      }

      await updateUserBalance(req.user?.id, newBalance, creditAmount, type);

      res
        .status(200)
        .json({ message: "Transaction successful", balance: newBalance });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/play/coinflip",
  validateTokenAndRole(["user"]),
  async (req, res) => {
    const { amount, selection } = req.body;
    const betAmount = parseInt(amount, 10);

    try {
      if (betAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const balance = await getUserBalance(req.user?.id);

      if (balance < betAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const isWin = flipCoin() == selection;
      const newBalance = isWin ? balance + betAmount : balance - betAmount;

      await updateUserBalance(
        req.user?.id,
        newBalance,
        betAmount,
        isWin ? "won" : "lost"
      );

      res.status(200).json({
        message: isWin ? "You won!" : "You lost!",
        newBalance,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
export default router;
