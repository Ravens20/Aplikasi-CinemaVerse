import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Image, Dimensions, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.35;
const SPACING = 20;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

const baseURL = api.defaults.baseURL;

export default function Home({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        setMovies(response.data);
        setFilteredMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };

  const handleScrollEnd = (event) => {
    // No looping logic needed
  };

  useEffect(() => {
    // No need to scroll to offset initially
  }, [movies]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const bannerData = [
    { id: 1, image: require('../../assets/banner.jpg') },
    { id: 2, image: require('../../assets/moana.avif') },
    { id: 3, image: require('../../assets/banner2.jpg') },
    { id: 4, image: require('../../assets/venn.webp') },
  ];
  const bannerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = prevSlide + 1;
        const newIndex = nextSlide % bannerData.length;

        bannerRef.current?.scrollToIndex({
          index: newIndex,
          animated: true,
        });

        return newIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.iconAndTextContainer}>
            <Icon name="map-marker" size={20} color="#fff" style={styles.locationIcon} />
            <Text style={styles.sectionTitle}>Pekanbaru</Text>
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconItem}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="user" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconItem}>
              <Icon name="bell" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Icon name="search" size={18} color="#ccc" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, actors, etc."
              placeholderTextColor="#ccc"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* Banner Carousel */}
        <View style={styles.bannerContainer}>
          <FlatList
            ref={bannerRef}
            data={bannerData}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentSlide(slideIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.bannerCard}>
                <Image source={item.image} style={styles.bannerImage} />
              </View>
            )}
          />
          {/* Pagination dots */}
          <View style={styles.pagination}>
            {bannerData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentSlide === index
                    ? styles.paginationDotActive
                    : styles.paginationDotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.sectionTitle1}>Now Showing</Text>
          <Animated.FlatList
            ref={flatListRef}
            data={filteredMovies}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            bounces={false}
            contentContainerStyle={{
              paddingLeft: (width - CARD_WIDTH) / 2.2,
              paddingRight: (width - CARD_WIDTH) / 2,
            }}
            onMomentumScrollEnd={handleScrollEnd}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * SNAP_INTERVAL,
                index * SNAP_INTERVAL,
                (index + 1) * SNAP_INTERVAL,
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.9, 1.1, 0.9],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0, 1, 0],
                extrapolate: 'clamp',
              });

              return (
                <View style={styles.movieContainer}>
                  <Animated.View style={[styles.movieCard, { transform: [{ scale }] }]}>
                    <Image source={{ uri: item.image && item.image.startsWith('http') ? item.image : `${baseURL}${item.image}` }} style={styles.movieImage} />
                    <Animated.View style={[styles.buyTicketButton, { opacity }]}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Synopsis', { movieTitle: item.title })}
                      >
                        <Text style={styles.buttonText}>Buy Ticket</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </Animated.View>
                  <Animated.Text style={[styles.movieTitle, { opacity }]}>
                    {item.title}
                  </Animated.Text>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.additionalContent}>
          <Icon
            name="exclamation-circle"
            size={30}
            color="#fff"
            top="27"
            left="170"
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.additionalTitle}>Upcoming Movies</Text>
            <Text style={styles.additionalDescription}>
              Stay tuned for the latest updates on new releases and special screenings!
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={20} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Ticket')}
        >
          <Icon name="ticket" size={20} color="#fff" />
          <Text style={styles.navText}>Ticket</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('History')}
        >
          <Icon name="history" size={20} color="#fff" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  additionalContent: {
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 10,
    paddingTop: -70,
  },
  additionalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  additionalDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  iconAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
  },
  locationIcon: {
    marginRight: 8,
    paddingTop: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconItem: {
    marginLeft: 15,
    paddingTop: 35,
  },
  searchContainer: {
    marginTop: -20,
    alignItems: 'center',
    position: 'absolute',
    top: height * 0.14,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 20,
  },
  searchWrapper: {
    width: width * 0.92,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: 35,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 11,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  bannerContainer: {
    position: 'relative', // Untuk menempatkan pagination dots di dalam banner
    marginTop: 80,
    marginBottom: 35,
  },
  bannerCard: {
    width: width * 1,
    height: width * 0.5,
    backgroundColor: '#fff',
    borderRadius: 0,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle1: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  movieContainer: {
    alignItems: 'center',
    marginRight: SPACING,
    paddingTop: SPACING,
    width: CARD_WIDTH, // Tetap pertahankan width untuk card saja
  },
  movieTitle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    width: '290%', // Tambahkan ini agar teks memanjang ke ujung layar
    paddingHorizontal: 10, // Tambahkan padding agar teks tidak menempel ke tepi layar
    paddingBottom: 40,
  },
  movieCard: {
    width: CARD_WIDTH,
    borderRadius: 10,
    alignItems: 'center',
  },
  movieImage: {
    width: '100%', // Mengatur lebar gambar agar mengikuti lebar card
    height: 230, // Tentukan tinggi gambar
    borderRadius: 8,
    resizeMode: 'cover', // Menjaga gambar tidak terdistorsi
    marginBottom: 10, // Memberikan jarak di bawah gambar
  },
  buyTicketButton: {
    marginTop: -53,
    alignSelf: 'center',
    width: 130,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navbar: {
    position: 'absolute', // Navbar tetap di bawah
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
    zIndex: 1, // Agar navbar berada di atas konten lain
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
  pagination: {
    position: 'absolute',
    bottom: 10, // Tempatkan dots di dalam banner
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#888',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  paginationDotInactive: {
    backgroundColor: '#444',
  },
});
