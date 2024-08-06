import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodayScreen from './TodayScreen';
import CalendarScreen from './CalendarScreen';
import ProfileScreen from './ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Hoy') {
            iconName = 'home'; // Nombre de icono válido y seguro
          } else if (route.name === 'Calendario') {
            iconName = 'calendar'; // Nombre de icono válido y seguro
          } else if (route.name === 'Perfil') {
            iconName = 'person'; // Nombre de icono válido y seguro
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: {
          backgroundColor: '#1e1e1e',
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: '#1e1e1e',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Hoy" component={TodayScreen} />
      <Tab.Screen name="Calendario" component={CalendarScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
