import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "@/api/axios";
import { logout } from "@/services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get(
        "/users/profile"
      );

      setProfile(response.data.data);
    } catch (err) {
      setProfile(null);
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("accessToken");

    setProfile(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        checkAuth,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};