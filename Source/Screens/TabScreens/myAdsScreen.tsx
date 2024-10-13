import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import CustomStatusBar from '../../Components/customStatusBar';

type Ad = {
  listingId: string;
  title: string;
  description: string;
  price: string;
  featuredImage?: string;
};

type Props = {
  navigation: any;
};

const MyAdsScreen: React.FC<Props> = ({ navigation }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAds = () => {
      const user = auth().currentUser;
      if (!user) {
        console.error('No authenticated user');
        setIsLoading(false);
        return;
      }

      const adsRef = database().ref(`users/${user.uid}/ads`);
      const onValueChange = adsRef.on('value', (snapshot) => {
        const adsData = snapshot.val();
        if (adsData) {
          const adsArray = Object.keys(adsData).map((key) => ({
            listingId: key,
            ...adsData[key],
          })) as Ad[];
          setAds(adsArray);
          setFilteredAds(adsArray);
        } else {
          setAds([]);
          setFilteredAds([]);
        }
        setIsLoading(false);
      });

      // Cleanup listener on component unmount
      return () => adsRef.off('value', onValueChange);
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = ads.filter((ad) =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAds(filtered);
    } else {
      setFilteredAds(ads);
    }
  }, [searchTerm, ads]);

  const handleEditAd = (ad: Ad) => {
    navigation.navigate('EditAdScreen', { ad });
  };

  const handleDeleteAd = (adId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this ad?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            const user = auth().currentUser;
            if (!user) {
              Alert.alert('Error', 'User not authenticated');
              return;
            }

            try {
              // Optimistically update UI before deletion
              setAds((prevAds) => prevAds.filter((ad) => ad.listingId !== adId));
              setFilteredAds((prevAds) => prevAds.filter((ad) => ad.listingId !== adId));

              // Delete from Firebase
              await database().ref(`users/${user.uid}/ads/${adId}`).remove();
              await database().ref(`adsCollection/${adId}`).remove();

              Alert.alert('Success', 'Ad deleted successfully');
            } catch (error) {
              console.error('Error deleting ad:', error);
              Alert.alert('Error', 'Failed to delete ad');

              // Revert UI changes if deletion fails
              setAds((prevAds) => {
                const adToRevert = prevAds.find((ad) => ad.listingId === adId);
                if (adToRevert) {
                  return [...prevAds, adToRevert];
                }
                return prevAds;
              });
              setFilteredAds((prevAds) => {
                const adToRevert = prevAds.find((ad) => ad.listingId === adId);
                if (adToRevert) {
                  return [...prevAds, adToRevert];
                }
                return prevAds;
              });
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Ad }) => (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
      <TouchableOpacity onPress={() => handleEditAd(item)}>
        <View style={styles.adContainer}>
          {item.featuredImage && (
            <Image source={{ uri: item.featuredImage }} style={styles.image} />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>Price: {item.price}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEditAd(item)}>
              <FontAwesomeIcon icon={faPencilAlt} size={20} color="#fff" />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteAd(item.listingId)}>
              <FontAwesomeIcon icon={faTrashAlt} size={20} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return isLoading ? (
    <View style={styles.container}>
      <CustomStatusBar backgroundColor="#6200ea" barStyle="light-content" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <CustomStatusBar backgroundColor="#6200ea" barStyle="light-content" />
      {/* Search Bar */}
      <TextInput
        placeholder="Search ads..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredAds}
        renderItem={renderItem}
        keyExtractor={(item) => item.listingId}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  adContainer: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#1a73e8',
  },
  deleteButton: {
    backgroundColor: '#e53935',
  },
  buttonText: {
    marginLeft: 6,
    color: '#fff',
    fontSize: 14,
  },
  loadingText: {
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    margin: 16,
    fontSize: 16,
  },
});

export default MyAdsScreen;
