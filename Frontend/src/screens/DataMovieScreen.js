import React, { useState, useEffect } from 'react';
import {
  Layout,
  Text,
  Card,
  Button,
  Spinner,
} from '@ui-kitten/components';
import {
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = api.defaults.baseURL;

const DataMovieScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleDeleteMovie = (movie) => {
    setSelectedMovie(movie);
    setDeleteModalVisible(true);
  };

  const deleteMovie = async () => {
    setLoading(true);
    try {
      const response = await api.delete(`/movies/${selectedMovie._id}`);

      if (response.status === 200) {
        Alert.alert('Success', 'Film berhasil dihapus');
        setDeleteModalVisible(false);
        setSelectedMovie(null);
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie._id !== selectedMovie._id)
        );
      } else {
        Alert.alert('Error', 'Gagal menghapus film');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Layout style={styles.layout}>
        <Text category="h4" style={styles.title}>
          Data Film
        </Text>
        {movies.map((movie) => (
          <Card key={movie._id} style={styles.card}>
            <Image source={{ uri: `${baseURL}${movie.image}` }} style={styles.image} />
            <Text category="h5" style={styles.movieTitle}>
              {movie.title}
            </Text>
            <Text>{movie.genre}</Text>
            <Text>{movie.duration}</Text>
            <Text>{movie.director}</Text>
            <Text>{movie.rating}</Text>
            <Text>{movie.votes}</Text>
            <Text>{movie.youtubeLink}</Text>
            <Button style={styles.button} onPress={() => navigation.navigate('UpdateMovie', { movie })}>
              Edit
            </Button>
            <Button style={styles.button} status="danger" onPress={() => handleDeleteMovie(movie)}>
              Delete
            </Button>
          </Card>
        ))}
      </Layout>

      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Apakah Anda yakin ingin menghapus film ini?</Text>
            <View style={styles.modalButtons}>
              <Button onPress={deleteMovie} disabled={loading}>
                {loading ? <Spinner size="small" /> : 'Yes'}
              </Button>
              <Button onPress={() => setDeleteModalVisible(false)} status="basic">
                No
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  layout: {
    flex: 1,
    padding: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  movieTitle: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
});

export default DataMovieScreen;
