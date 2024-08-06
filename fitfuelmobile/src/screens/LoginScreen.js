import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        navigation.navigate('HomeScreen'); // Si existe un token, navegar directamente a HomeScreen
      } else {
        setIsLoading(false); // Si no hay token, mostrar la pantalla de inicio de sesión
      }
    };

    checkToken();
  }, [navigation]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/user/frontlogin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Falló el inicio de sesión');
      }

      const data = await response.json();
      if (data.token && data.userId !== undefined) { // Verifica que ambos, token y userId, existen
        await AsyncStorage.setItem('authToken', data.token); // Guardar el token
        await AsyncStorage.setItem('userId', data.userId.toString()); // Guardar el ID del usuario como string
        navigation.navigate('HomeScreen'); // Navegar a HomeScreen
      } else {
        throw new Error('La respuesta del servidor no contiene el token o el userId');
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#28a745" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1e1e1e', // Fondo oscuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745', // Verde
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4d4d', // Rojo para errores
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;
