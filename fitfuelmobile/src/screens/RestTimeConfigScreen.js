import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';

function RestTimeConfigScreen({ route, navigation }) {
  const { trainingDetails } = route.params;
  const [restTimeBetweenSets, setRestTimeBetweenSets] = useState('60');
  const [restTimeBetweenExercises, setRestTimeBetweenExercises] = useState('90');

  const handleStartTraining = () => {
    navigation.navigate('ActiveTrainingScreen', {
      trainingDetails,
      restTimeBetweenSets: parseInt(restTimeBetweenSets, 10),
      restTimeBetweenExercises: parseInt(restTimeBetweenExercises, 10)
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configura tu tiempo de descanso</Text>
      <TextInput
        style={styles.input}
        onChangeText={setRestTimeBetweenSets}
        value={restTimeBetweenSets}
        keyboardType="numeric"
        placeholder="Tiempo de descanso entre series (segundos)"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        onChangeText={setRestTimeBetweenExercises}
        value={restTimeBetweenExercises}
        keyboardType="numeric"
        placeholder="Tiempo de descanso entre ejercicios (segundos)"
        placeholderTextColor="#888"
      />
      <Button
        title="Empezar Entrenamiento"
        buttonStyle={styles.button}
        onPress={handleStartTraining}
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
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#28a745',
    padding: 10,
    width: '100%',
    color: '#fff',
  },
  button: {
    backgroundColor: '#28a745',
    marginVertical: 10,
    width: 200,
  },
});

export default RestTimeConfigScreen;
