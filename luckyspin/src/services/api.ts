const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:31000";

export const signin = async (username: string, password: string) => {
  try {
    const response = await fetch(`${GATEWAY_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false };
  }
};

export const signup = async (username: string, password: string, role:string="user") => {
  try {
    const response = await fetch(`${GATEWAY_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
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
    await fetch(`${GATEWAY_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const validateSession = async () => {
  try {
    const response = await fetch(`${GATEWAY_URL}/auth/validate/session`, {
      method: "GET",
      credentials: "include",
    });
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
    const response = await fetch(`${GATEWAY_URL}/user/credit`, {
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
    const response = await fetch(`${GATEWAY_URL}/user/profile`, {
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
    const response = await fetch(`${GATEWAY_URL}/user/profile`, {
      credentials: "include",
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Get balance history error:", error);
    return [];
  }
};
