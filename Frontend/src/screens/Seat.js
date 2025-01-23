import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const { width, height } = Dimensions.get('window');

const App = ({ route }) => {
  const { movieTitle } = route.params; // Remove movieId
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userId, setUserId] = useState(null); // State for userId
  const seatPrice = 50000;

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const rows = [
    { id: 'A', seats: ['A1', 'A2', 'A3', 'A4', 'A5'] },
    { id: 'B', seats: ['B1', 'B2', 'B3', 'B4', 'B5'] },
    { id: 'C', seats: ['C1', 'C2', 'C3', 'C4', 'C5'] },
    { id: 'D', seats: ['D1', 'D2', 'D3', 'D4', 'D5'] },
    { id: 'E', seats: ['E1', 'E2', 'E3', 'E4', 'E5'] },
    { id: 'F', seats: ['F1', 'F2', 'F3', 'F4', 'F5'] },
  ];

  const rows1 = [
    { id: 'A', seats: ['A6', 'A7', 'A8', 'A9', 'A10'] },
    { id: 'B', seats: ['B6', 'B7', 'B8', 'B9', 'B10'] },
    { id: 'C', seats: ['C6', 'C7', 'C8', 'C9', 'C10'] },
    { id: 'D', seats: ['D6', 'D7', 'D8', 'D9', 'D10'] },
    { id: 'E', seats: ['E6', 'E7', 'E8', 'E9', 'E10'] },
    { id: 'F', seats: ['F6', 'F7', 'F8', 'F9', 'F10'] },
  ];

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const handleBuyTicket = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No seats selected', 'Please select at least one seat.');
    } else {
      const totalPrice = selectedSeats.length * seatPrice;
      navigation.navigate('Payment', { selectedSeats, totalPrice, movieTitle }); // Pass movieTitle to Payment screen
    }
  };

  const totalPrice = selectedSeats.length * seatPrice;

  return (
    <View style={styles.container}>
      <Text style={styles.movieTitle}>{movieTitle}</Text>
      <View style={styles.categoryContainer}>
        <View style={styles.categoryBox}>
          <Text style={styles.categoryText}>A1</Text>
        </View>
        <Text style={styles.smallText}>Masih Tersedia</Text>
        <>
        <View style={styles.categoryBox1}>
          <Text style={styles.categoryText}>A1</Text>
        </View>
        <Text style={styles.smallText}>Sudah Terisi</Text>
        </>
        <View style={styles.categoryBox2}>
          <Text style={styles.categoryText}>A1</Text>
        </View>
        <Text style={styles.smallText}>Pilihanmu</Text>
      </View>

      <Image source={require('../../assets/lengkungbaru.png')}  style={styles.image} />

      <Text style={styles.screenText}>Screen</Text>

      <ScrollView horizontal contentContainerStyle={styles.horizontalScrollContainer} showsHorizontalScrollIndicator={false}>
        <View style={styles.seatsWrapper}>
          {/* Vertical scroll for rows of seats */}
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {rows.map((row) => (
              <View key={row.id} style={styles.row}>
                <View style={styles.sideColumn} />
                {row.seats.map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={
                      selectedSeats.includes(seat)
                        ? [styles.seat, styles.selectedSeat]
                        : styles.seat
                    }
                    onPress={() => toggleSeat(seat)}
                  >
                    <Text style={styles.seatText}>{seat}</Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.middleColumn} />
                {rows1.find((r) => r.id === row.id)?.seats.map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={
                      selectedSeats.includes(seat)
                        ? [styles.seat, styles.selectedSeat]
                        : styles.seat
                    }
                    onPress={() => toggleSeat(seat)}
                  >
                    <Text style={styles.seatText}>{seat}</Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.sideColumn} />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.divider} />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Seats: {selectedSeats.join(', ') || 'None'}
        </Text>
        <Text style={styles.summaryText}>
          Total: Rp {totalPrice.toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity style={styles.buyButton} onPress={handleBuyTicket}>
        <Text style={styles.buyButtonText}>Buy Ticket</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoryContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.7,
    marginTop: 20,
    alignItems: 'center',
  },
  categoryBox: {
    flex: 1,
    margin: 5,
    paddingVertical: 7,
    backgroundColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBox1: {
    flex: 1,
    margin: 5,
    paddingVertical: 7,
    backgroundColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBox2: {
    flex: 1,
    margin: 5,
    paddingVertical: 7,
    backgroundColor: 'pink',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  smallText: {
    fontSize: 8,
    color: '#777',
    alignSelf: 'flex-start',
    paddingTop: 15,
    marginRight: 7,
    marginLeft: -2,
  },
  image: {
    width: width * 1,
    height: height * 0.2,
    marginBottom: 0,
    paddingTop: 10,
  },
  screenText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -height * 0.12,
    marginBottom: height * 0.1,
    color: '#333',
  },
  horizontalScrollContainer: {
    flexDirection: 'row',
  },
  seatsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  seat: {
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 4,
  },
  selectedSeat: {
    backgroundColor: '#1e3343',
  },
  seatText: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
    color: '#fff',
  },
  sideColumn: {
    width: width * 0.08,
    height: 30,
    marginHorizontal: width * 0.02,
  },
  middleColumn: {
    width: width * 0.1,
    height: 30,
    marginHorizontal: width * 0.02,
  },
  buyButton: {
    backgroundColor: '#000',
    paddingVertical: height * 0.02,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default App;
