import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfileScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken'); // Eliminar el token de AsyncStorage
    navigation.navigate('LoginScreen'); // Redirigir al usuario a la pantalla de Login
  };

  // Función para manejar la navegación al historial de entrenamientos
  const handleNavigateToTrainingHistory = () => {
    navigation.navigate('TrainingHistoryScreen'); // Asegúrate de que este nombre coincida con cómo lo has definido en tu stack de navegación
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Perfil</Text>
      <Button
        title="Historial de Entrenamientos"
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
        onPress={handleNavigateToTrainingHistory}
      />
      <Button
        title="Cerrar Sesión"
        buttonStyle={[styles.button, styles.logoutButton]}
        titleStyle={styles.buttonTitle}
        onPress={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1e1e1e', // Fondo oscuro
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#f0f0f0', // Texto claro
  },
  button: {
    width: 200,
    marginVertical: 10, // Añade un poco de espacio vertical entre los botones
    backgroundColor: '#28a745', // Color de fondo verde
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Color de fondo rojo para el botón de cerrar sesión
  },
  buttonTitle: {
    color: '#f0f0f0', // Texto claro para los botones
  },
});

export default ProfileScreen;
