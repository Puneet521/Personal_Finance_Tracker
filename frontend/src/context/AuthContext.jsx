import React, { createContext, useContext, useEffect, useState } from "react";

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    // decoded usually contains id, role, iat, exp
    return decoded;
  } catch {
    return null;
  }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount try to read token and set user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.role) {
        setUser({ id: payload.id, role: payload.role, username: payload.username || "" });
      } else {
        // if token not parseable, remove it
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem("token", token);
    // backend returns user info usually — use that if present; else decode token
    if (userInfo) {
      setUser({ id: userInfo.id, role: userInfo.role, username: userInfo.username });
    } else {
      const payload = parseJwt(token);
      setUser({ id: payload.id, role: payload.role, username: payload.username || "" });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


