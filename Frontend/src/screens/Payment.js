import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Payment = ({ route }) => {
  const navigation = useNavigation();
  const { selectedSeats, totalPrice: initialTotalPrice, movieTitle } = route.params; // Add movieTitle

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard');
  const [promoCode, setPromoCode] = useState('');
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
  const [userId, setUserId] = useState(null); // State for userId

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const scale = new Animated.Value(1);

  const handleApplyPromoCode = () => {
    if (promoCode === 'CINEMAVERSE') {
      setTotalPrice(initialTotalPrice * 0.9);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);

    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleConfirmPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve token
      const response = await axios.post('http://192.168.1.9:5000/tickets/confirm', { // Update URL
        userId, // Include userId in the request
        selectedSeats,
        totalPrice,
        paymentMethod: selectedPaymentMethod,
        movieTitle, // Include movieTitle in the request
      }, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      });
      if (response.status === 201) {
        Alert.alert('Success', 'Payment confirmed!');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      Alert.alert('Error', 'There was an error processing your payment.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose Your Payment Method</Text>

      <View style={styles.paymentMethods}>
        {/* Credit Card Option */}
        <TouchableOpacity
          style={[styles.paymentOption, selectedPaymentMethod === 'creditCard' && styles.selectedOption]}
          onPress={() => handlePaymentMethodSelect('creditCard')}
        >
          <View style={styles.cardContainer}>
            <Image
              source={require('../../assets/mastercard.png')} // Mastercard logo inside the card
              style={styles.cardImage}
            />
          </View>
          <Text style={styles.paymentText}>Credit Card</Text>
        </TouchableOpacity>

        {/* PayPal Option */}
        <TouchableOpacity
          style={[styles.paymentOption, selectedPaymentMethod === 'Qris' && styles.selectedOption]}
          onPress={() => handlePaymentMethodSelect('Qris')}
        >
          <View style={styles.cardContainer}>
            <Image
              source={require('../../assets/Qris.png')} // Gambar Qris masuk ke dalam card
              style={styles.cardImage}
            />
          </View>
          <Text style={styles.paymentText}>Qris</Text>
        </TouchableOpacity>

        {/* Dana Option */}
        <TouchableOpacity
          style={[styles.paymentOption, selectedPaymentMethod === 'dana' && styles.selectedOption]}
          onPress={() => handlePaymentMethodSelect('dana')}
        >
          <View style={styles.cardContainer}>
            <Image
              source={require('../../assets/Dana.png')} // Dana logo inside the card
              style={styles.cardImage}
            />
          </View>
          <Text style={styles.paymentText}>Dana</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Payment Summary</Text>

      <View style={styles.paymentSummary}>
        <Text style={styles.summaryText}>Seats: {selectedSeats.join(', ')}</Text>
        <Text style={styles.summaryText}>Total: Rp {initialTotalPrice.toLocaleString()}</Text>
        <Text style={styles.summaryText}>Discounted Total: Rp {totalPrice.toLocaleString()}</Text>
      </View>

      <View style={styles.promoCodeContainer}>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter Promo Code"
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyPromoCode}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handleConfirmPayment}>
        <Text style={styles.payButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#000',
    marginTop: 40, // Menurunkan posisi judul
  },
  paymentMethods: {
    marginBottom: 25,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedOption: {
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
  },
  cardContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginRight: 15,
  },
  cardImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  paymentText: {
    fontSize: 20,
    color: '#000',
    flex: 1,
    fontWeight: '600',
  },
  paymentSummary: {
    marginBottom: 30,
    marginHorizontal: 15,
  },
  summaryText: {
    fontSize: 20,
    marginBottom: 8,
    color: '#333',
  },
  promoCodeContainer: {
    marginBottom: 25,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  promoInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 15,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Payment;
