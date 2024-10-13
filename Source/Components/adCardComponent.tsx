import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

interface AdCardProps {
  ad: {
    id: string;
    featuredImage?: string; // Changed from 'picture' to 'featuredImage' to match expected prop
    price: string;
    title: string;
    features?: string[]; // Optional, to handle missing or undefined features
    location: string;
    postedDate: string;
  };
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const navigation = useNavigation<any>(); // Fix TypeScript error by typing navigation

  const defaultImageUri = 'https://via.placeholder.com/150'; // Replace with your desired default image URI

  const handlePress = () => {
    // Navigate to ViewAdScreen and pass ad details
    navigation.navigate('ViewAdScreen', { ad });
  };

  return (
    <TouchableOpacity style={styles.adContainer} onPress={handlePress}>
      {/* Image Section */}
      <View style={styles.adImageContainer}>
        <Image
          source={{ uri: ad.featuredImage || defaultImageUri }} // Use default image if featuredImage is not provided
          style={styles.adImage}
        />
        <TouchableOpacity style={styles.adFavoriteButton}>
          <Icon name="star-o" size={20} color="#FFD700" />
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
          <Text style={styles.adLocation}>{ad.location}</Text>
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
