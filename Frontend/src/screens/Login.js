import React, { useState } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator, // Untuk indikator loading
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  // Menambahkan state errorMessage
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true); // Tampilkan indikator loading
    setErrorMessage(''); // Reset error message sebelum setiap login
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Cek apakah token tersedia dalam response
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('username', response.data.username);
        if (response.data.role) {
          await AsyncStorage.setItem('userRole', response.data.role); // Store user role
        }

        alert('Login berhasil!');
        if (response.data.role === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AddMovie' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } else {
        setErrorMessage('Token tidak tersedia dalam response');
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message ||
          'Login gagal, periksa koneksi atau data Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>  // Menampilkan error message jika ada
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {loading ? (
              <ActivityIndicator color="#FFF" /> 
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.signupText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LoginAdmin')}>
            <Text style={styles.footerText}>
              Login as Admin
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#000',  // Hitam untuk latar belakang atas
    height: height * 0.3,  // Menentukan tinggi header
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#fff',  // Kontainer lingkaran putih
    width: 70,  // Ukuran lingkaran lebih kecil
    height: 70,  // Ukuran lingkaran lebih kecil
    borderRadius: 40,  // Membuatnya menjadi lingkaran sempurna
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',  // Menghilangkan bagian gambar yang keluar dari lingkaran
    marginTop: -height * -0.0,  // Menurunkan logo agar lebih tinggi
  },
  logo: {
    width: 60,  // Ukuran logo lebih kecil
    height: 60,  // Ukuran logo lebih kecil
    resizeMode: 'cover', // Sesuaikan gambar agar pas dalam lingkaran
  },
  formContainer: {
    backgroundColor: '#fff', // Kontainer form menjadi putih
    borderTopLeftRadius: 50, // Radius hanya di kiri atas
    borderTopRightRadius: 0, // Tidak ada radius di kanan atas
    padding: 20,
    paddingTop: 40,  // Memberikan jarak antara logo dan form
    marginTop: -40,   // Menghilangkan jarak antar logo dan form
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    width: '100%',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  signupText: {
    color: '#000',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Login;
