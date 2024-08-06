import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IngredientDetailsScreen = ({ route, navigation }) => {
  const { ingredientId } = route.params;
  const [ingredientDetails, setIngredientDetails] = useState(null);
  const [foodDetails, setFoodDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIngredientDetails = async () => {
      setIsLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('AuthToken not found');
        }

        const ingredientResponse = await fetch(`http://10.0.2.2:8000/nutrition/ingredients/${ingredientId}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!ingredientResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const ingredientData = await ingredientResponse.json();
        setIngredientDetails(ingredientData);

        const foodResponse = await fetch(`http://10.0.2.2:8000/nutrition/foods/${ingredientData.food}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!foodResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const foodData = await foodResponse.json();
        setFoodDetails(foodData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching ingredient or food details:", error);
        setIsLoading(false);
      }
    };

    fetchIngredientDetails();
  }, [ingredientId]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#28a745" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ingredientDetails.name}</Text>
      {/* Información del ingrediente */}
      <View style={styles.nutritionSection}>
        <Text style={styles.nutritionText}>Calorías: {ingredientDetails.calories} kcal</Text>
        <Text style={styles.nutritionText}>Proteínas: {ingredientDetails.protein} g</Text>
        <Text style={styles.nutritionText}>Carbohidratos: {ingredientDetails.carbohydrates} g</Text>
        <Text style={styles.nutritionText}>Azúcares: {ingredientDetails.sugar} g</Text>
        <Text style={styles.nutritionText}>Fibra: {ingredientDetails.fiber} g</Text>
        <Text style={styles.nutritionText}>Grasas: {ingredientDetails.fat} g</Text>
        <Text style={styles.nutritionText}>Grasas saturadas: {ingredientDetails.saturated_fat} g</Text>
      </View>
      
      {/* Información resumida de la Food asociada */}
      {foodDetails && (
        <View style={styles.foodSection}>
          <Text style={styles.subtitle}>Detalles de la Food:</Text>
          <Text style={styles.foodText}>Nombre: {foodDetails.name}</Text>
          <Button
            buttonStyle={styles.button}
            title="Ver detalles de la Food"
            onPress={() => navigation.navigate('FoodDetailsScreen', { foodId: foodDetails.id })}
          />
        </View>
      )}
    </View>
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
  foodSection: {
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  foodText: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#28a745',
  },
});

export default IngredientDetailsScreen;
