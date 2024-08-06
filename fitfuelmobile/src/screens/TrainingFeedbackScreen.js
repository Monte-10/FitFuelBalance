import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EffortLevel = ({ onSelect, selectedLevel }) => {
  const levels = [1, 2, 3, 4, 5];

  return (
    <View style={styles.effortContainer}>
      {levels.map((level) => (
        <TouchableOpacity
          key={level}
          style={[styles.effortLevel, selectedLevel === level && styles.selectedEffort]}
          onPress={() => onSelect(level)}
        >
          <Text style={styles.effortText}>{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

function TrainingFeedbackScreen({ navigation, route }) {
  const [effortLevel, setEffortLevel] = useState(null);
  const [notes, setNotes] = useState('');
  const { trainingDetails } = route.params;
  const { name } = trainingDetails['name'];
  const { id } = trainingDetails['id'];

  const handleSubmit = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const feedback = { name, effortLevel, notes, date: new Date().toISOString(), userId, trainingId: id };
    try {
      const savedFeedback = await AsyncStorage.getItem('trainingFeedback');
      const feedbackList = savedFeedback ? JSON.parse(savedFeedback) : [];
      feedbackList.push(feedback);
      await AsyncStorage.setItem('trainingFeedback', JSON.stringify(feedbackList));
      Alert.alert("Feedback Guardado", "Tu feedback ha sido guardado con éxito.");
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Hubo un error al guardar tu feedback.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo fue tu entrenamiento?</Text>
      <EffortLevel onSelect={setEffortLevel} selectedLevel={effortLevel} />
      <TextInput
        style={styles.notesInput}
        multiline
        numberOfLines={4}
        placeholder="Escribe algunas notas sobre tu entrenamiento..."
        value={notes}
        onChangeText={setNotes}
        placeholderTextColor="#888"
      />
      <Button title="Enviar Feedback" onPress={handleSubmit} color="#28a745" />
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
    marginBottom: 20,
    color: '#28a745',
  },
  effortContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  effortLevel: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
  },
  selectedEffort: {
    backgroundColor: '#28a745',
  },
  effortText: {
    fontSize: 18,
    color: '#fff',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#888',
    width: '100%',
    padding: 10,
    marginBottom: 20,
    color: '#fff',
  },
});

export default TrainingFeedbackScreen;
