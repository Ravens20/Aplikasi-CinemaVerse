import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Judul */}
      <Text style={styles.header}>cinema booking application</Text>

      {/* Gambar Tengah */}
      <View style={styles.mainImageContainer}>
        <Image
          source={{ uri: 'https://your-image-url/logo.png' }} // Ganti dengan URL gambar logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Deskripsi */}
      <Text style={styles.description}>
        no need to queue, order and{'\n'}scan tickets at the cinema{'\n'}and have fun
      </Text>

      {/* Tombol Next */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Start')} // Navigasi ke halaman Start
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      {/* Indicator */}
      <View style={styles.indicatorContainer}>
        <View style={[styles.circle, styles.activeCircle]} />
        <View style={styles.circle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    color: '#000',
  },
  mainImageContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#1C1C1C',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    margintop: 50,
  },
  skipText: {
    marginTop: 1,
    fontSize: 14,
    color: '#666',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 5,
  },
  activeCircle: {
    backgroundColor: '#000',
  },
});

export default Welcome;
