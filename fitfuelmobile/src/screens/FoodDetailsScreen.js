import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FoodDetailsScreen = ({ route }) => {
  const { foodId } = route.params;
  const [foodDetails, setFoodDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      setIsLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('AuthToken not found');
        }

        const response = await fetch(`http://10.0.2.2:8000/nutrition/foods/${foodId}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFoodDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching food details:", error);
        setIsLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#28a745" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{foodDetails.name}</Text>
      <View style={styles.nutritionSection}>
        <Text style={styles.nutritionText}>Unidad de peso: {foodDetails.unit_weight}g</Text>
        <Text style={styles.nutritionText}>Calorías: {foodDetails.calories} kcal</Text>
        <Text style={styles.nutritionText}>Proteínas: {foodDetails.protein}g</Text>
        <Text style={styles.nutritionText}>Carbohidratos: {foodDetails.carbohydrates}g</Text>
        <Text style={styles.nutritionText}>Azúcar: {foodDetails.sugar}g</Text>
        <Text style={styles.nutritionText}>Fibra: {foodDetails.fiber}g</Text>
        <Text style={styles.nutritionText}>Grasas: {foodDetails.fat}g</Text>
        <Text style={styles.nutritionText}>Grasas saturadas: {foodDetails.saturated_fat}g</Text>
        <Text style={styles.nutritionText}>Libre de gluten: {foodDetails.gluten_free ? 'Sí' : 'No'}</Text>
        <Text style={styles.nutritionText}>Libre de lactosa: {foodDetails.lactose_free ? 'Sí' : 'No'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 20,
  },
  nutritionSection: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  nutritionText: {
    fontSize: 16,
    color: '#ddd',
    marginVertical: 2,
  },
});

export default FoodDetailsScreen;
