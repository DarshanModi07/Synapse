import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get("/users/profile");

      setProfile(response.data.data);
    } catch (error) {
      setProfile(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        loading,
        checkAuth,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);