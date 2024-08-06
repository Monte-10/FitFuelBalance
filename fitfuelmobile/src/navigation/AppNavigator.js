import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import TrainingDetailsScreen from '../screens/TrainingDetailsScreen';
import ActiveTrainingScreen from '../screens/ActiveTrainingScreen';
import RestTimeConfigScreen from '../screens/RestTimeConfigScreen';
import TrainingFeedbackScreen from '../screens/TrainingFeedbackScreen';
import TrainingHistoryScreen from '../screens/TrainingHistoryScreen';
import DailyDietDetailsScreen from '../screens/DailyDietDetailsScreen';
import DishDetailsScreen from '../screens/DishDetailsScreen';
import IngredientDetailsScreen from '../screens/IngredientDetailsScreen';
import FoodDetailsScreen from '../screens/FoodDetailsScreen';
import DetailsScreen from '../screens/DetailsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import OptionSelectionScreen from '../screens/OptionSelectionScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="TrainingDetailsScreen" component={TrainingDetailsScreen} />
      <Stack.Screen name="ActiveTrainingScreen" component={ActiveTrainingScreen} />
      <Stack.Screen name="RestTimeConfigScreen" component={RestTimeConfigScreen} />
      <Stack.Screen name="TrainingFeedbackScreen" component={TrainingFeedbackScreen} />
      <Stack.Screen name="TrainingHistoryScreen" component={TrainingHistoryScreen} />
      <Stack.Screen name="DailyDietDetailsScreen" component={DailyDietDetailsScreen} />
      <Stack.Screen name="DishDetailsScreen" component={DishDetailsScreen} />
      <Stack.Screen name="IngredientDetailsScreen" component={IngredientDetailsScreen} />
      <Stack.Screen name="FoodDetailsScreen" component={FoodDetailsScreen} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      <Stack.Screen name="OptionSelectionScreen" component={OptionSelectionScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
