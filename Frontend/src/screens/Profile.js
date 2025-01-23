import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '' });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await api.get('/users/profile');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('userRole');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[styles.container, styles.darkContainer]}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/profile/profilee.png')} // Update to use local image
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.username}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      {/* Scrollable Options Section */}
      <ScrollView style={styles.scrollContainer}>
        {/* Options List */}
        {[
          { label: 'Notifications', icon: '🔔' },
          { label: 'Account Preferences', icon: '⚙️', action: () => navigation.navigate('DetailAccount') },
          { label: 'Security', icon: '🔒', action: () => navigation.navigate('DetailAccount', { changePassword: true }) },
          { label: 'Contact Us', icon: '✉️' },
          { label: 'Sign Out', icon: '🚪', action: handleSignOut },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionRow, styles.darkOptionButton]}
            onPress={item.action}
          >
            <Text style={[styles.optionIcon, styles.darkSubText]}>
              {item.icon}
            </Text>
            <Text style={[styles.optionText, styles.darkText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    marginTop: 50,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black', // Warna biru muda untuk username
  },
  profileEmail: {
    fontSize: 16,
    color: 'black', // Warna abu-abu terang untuk email
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1c1c1e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  darkOptionButton: {
    backgroundColor: '#1c1c1e',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    marginLeft: 10,
  },
  optionIcon: {
    fontSize: 24,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
});

export default Profile;
