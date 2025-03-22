import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

// Screens
import StudentsScreen from '../screens/StudentsScreen';
import CalendarScreen from '../screens/CalendarScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}>
        <Tab.Screen 
          name="Students" 
          component={StudentsScreen} 
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
