import React, { useState } from 'react';
import api from '../services/api';
import {
  Layout,
  Input,
  Button,
  Text,
  Card,
  Avatar,
} from '@ui-kitten/components';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AddMovieScreen = () => {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState(''); // Treat duration as a string
  const [director, setDirector] = useState('');
  const [rating, setRating] = useState('');
  const [votes, setVotes] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [cast, setCast] = useState([{ name: '', image: null }]);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
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
      aspect: [1, 1],
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

  const addCastField = () => {
    setCast([...cast, { name: '', image: null }]);
  };

  const addMovie = async () => {
    if (
      !title ||
      !synopsis ||
      !genre ||
      !duration ||
      !director ||
      !rating ||
      !votes ||
      !youtubeLink
    ) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('synopsis', synopsis);
    formData.append('genre', genre);
    formData.append('duration', duration); // Treat duration as a string
    formData.append('director', director);
    formData.append('rating', rating);
    formData.append('votes', votes);
    formData.append('youtubeLink', youtubeLink);
    formData.append('cast', JSON.stringify(cast.map(({ name }) => ({ name }))));

    if (image) {
      const fileName = image.split('/').pop();
      const fileType = fileName.split('.').pop();
      formData.append('image', {
        uri: image,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    cast.forEach((actor, index) => {
      if (actor.image) {
        const fileName = actor.image.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('castImages', {
          uri: actor.image,
          name: fileName,
          type: `image/${fileType}`,
        });
      }
    });

    try {
      const response = await api.post('/movies/add-movie', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Film berhasil ditambahkan');
        setTitle('');
        setSynopsis('');
        setGenre('');
        setDuration('');
        setDirector('');
        setRating('');
        setVotes('');
        setYoutubeLink('');
        setCast([{ name: '', image: null }]);
        setImage(null);
      } else {
        Alert.alert('Error', response.data.message || 'Gagal menambahkan film');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Layout style={styles.formContainer}>
        <Text category="h4" style={styles.title}>
          Tambah Film
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
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

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
                <Avatar source={{ uri: actor.image }} style={styles.avatar} />
              )}
            </Card>
          ))}

          <Button style={styles.addButton} onPress={addCastField}>
            Tambah Aktor
          </Button>
        </Card>

        <Button style={styles.button} onPress={addMovie} status="primary">
          Tambah Film
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

export default AddMovieScreen;
