import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_EXPIRED_EVENT } from "../api/client.js";

const AuthContext = createContext(null);

const readStoredUser = () => {
  const rawUser = window.localStorage.getItem("sms_user");
  return rawUser ? JSON.parse(rawUser) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setSessionMessage("Your session expired. Please sign in again.");
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      sessionMessage,
      clearSessionMessage() {
        setSessionMessage("");
      },
      signIn(authResult) {
        window.localStorage.setItem("sms_access_token", authResult.accessToken);
        window.localStorage.setItem("sms_refresh_token", authResult.refreshToken);
        window.localStorage.setItem("sms_user", JSON.stringify(authResult.user));
        setSessionMessage("");
        setUser(authResult.user);
      },
      signOut() {
        window.localStorage.removeItem("sms_access_token");
        window.localStorage.removeItem("sms_refresh_token");
        window.localStorage.removeItem("sms_user");
        setSessionMessage("");
        setUser(null);
      }
    }),
    [sessionMessage, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
