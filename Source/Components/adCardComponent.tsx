import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'; // For user ID
import database from '@react-native-firebase/database'; // For Firebase Database operations

interface AdCardProps {
  ad: {
    id: string;
    featuredImage?: string;
    price: string;
    title: string;
    features?: string[];
    location: string;
    postedDate: string;
    city: string;
  };
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const navigation = useNavigation<any>(); // Fix TypeScript error by typing navigation
  const [isSaved, setIsSaved] = useState(false); // State to track if the ad is saved
  const userID = auth().currentUser?.uid; // Get the current user's ID

  const defaultImageUri = 'https://via.placeholder.com/150'; // Replace with your desired default image URI

  useEffect(() => {
    if (userID) {
      const savedAdRef = database().ref(`users/${userID}/savedAds/${ad.id}`);

      // Listen for real-time changes to see if the ad is saved
      savedAdRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
          setIsSaved(true); // Ad is saved
        } else {
          setIsSaved(false); // Ad is not saved
        }
      });

      // Clean up the listener when the component unmounts
      return () => savedAdRef.off();
    }
  }, [userID, ad.id]);

  const handlePress = () => {
    // Navigate to ViewAdScreen and pass ad details
    navigation.navigate('ViewAdScreen', { ad });
  };

  const toggleSaveAd = () => {
    if (!userID) return; // Ensure user is logged in

    const savedAdRef = database().ref(`users/${userID}/savedAds/${ad.id}`);

    if (isSaved) {
      // Remove from savedAds if already saved
      savedAdRef.remove()
        .then(() => {
          setIsSaved(false); // Update UI to show the ad is unsaved
        })
        .catch(error => {
          console.error("Error removing ad from savedAds: ", error);
        });
    } else {
      // Add to savedAds if not already saved
      savedAdRef.set(true) // Save only a flag or reference, instead of the entire ad object
        .then(() => {
          setIsSaved(true); // Update UI to show the ad is saved
        })
        .catch(error => {
          console.error("Error saving ad: ", error);
        });
    }
  };

  return (
    <TouchableOpacity style={styles.adContainer} onPress={handlePress}>
      {/* Image Section */}
      <View style={styles.adImageContainer}>
        <Image
          source={{ uri: ad.featuredImage || defaultImageUri }} // Use default image if featuredImage is not provided
          style={styles.adImage}
        />
        <TouchableOpacity style={styles.adFavoriteButton} onPress={toggleSaveAd}>
          {/* Change star color based on whether the ad is saved */}
          <Icon name={isSaved ? "star" : "star-o"} size={28} color={isSaved ? "#FFD700" : "#000"} />
        </TouchableOpacity>
      </View>
      {/* Details Section */}
      <View style={styles.adDetails}>
        <Text style={styles.adTitle} numberOfLines={2}>{ad.title}</Text>
        <Text style={styles.adPrice}>{ad.price}</Text>
        <View style={styles.adFeaturesContainer}>
          {(ad.features || []).map((feature, index) => (
            <Text key={index} style={styles.adFeature}>{feature}</Text>
          ))}
        </View>
        <View style={styles.adLocationContainer}>
          <Icon name="map-marker" size={16} color="#777" style={styles.locationIcon} />
          <Text style={styles.adLocation}>{ad.location}, {ad.city}</Text>
        </View>
        <Text style={styles.adPostedDate}>{ad.postedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    width: '48%', // To fit two items per row with margin
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 10,
    marginHorizontal: '1%', // Small margin between items
  },
  adImageContainer: {
    width: '100%',
    aspectRatio: 1, // Ensure the image has a square ratio
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  adImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image covers the container properly
  },
  adFavoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    aspectRatio:1,
    borderRadius: 20,
  },
  adDetails: {
    padding: 8,
  },
  adTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  adPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 4,
  },
  adFeaturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  adFeature: {
    color: '#555',
    marginRight: 8,
    marginBottom: 2,
    fontSize: 12,
  },
  adLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationIcon: {
    marginRight: 4,
  },
  adLocation: {
    color: '#777',
    marginRight: 5,
    fontSize: 12,
  },
  adPostedDate: {
    color: '#777',
    fontSize: 12,
  },
});

export default AdCard;
