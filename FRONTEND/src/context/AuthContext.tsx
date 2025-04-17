import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, logout } from "../services/awsCognitoConfig";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuth: boolean;
  setIsAuth: (auth: boolean) => void;
  pendingEmail: string;
  setPendingEmail: (email: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
  }, []);

  const logoutUser = async () => {
    await logout();
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuth, setIsAuth, pendingEmail, setPendingEmail, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
