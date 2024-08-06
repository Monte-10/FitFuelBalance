import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const TodayScreen = () => {
  const navigation = useNavigation();
  const [trainings, setTrainings] = useState([]);
  const [dailyDiet, setDailyDiet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const userId = await AsyncStorage.getItem('userId');
        const today = new Date().toISOString().split('T')[0];

        if (!authToken || !userId) {
          throw new Error('Authentication token or user ID is missing');
        }

        const trainingResponse = await fetch(`http://10.0.2.2:8000/sport/trainings/today?date=${today}&user=${userId}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });
        const trainingData = await trainingResponse.json();

        if (trainingResponse.ok) {
          setTrainings(trainingData);
        } else {
          console.log("Training detail error:", trainingData.detail);
          setTrainings([]);
        }

        const dietResponse = await fetch(`http://10.0.2.2:8000/nutrition/dailydiets/today?date=${today}&user=${userId}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });
        const dietData = await dietResponse.json();

        if (dietResponse.ok) {
          setDailyDiet(dietData);
        } else {
          console.log("DailyDiet detail error:", dietData.detail);
          setDailyDiet(null);
        }
      } catch (error) {
        console.error("Fetch data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#28a745" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Entrenamientos de Hoy</Text>
      {trainings.length > 0 ? (
        trainings.map((training, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>{training.name}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('TrainingDetailsScreen', { trainingId: training.id })}
            >
              <Text style={styles.buttonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No hay entrenamientos asignados para hoy.</Text>
      )}
      <Text style={styles.title}>Dieta de Hoy</Text>
      {dailyDiet ? (
        <View style={styles.item}>
          <Text style={styles.itemText}>Haz click para ver tus comidas para hoy</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (dailyDiet && dailyDiet.length > 0) {
                const dietId = dailyDiet[0].id;
                navigation.navigate('DailyDietDetailsScreen', { dailyDietId: dietId });
              } else {
                console.log('No hay dieta diaria disponible.');
              }
            }}
          >
            <Text style={styles.buttonText}>Ver Comidas del Día</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noDataText}>No hay dieta asignada para hoy.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e', // Fondo oscuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745', // Verde
    marginBottom: 10,
  },
  item: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2b2b2b', // Fondo oscuro para el ítem
    borderRadius: 10,
  },
  itemText: {
    fontSize: 18,
    color: '#f0f0f0', // Texto claro
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28a745', // Fondo verde para el botón
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: '#f0f0f0', // Texto claro
    marginBottom: 10,
  },
});

export default TodayScreen;
