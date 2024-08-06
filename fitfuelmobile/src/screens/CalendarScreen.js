import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});

  const fetchAuthToken = async () => {
    return await AsyncStorage.getItem('authToken');
  };

  // Función para obtener eventos de DailyDiet
  const fetchDietEvents = async () => {
    try {
      const authToken = await fetchAuthToken();
      if (!authToken) throw new Error('AuthToken not found');
      
      const response = await fetch('http://10.0.2.2:8000/nutrition/daily_diets', {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const diets = await response.json();
      return diets.map(diet => ({
        date: diet.date, // Formato 'YYYY-MM-DD'
        type: 'diet'
      }));
    } catch (error) {
      console.error('Error fetching diet events:', error);
      return [];
    }
  };

  // Función para obtener eventos de Training
  const fetchTrainingEvents = async () => {
    try {
      const authToken = await fetchAuthToken();
      if (!authToken) throw new Error('AuthToken not found');
      
      const response = await fetch('http://10.0.2.2:8000/sport/trainings', {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const trainings = await response.json();
      return trainings.map(training => ({
        date: training.date, // Formato 'YYYY-MM-DD'
        type: 'training'
      }));
    } catch (error) {
      console.error('Error fetching training events:', error);
      return [];
    }
  };

  // Función para obtener opciones asignadas
  const fetchAssignedOptions = async () => {
    try {
      const authToken = await fetchAuthToken();
      const userId = await AsyncStorage.getItem('userId');
      if (!authToken) throw new Error('AuthToken not found');
      
      const response = await fetch(`http://10.0.2.2:8000/nutrition/assignedoptions/`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const options = await response.json();
      // Crear una lista de fechas para cada opción asignada que cubra los siete días a partir de la start_date
      const optionEvents = [];
      options.forEach(option => {
        const startDate = new Date(option.start_date);
        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          optionEvents.push({
            date: currentDate.toISOString().split('T')[0], // Formato 'YYYY-MM-DD'
            type: 'option',
            id: option.id
          });
        }
      });
      return optionEvents;
    } catch (error) {
      console.error('Error fetching assigned options:', error);
      return [];
    }
  };

  const handleDayPress = async (day) => {
    console.log('selected day', day.dateString);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!authToken) {
        console.error('AuthToken not found');
        return;
      }
      
      const dietResponse = await fetch(`http://10.0.2.2:8000/nutrition/dailydiets/date/${day.dateString}?user=${userId}`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      const trainingResponse = await fetch(`http://10.0.2.2:8000/sport/trainings/date/${day.dateString}?user=${userId}`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      const optionResponse = await fetch(`http://10.0.2.2:8000/nutrition/assignedoptions/`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      if (!dietResponse.ok || !trainingResponse.ok || !optionResponse.ok) {
        throw new Error('Error fetching data');
      }
  
      const dietData = await dietResponse.json();
      const trainingData = await trainingResponse.json();
      const optionData = await optionResponse.json();

      navigation.navigate('DetailsScreen', {
        date: day.dateString,
        dietEvents: dietData.length > 0 ? dietData : null,
        trainingEvents: trainingData.length > 0 ? trainingData : null,
        optionEvents: optionData.length > 0 ? optionData : null,
      });
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  useEffect(() => {
    const markEvents = async () => {
      const dietEvents = await fetchDietEvents();
      const trainingEvents = await fetchTrainingEvents();
      const assignedOptions = await fetchAssignedOptions();
      const allEvents = [...dietEvents, ...trainingEvents, ...assignedOptions];
      
      const markedDates = allEvents.reduce((acc, current) => {
        const dotColor = current.type === 'diet' ? 'blue' : (current.type === 'training' ? 'red' : 'green');
        if (!acc[current.date]) {
          acc[current.date] = { marked: true, dots: [{ color: dotColor }] };
        } else {
          acc[current.date].dots.push({ color: dotColor });
        }
        return acc;
      }, {});

      setMarkedDates(markedDates);
    };

    markEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'multi-dot'}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: '#1e1e1e',
          calendarBackground: '#1e1e1e',
          textSectionTitleColor: '#b6c1cd',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: '#2b2b2b',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#28a745',
          dayTextColor: '#ffffff',
          textDisabledColor: '#2d4150',
          dotColor: '#28a745',
          selectedDotColor: '#ffffff',
          arrowColor: '#ffffff',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: '#ffffff',
          indicatorColor: '#ffffff',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'blue' }]}></View>
          <Text style={styles.legendText}>Dieta</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'red' }]}></View>
          <Text style={styles.legendText}>Entrenamiento</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'green' }]}></View>
          <Text style={styles.legendText}>Opción Asignada</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1e1e1e', // Fondo oscuro
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#f0f0f0', // Texto claro
  },
});

export default CalendarScreen;
