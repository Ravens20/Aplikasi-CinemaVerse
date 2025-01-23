import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const baseURL = 'http://192.168.1.9:5000'; // Base URL for API

const History = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken'); // Correct token key
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await axios.get(`${baseURL}/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched tickets:', response.data); // Debug response data
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.ticketCard}>
      <Text style={styles.movieTitle}>{item.movieTitle}</Text>
      <Text style={styles.ticketDetails}>Seats: {item.seats.join(', ')}</Text>
      <Text style={styles.ticketDetails}>Total Price: Rp {item.totalPrice.toLocaleString()}</Text>
      <Text style={styles.ticketDetails}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Purchase History</Text>
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
      />
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={20} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Ticket')}>
          <Icon name="ticket" size={20} color="#fff" />
          <Text style={styles.navText}>Ticket</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('History')}>
          <Icon name="history" size={20} color="#fff" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
    paddingBottom: 70, // Add padding to avoid overlap with navbar
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    alignItems: 'center',
  },
  ticketCard: {
    width: width * 0.9,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  ticketDetails: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#222',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default History;
