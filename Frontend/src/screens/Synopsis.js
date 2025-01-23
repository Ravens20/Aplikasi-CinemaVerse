import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, Linking, ActivityIndicator, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import api from '../services/api';

const baseURL = api.defaults.baseURL;

export default function Synopsis({ route, navigation }) {
  const { movieTitle } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const starAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${baseURL}/movies?title=${movieTitle}`);
        setMovie(response.data);
      } catch (err) {
        setError('Failed to fetch movie data');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieTitle]);

  useEffect(() => {
    if (movie) {
      Animated.timing(starAnimation, {
        toValue: movie.rating / 2,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [movie, starAnimation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Film tidak ditemukan!</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${baseURL}${movie.image}` }}
          style={styles.movieImage}
        />
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => Linking.openURL(movie.youtubeLink)}
        >
          <Icon name="play-circle" size={50} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.genre}>{movie.genre} | Durasi : {movie.duration} Menit</Text>
      </View>
      <View style={styles.ratingContainer}>
        {renderStars(movie.rating)}
        <Text style={styles.ratingNumber}>{movie.rating}</Text>
        <Text style={styles.ratingText}>Rating</Text>
      </View>
      <View style={styles.ratingNumberContainer}>
        <Text style={styles.voteText}>{movie.votes} Vote</Text>
      </View>
    </View>
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <View style={styles.starsContainer}>
        {Array(fullStars).fill().map((_, index) => (
          <Animated.View key={`full-${index}`} style={{ transform: [{ scale: starAnimation }], marginRight: 17 }}>
            <Icon name="star" size={6} color="#f1c40f" />
          </Animated.View>
        ))}
        {halfStar === 1 && (
          <Animated.View key="half" style={{ transform: [{ scale: starAnimation }], marginRight: 17 }}>
            <Icon name="star-half" size={6} color="#f1c40f" />
          </Animated.View>
        )}
        {Array(emptyStars).fill().map((_, index) => (
          <Animated.View key={`empty-${index}`} style={{ transform: [{ scale: starAnimation }], marginRight: 17 }}>
            <Icon name="star-o" size={6} color="#f1c40f" />
          </Animated.View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <Text style={styles.synopsisTitle}>Sinopsis:</Text>
            <Text style={styles.synopsisText}>{movie.synopsis}</Text>
            <Text style={styles.detailTitle}>Sutradara:</Text>
            <Text style={styles.detailText}>{movie.director}</Text>
            <Text style={styles.detailTitle}>Pemeran:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castScrollView}>
              {movie.cast.map((actor, index) => (
                <View key={index} style={styles.castContainer}>
                  <Image
                    source={{ uri: `${baseURL}${actor.image}` }}
                    style={styles.actorImage}
                  />
                  <Text style={styles.actorName}>{actor.name}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => navigation.navigate('Seat', { movieTitle: movie.title })}
            >
              <Text style={styles.bookButtonText}>Buy Ticket</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20, // Menambahkan jarak bawah agar tidak terlalu berdekatan dengan judul
  },
  movieImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }], // Menempatkan ikon play di tengah gambar
    zIndex: 1,
  },
  movieInfo: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  genre: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  voteText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  ratingNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  ratingNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
  },
  ratingText: {
    color: '#fff',
    fontSize: 16,
  },
  footerContainer: {
    padding: 20,
    backgroundColor: '#1f1f1f',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 20,
  },
  synopsisTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  synopsisText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify'
  },
  detailTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  detailText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 10,
  },
  castScrollView: {
    marginTop: 10,
  },
  castContainer: {
    flexDirection: 'column',  // Stack image and name vertically
    alignItems: 'center',
    marginRight: 15,  // Add space between actors
  },
  actorImage: {
    width: 60,   // Slightly bigger image size
    height: 60,
    borderRadius: 30,  // Make the image round
    marginBottom: 5,   // Space between image and name
  },
  actorName: {
    color: '#ccc',   // Keep the text color same as other details
    fontSize: 10,     // Smaller font size for actor's name
    textAlign: 'center', // Align the name in the center under the image
  },
  bookButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
});
