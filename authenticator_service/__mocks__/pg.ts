const users: any[] = [];
let isPoolClosed = false; // Track if the pool is closed, otherwise tests are having problems.

// Mock pool object
const mockPool = {
  connect: jest.fn().mockImplementation(() => {
    if (isPoolClosed) {
      return Promise.reject(new Error("Pool is closed"));
    }
    return Promise.resolve(mockClient); // Return mock client on connect
  }),
  end: jest.fn().mockImplementation(() => {
    isPoolClosed = true;
    return Promise.resolve();
  }),
  query: jest.fn().mockImplementation((queryText: string, params?: any[]) => {
    if (isPoolClosed) {
      return Promise.reject(new Error("Pool is closed")); // Simulate error when querying after pool is closed
    }

    const trimmedQuery = queryText.trim();

    if (trimmedQuery.includes("INSERT")) {
      if (params?.find((param) => param === "admin")) {
        users.push({
          id: 1,
          username: "admin",
          password: params[1],
          role: "admin",
        });
      }
      if (params?.find((param) => param === "user")) {
        users.push({
          id: 2,
          username: "user",
          password: params[1],
          role: "user",
        });
      }
    }

    if (trimmedQuery.includes("SELECT")) {
      if (params?.find((param) => param === "admin")) {
        let foundUser = users.find((user) => {
          return user.username === "admin";
        });
        if (foundUser) {
          return Promise.resolve({ rows: [foundUser] });
        }
      }
      if (params?.find((param) => param === "user")) {
        let foundUser = users.find((user) => {
          return user.username === "user";
        });
        if (foundUser) {
          return Promise.resolve({ rows: [foundUser] });
        }
      }
      if (params?.find((param) => param === 1)) {
        let foundUser = users.find((user) => {
          return user.id === 1;
        });
        if (foundUser) {
          return Promise.resolve({ rows: [foundUser] });
        }
      }
      if (params?.find((param) => param === 2)) {
        let foundUser = users.find((user) => {
          return user.id === 2;
        });
        if (foundUser) {
          return Promise.resolve({ rows: [foundUser] });
        }
      }
    }
    return Promise.resolve({ rows: [] }); // Default case for unsupported queries
  }),
};

// Mock client object
const mockClient = {
  query: mockPool.query,
  release: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
};

// Mock the Pool constructor function to return the mock pool
const Pool = jest.fn(() => mockPool);

export { Pool };
