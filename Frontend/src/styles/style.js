import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Atur latar belakang jika diperlukan
  },
  scrollContent: {
    paddingBottom: 20, // Untuk memberi ruang bawah agar konten tidak terpotong
  },
  movieItem: {
    marginBottom: 20,
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  movieImage: {
    width: 200,
    height: 300,
    marginBottom: 10,
  },
  movieTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});
export default style;