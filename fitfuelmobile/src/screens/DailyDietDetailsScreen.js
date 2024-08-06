import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailyDietDetailsScreen = ({ route, navigation }) => {
  const { dailyDietId } = route.params;
  const [dailyDietDetails, setDailyDietDetails] = useState(null);
  const [mealsDetails, setMealsDetails] = useState([]);
  const [dishDetails, setDishDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDailyDietDetails = async () => {
      setIsLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('AuthToken not found');
        }

        const response = await fetch(`http://10.0.2.2:8000/nutrition/daily_diets/${dailyDietId}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDailyDietDetails(data);
        fetchMealsDetails(data.meals);
      } catch (error) {
        console.error("Error fetching DailyDiet details:", error);
        setIsLoading(false);
      }
    };

    fetchDailyDietDetails();
  }, [dailyDietId]);

  const fetchMealsDetails = async (mealsIds) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('AuthToken not found');
      }

      const mealsPromises = mealsIds.map(id => 
        fetch(`http://10.0.2.2:8000/nutrition/meals/${id}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        }).then(res => res.json())
      );

      const mealsData = await Promise.all(mealsPromises);
      setMealsDetails(mealsData);
      const allDishIds = mealsData.flatMap(meal => meal.dishes);
      fetchDishDetails(allDishIds);
    } catch (error) {
      console.error("Error fetching meals details:", error);
    }
  };

  const fetchDishDetails = async (dishIds) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('AuthToken not found');
      }

      const dishPromises = dishIds.map(id =>
        fetch(`http://10.0.2.2:8000/nutrition/dishes/${id}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        }).then(res => res.json())
      );

      const dishData = await Promise.all(dishPromises);
      setDishDetails(dishData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dish details:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Cargando detalles de la dieta y comidas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {mealsDetails.map((meal, index) => (
        <View key={index} style={styles.mealContainer}>
          <Text style={styles.mealTitle}>Comida: {meal.name}</Text>
          {meal.dishes && meal.dishes.map((dishId, dishIndex) => {
            const dishObject = dishDetails.find(dish => dish.id === dishId);
            return dishObject ? (
              <View key={dishIndex} style={styles.dishContainer}>
                <Text style={styles.dishTitle}>Plato: {dishObject.name}</Text>
                <Button
                  title="Ver detalles del plato"
                  buttonStyle={styles.button}
                  onPress={() => navigation.navigate('DishDetailsScreen', { dishId: dishObject.id })}
                />
              </View>
            ) : null;
          })}
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionTitle}>Información Nutricional:</Text>
            <Text style={styles.nutritionText}>Calorías: {meal.calories}</Text>
            <Text style={styles.nutritionText}>Proteínas: {meal.protein}g</Text>
            <Text style={styles.nutritionText}>Carbohidratos: {meal.carbohydrates}g</Text>
            <Text style={styles.nutritionText}>Azúcares: {meal.sugar}g</Text>
            <Text style={styles.nutritionText}>Fibra: {meal.fiber}g</Text>
            <Text style={styles.nutritionText}>Grasas: {meal.fat}g</Text>
            <Text style={styles.nutritionText}>Grasas saturadas: {meal.saturated_fat}g</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 10,
  },
  mealContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  dishContainer: {
    marginBottom: 10,
  },
  dishTitle: {
    fontSize: 18,
    color: '#fff',
  },
  button: {
    backgroundColor: '#28a745',
    borderRadius: 8,
  },
  nutritionContainer: {
    marginTop: 10,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  nutritionText: {
    color: '#ddd',
  },
});

export default DailyDietDetailsScreen;
