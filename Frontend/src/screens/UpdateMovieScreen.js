import React, { useState } from 'react';
import {
  Layout,
  Input,
  Button,
  Text,
  Card,
  Avatar,
  Spinner,
} from '@ui-kitten/components';
import {
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const UpdateMovieScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const [title, setTitle] = useState(movie.title);
  const [synopsis, setSynopsis] = useState(movie.synopsis);
  const [genre, setGenre] = useState(movie.genre);
  const [duration, setDuration] = useState(movie.duration);
  const [director, setDirector] = useState(movie.director);
  const [rating, setRating] = useState(movie.rating.toString());
  const [votes, setVotes] = useState(movie.votes.toString());
  const [youtubeLink, setYoutubeLink] = useState(movie.youtubeLink);
  const [cast, setCast] = useState(movie.cast);
  const [image, setImage] = useState(movie.image);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickCastImage = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      const newCast = [...cast];
      newCast[index].image = result.assets[0].uri;
      setCast(newCast);
    }
  };

  const handleCastChange = (index, field, value) => {
    const newCast = [...cast];
    newCast[index][field] = value;
    setCast(newCast);
  };

  const updateMovie = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (title !== movie.title) formData.append('title', title);
      if (synopsis !== movie.synopsis) formData.append('synopsis', synopsis);
      if (genre !== movie.genre) formData.append('genre', genre);
      if (duration !== movie.duration) formData.append('duration', duration);
      if (director !== movie.director) formData.append('director', director);
      if (rating !== movie.rating.toString()) formData.append('rating', rating);
      if (votes !== movie.votes.toString()) formData.append('votes', votes);
      if (youtubeLink !== movie.youtubeLink) formData.append('youtubeLink', youtubeLink);
      if (JSON.stringify(cast) !== JSON.stringify(movie.cast)) {
        formData.append('cast', JSON.stringify(cast.map(({ name, image }) => ({ name, image }))));
      }

      if (image && image !== movie.image) {
        const fileName = image.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('image', {
          uri: image,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      cast.forEach((actor, index) => {
        if (actor.image && actor.image !== movie.cast[index]?.image) {
          const fileName = actor.image.split('/').pop();
          const fileType = fileName.split('.').pop();
          formData.append('castImages', {
            uri: actor.image,
            name: fileName,
            type: `image/${fileType}`,
          });
        }
      });

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.put(`http://192.168.1.9:5000/movies/${movie._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Film berhasil diperbarui');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Gagal memperbarui film');
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      Alert.alert('Error', 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Layout style={styles.formContainer}>
        <Text category="h4" style={styles.title}>
          Edit Film
        </Text>
        <Card style={styles.card}>
          <Input
            style={styles.input}
            placeholder="Judul Film"
            value={title}
            onChangeText={setTitle}
            label="Judul Film"
          />
          <Input
            style={styles.input}
            placeholder="Sinopsis"
            value={synopsis}
            onChangeText={setSynopsis}
            multiline
            label="Sinopsis"
          />
          <Input
            style={styles.input}
            placeholder="Genre"
            value={genre}
            onChangeText={setGenre}
            label="Genre"
          />
          <Input
            style={styles.input}
            placeholder="Durasi (menit)"
            value={duration}
            onChangeText={setDuration}
            label="Durasi (menit)"
          />
          <Input
            style={styles.input}
            placeholder="Sutradara"
            value={director}
            onChangeText={setDirector}
            label="Sutradara"
          />
          <Input
            style={styles.input}
            placeholder="Rating (1-10)"
            value={rating}
            onChangeText={setRating}
            label="Rating"
            keyboardType="numeric"
          />
          <Input
            style={styles.input}
            placeholder="Votes"
            value={votes}
            onChangeText={setVotes}
            label="Votes"
            keyboardType="numeric"
          />
          <Input
            style={styles.input}
            placeholder="Link YouTube"
            value={youtubeLink}
            onChangeText={setYoutubeLink}
            label="Link YouTube"
          />

          <Button style={styles.imagePicker} onPress={pickImage}>
            Pilih Gambar Film
          </Button>
          {image && <Image source={{ uri: image.startsWith('http') ? image : `http://192.168.1.9:5000${image}` }} style={styles.imagePreview} />}

          {cast.map((actor, index) => (
            <Card key={index} style={styles.castCard}>
              <Input
                style={styles.input}
                placeholder="Nama Aktor"
                value={actor.name}
                onChangeText={(text) => handleCastChange(index, 'name', text)}
                label={`Aktor ${index + 1}`}
              />
              <Button onPress={() => pickCastImage(index)}>Pilih Gambar Aktor</Button>
              {actor.image && (
                <Avatar source={{ uri: actor.image.startsWith('http') ? actor.image : `http://192.168.1.9:5000${actor.image}` }} style={styles.avatar} />
              )}
            </Card>
          ))}

          <Button style={styles.addButton} onPress={() => setCast([...cast, { name: '', image: null }])}>
            Tambah Aktor
          </Button>
        </Card>

        <Button style={styles.button} onPress={updateMovie} status="primary" disabled={loading}>
          {loading ? <Spinner size="small" /> : 'Update Film'}
        </Button>
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  formContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  imagePicker: {
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  card: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  castCard: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  addButton: {
    marginVertical: 15,
  },
  button: {
    marginTop: 20,
  },
});

export default UpdateMovieScreen;
