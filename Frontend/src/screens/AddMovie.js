import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@ui-kitten/components';
import AddMovieScreen from './AddMovieScreen';
import DataMovieScreen from './DataMovieScreen';

const Tab = createBottomTabNavigator();

const AddMovie = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Add Movie') {
            iconName = 'plus-circle';
          } else if (route.name === 'Data Movie') {
            iconName = 'edit';
          }

          return <Icon name={iconName} fill={color} style={{ width: size, height: size }} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Add Movie" component={AddMovieScreen} />
      <Tab.Screen name="Data Movie" component={DataMovieScreen} />
    </Tab.Navigator>
  );
};

export default AddMovie;
