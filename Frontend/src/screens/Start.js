import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Start = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image source={require('../../assets/logo.png')}
                style={styles.logo} // Ganti dengan URL gambar logo
                resizeMode="contain"
            />

            {/* Judul */}
            <Text style={styles.title}>
                Ordering cinema tickets online{'\n'}is practical and very easy
            </Text>

            {/* Ilustrasi */}
            <Image source={require('../../assets/kursi.jpg')}
                style={styles.logo1} // Ganti dengan URL gambar logo
                resizeMode="contain"
            />

            {/* Tombol Get Started */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')} // Navigasi ke halaman Login
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>

            {/* Indicator */}
            <View style={styles.indicatorContainer}>
                <View style={styles.circle} />
                <View style={[styles.circle, styles.activeCircle]} />
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
    },
    logo: {
        width: 150,
        height: 80,
        marginTop: 50,
    },
    logo1: {
        width: 300,
        height: 400,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 20,
        color: '#000',
    },
    image: {
        width: 300,
        height: 200,
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

export default Start;
