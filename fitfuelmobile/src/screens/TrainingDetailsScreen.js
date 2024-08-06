import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { fetchTrainingDetails } from '../api/trainingApi';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TrainingDetailsScreen({ route }) {
  const { trainingId } = route.params;
  const [trainingDetails, setTrainingDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadTrainingDetails = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('AuthToken not found');
        }

        const details = await fetchTrainingDetails(trainingId, authToken);
        console.log('Detalles del training:', details);
        setTrainingDetails(details);
      } catch (error) {
        console.error('Error loading training details:', error);
      }
    };

    loadTrainingDetails();
  }, [trainingId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trainingDetails?.name}</Text>
      <FlatList
        data={trainingDetails?.exercises_details}
        keyExtractor={(item) => item.exercise.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseTitle}>{item.exercise.name}</Text>
            {item.exercise.image && (
              <Image source={{ uri: item.exercise.image }} style={styles.image} />
            )}
            <Text style={styles.text}>Descripción: {item.exercise.description}</Text>
            <Text style={styles.text}>Tipo: {item.exercise.type}</Text>
            <Text style={styles.text}>Repeticiones: {item.repetitions}</Text>
            <Text style={styles.text}>Series: {item.sets}</Text>
            {item.weight ? <Text style={styles.text}>Peso: {item.weight}</Text> : null}
            {item.time ? <Text style={styles.text}>Tiempo: {item.time}</Text> : null}
          </View>
        )}
      />
      <Button
        title="Empezar Entrenamiento"
        buttonStyle={styles.button}
        onPress={() => navigation.navigate('RestTimeConfigScreen', { trainingDetails })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#28a745',
  },
  exerciseContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#28a745',
    marginVertical: 10,
  },
});

export default TrainingDetailsScreen;
