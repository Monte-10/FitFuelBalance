import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../AuthContext';

const AuthLoadingScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        await signIn(storedToken);
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#28a745" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e', // Fondo oscuro
  },
});

export default AuthLoadingScreen;
