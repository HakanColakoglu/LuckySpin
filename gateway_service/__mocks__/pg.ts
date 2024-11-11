const users: any[] = [];
const userBalances: any[] = [
  { user_id: 1, balance: 100 },
  { user_id: 2, balance: 200 },
];
const balanceHistories: any[] = [
  { user_id: 1, date: "2024-11-01", amount: -50, type: "lost" },
  { user_id: 1, date: "2024-11-02", amount: 100, type: "won" },
  { user_id: 2, date: "2024-11-03", amount: 25, type: "deposit" },
];
let isPoolClosed = false;

// Mock pool object
const mockPool = {
  connect: jest.fn().mockImplementation(() => {
    if (isPoolClosed) {
      return Promise.reject(new Error("Pool is closed"));
    }
    return Promise.resolve(mockClient);
  }),
  end: jest.fn().mockImplementation(() => {
    isPoolClosed = true;
    return Promise.resolve();
  }),
  query: jest.fn().mockImplementation((queryText: string, params?: any[]) => {
    if (isPoolClosed) {
      return Promise.reject(new Error("Pool is closed"));
    }

    const trimmedQuery = queryText.trim();

    if (trimmedQuery.includes("INSERT")) {
      if (params?.includes("admin")) {
        users.push({
          id: 1,
          username: "admin",
          password: params[1],
          role: "admin",
        });
      }
      if (params?.includes("user")) {
        users.push({
          id: 2,
          username: "user",
          password: params[1],
          role: "user",
        });
      }
    }

    if (trimmedQuery.includes("SELECT")) {
      if (trimmedQuery.includes("FROM users")) {
        const foundUser = users.find((user) => user.username === params?.[0]);
        return Promise.resolve({ rows: foundUser ? [foundUser] : [] });
      }

      if (trimmedQuery.includes("FROM user_balance")) {
        const foundBalance = userBalances.find((balance) => balance.user_id === params?.[0]);
        return Promise.resolve({ rows: foundBalance ? [foundBalance] : [] });
      }

      if (trimmedQuery.includes("FROM balance_history")) {
        const foundHistory = balanceHistories.filter((history) => history.user_id === params?.[0]);
        return Promise.resolve({ rows: foundHistory });
      }
    }

    return Promise.resolve({ rows: [] }); // Default case for unsupported queries
  }),
};

// Mock client object
const mockClient = {
  query: mockPool.query,
  release: jest.fn().mockImplementation(() => Promise.resolve()),
};

// Mock the Pool constructor function to return the mock pool
const Pool = jest.fn(() => mockPool);

export { Pool };
