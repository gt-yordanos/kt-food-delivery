import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decode the token and extract user information
        const decodedToken = jwt_decode(token);
        const role = decodedToken.role;
        setUser({ token, role });
      } catch (err) {
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    const decodedToken = jwt_decode(token);
    const role = decodedToken.role;
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);