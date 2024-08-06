import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OptionSelectionScreen = ({ route, navigation }) => {
  const { selectedOption, date } = route.params;
  const [weekOptionDetails, setWeekOptionDetails] = useState(null);

  useEffect(() => {
    const fetchWeekOptionDetails = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) throw new Error('AuthToken not found');
        
        const optionResponse = await fetch(`http://10.0.2.2:8000/nutrition/options/${selectedOption.option}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!optionResponse.ok) throw new Error('Network response was not ok');
        const optionDetails = await optionResponse.json();
        
        // Assuming week_option_one is selected for this example
        const weekOptionId = optionDetails.week_option_one;
        
        const weekOptionResponse = await fetch(`http://10.0.2.2:8000/nutrition/weekoptions/${weekOptionId}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!weekOptionResponse.ok) throw new Error('Network response was not ok');
        const weekOptionDetails = await weekOptionResponse.json();
        setWeekOptionDetails(weekOptionDetails);
      } catch (error) {
        console.error('Error fetching week option details:', error);
      }
    };

    fetchWeekOptionDetails();
  }, [selectedOption]);

  const handleOptionSelect = async (dayOptionId) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('AuthToken not found');

      const dayOfWeek = new Date(date).toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      const updateData = { [`${dayOfWeek}_option`]: dayOptionId };

      const response = await fetch(`http://10.0.2.2:8000/nutrition/assignedoptions/${selectedOption.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const responseData = await response.json();
        console.error('Response error data:', responseData);
        throw new Error('Network response was not ok');
      }
      Alert.alert('Opción asignada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error assigning option:', error);
      Alert.alert('Error al asignar la opción');
    }
  };

  if (!weekOptionDetails) {
    return <ActivityIndicator size="large" color="#28a745" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una opción para el {date}</Text>
      <Button
        title="Opción 1"
        buttonStyle={styles.button}
        onPress={() => handleOptionSelect(weekOptionDetails.monday_option)}
      />
      <Button
        title="Opción 2"
        buttonStyle={styles.button}
        onPress={() => handleOptionSelect(weekOptionDetails.tuesday_option)}
      />
      <Button
        title="Opción 3"
        buttonStyle={styles.button}
        onPress={() => handleOptionSelect(weekOptionDetails.wednesday_option)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#28a745',
    marginVertical: 10,
    width: 200,
  },
});

export default OptionSelectionScreen;
