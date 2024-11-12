import React, { createContext, useContext, useState, ReactNode } from 'react';

type BalanceContextType = {
  balance: number | undefined;
  setBalance: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number | undefined>(undefined);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};