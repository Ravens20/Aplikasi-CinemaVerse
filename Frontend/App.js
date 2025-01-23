import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons'; // Tambahkan Icon Pack
import Toast from 'react-native-toast-message'; // Untuk notifikasi toast
import Welcome from './src/screens/Welcome';
import Start from './src/screens/Start';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import History from './src/screens/History';
import Profile from './src/screens/Profile';
import Seat from './src/screens/Seat';
import Payment from './src/screens/Payment';
import Synopsis from './src/screens/Synopsis';
import AddMovie from './src/screens/AddMovie';
import LoginAdmin from './src/screens/LoginAdmin';
import UpdateMovieScreen from './src/screens/UpdateMovieScreen';
import Ticket from './src/screens/Ticket'; // Import Ticket screen
import DetailAccount from './src/screens/DetailAccount'; // Import DetailAccount screen

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Login'); // Default ke Login

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        if (role === 'admin') {
          setInitialRoute('AddMovie'); // Admin diarahkan ke AddMovie
        } else if (role) {
          setInitialRoute('Home'); // User diarahkan ke Home
        } else {
          setInitialRoute('Login'); // Jika tidak ada role, ke Login
        }
      } catch (error) {
        console.error('Error retrieving user role:', error);
      }
    };
    checkUserRole();
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Seat" component={Seat} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="Synopsis" component={Synopsis} />
            <Stack.Screen name="AddMovie" component={AddMovie} />
            <Stack.Screen name="LoginAdmin" component={LoginAdmin} />
            <Stack.Screen name="UpdateMovie" component={UpdateMovieScreen} />
            <Stack.Screen name="Ticket" component={Ticket} />
            <Stack.Screen name="DetailAccount" component={DetailAccount} />
          </Stack.Navigator>
          <Toast position="top" visibilityTime={3000} />
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
    overflow: 'hidden',
  },
});

export default App;
