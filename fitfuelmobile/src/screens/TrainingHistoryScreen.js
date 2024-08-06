import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrainingHistoryScreen = ({ navigation }) => {
  const [trainingHistory, setTrainingHistory] = useState([]);

  useEffect(() => {
    const fetchTrainingHistory = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          throw new Error('UserId not found');
        }

        const savedFeedback = await AsyncStorage.getItem('trainingFeedback');
        const feedbackList = savedFeedback ? JSON.parse(savedFeedback) : [];
        const userFeedbackList = feedbackList.filter(feedback => feedback.userId === userId);

        setTrainingHistory(userFeedbackList);
      } catch (error) {
        Alert.alert("Error", "No se pudo recuperar el historial de entrenamientos.");
        console.error("Error fetching training history:", error);
      }
    };

    fetchTrainingHistory();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={trainingHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => {
            if (item.trainingId) {
              navigation.navigate('TrainingDetailsScreen', { trainingId: item.trainingId });
            } else {
              Alert.alert("Error", "El ID del entrenamiento no está disponible.");
            }
          }}>
            <Text style={styles.title}>Id: {item.trainingId}</Text>
            <Text style={styles.subtitle}>Fecha: {item.date}</Text>
            <Text style={styles.text}>Entrenamiento: {item.name}</Text>
            <Text style={styles.text}>Esfuerzo: {item.effortLevel}</Text>
            <Text style={styles.text}>Notas: {item.notes}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: '#333',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
});

export default TrainingHistoryScreen;
