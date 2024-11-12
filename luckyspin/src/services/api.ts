export const signin = async (username: string, password: string) => {
  try {
    const response = await fetch("http://localhost:31000/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    return response.ok ? { success: true } : { success: false };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false };
  }
};

export const signup = async (
  username: string,
  password: string,
) => {
  try {
    const response = await fetch("http://localhost:31000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();

      // Extract password style errors if errors exist in the response
      const errorMessages = data.errors
        ? data.errors.map((error: { msg: string }) => error.msg)
        : [];

      return {
        success: false,
        msg: errorMessages,
      };
    }

    return {
      success: true,
      msg: [],
    };
  } catch (error) {
    console.error("Signin error:", error);
    return {
      success: false,
      msg: ["An unexpected error occurred. Please try again."],
    };
  }
};

export const logout = async () => {
  try {
    await fetch("http://localhost:31000/auth/logout", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const validateSession = async () => {
  try {
    const response = await fetch(
      "http://localhost:31000/auth/validate/session",
      {
        method: "GET",
        credentials: "include",
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
};

export const updateBalance = async (
  amount: number,
  type: "deposit" | "withdraw"
) => {
  try {
    const response = await fetch("http://localhost:31000/user/credit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, type }),
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    console.error("Update balance error:", error);
    return false;
  }
};

export const getBalance = async (): Promise<number | null> => {
  try {
    const response = await fetch("http://localhost:31000/user/profile", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data.balance;
    }
    return null;
  } catch (error) {
    console.error("Get balance error:", error);
    return null;
  }
};

export const getBalanceHistory = async () => {
  try {
    const response = await fetch("http://localhost:31000/user/profile", {
      credentials: "include",
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Get balance history error:", error);
    return [];
  }
};
