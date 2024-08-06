import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DishDetailsScreen = ({ route, navigation }) => {
  const { dishId } = route.params;
  const [dishDetails, setDishDetails] = useState(null);
  const [ingredientsDetails, setIngredientsDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDishDetails = async () => {
      setIsLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('AuthToken not found');
        }

        const response = await fetch(`http://10.0.2.2:8000/nutrition/dishes/${dishId}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDishDetails(data);
        const ingredientIds = data.ingredients_details.map(item => item.ingredient);
        fetchIngredientsDetails(ingredientIds);
      } catch (error) {
        console.error("Error fetching dish details:", error);
        setIsLoading(false);
      }
    };

    fetchDishDetails();
  }, [dishId]);

  const fetchIngredientsDetails = async (ingredientIds) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('AuthToken not found');
      }

      const ingredientsPromises = ingredientIds.map(id => 
        fetch(`http://10.0.2.2:8000/nutrition/ingredients/${id}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        }).then(res => res.json())
      );

      const ingredientsData = await Promise.all(ingredientsPromises);
      setIngredientsDetails(ingredientsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching ingredients details:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Text style={styles.loadingText}>Cargando detalles del plato e ingredientes...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Plato: {dishDetails.name}</Text>
        {ingredientsDetails.map((ingredient, index) => (
          <View key={index} style={styles.ingredientSection}>
            <Text style={styles.ingredientText}>Ingrediente: {ingredient.name} - Cantidad: {dishDetails.ingredients_details.find(i => i.ingredient === ingredient.id)?.quantity}</Text>
            <Button
              title="Ver detalles del ingrediente"
              buttonStyle={styles.button}
              onPress={() => navigation.navigate('IngredientDetailsScreen', { ingredientId: ingredient.id })}
            />
          </View>
        ))}
        {/* Información nutricional del plato */}
        <View style={styles.nutritionSection}>
          <Text style={styles.nutritionTitle}>Información Nutricional:</Text>
          <Text style={styles.nutritionText}>Calorías: {dishDetails.calories}</Text>
          <Text style={styles.nutritionText}>Proteínas: {dishDetails.protein}g</Text>
          <Text style={styles.nutritionText}>Carbohidratos: {dishDetails.carbohydrates}g</Text>
          <Text style={styles.nutritionText}>Grasas: {dishDetails.fat}g</Text>
          <Text style={styles.nutritionText}>Fibras: {dishDetails.fiber}g</Text>
          <Text style={styles.nutritionText}>Azúcares: {dishDetails.sugar}g</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  loadingText: {
    fontSize: 18,
    color: '#ddd',
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 20,
  },
  ingredientSection: {
    marginBottom: 15,
  },
  ingredientText: {
    fontSize: 16,
    color: '#ddd',
  },
  button: {
    backgroundColor: '#28a745',
    marginTop: 10,
  },
  nutritionSection: {
    marginTop: 20,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  nutritionText: {
    fontSize: 16,
    color: '#ddd',
    marginVertical: 2,
  },
});

export default DishDetailsScreen;
