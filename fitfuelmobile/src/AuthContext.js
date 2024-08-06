import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('authToken');
      } catch (e) {
        console.error("Error al leer el token del almacenamiento:", e);
      }
      if (userToken) {
        setToken(userToken);
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = async (userToken) => {
    try {
      await AsyncStorage.setItem('authToken', userToken);
      setToken(userToken);
    } catch (e) {
      console.error("Error al guardar el token:", e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken(null);
    } catch (e) {
      console.error("Error al eliminar el token:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
