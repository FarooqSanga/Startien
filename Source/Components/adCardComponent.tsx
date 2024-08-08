import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

interface AdCardProps {
  ad: {
    id: string;
    picture: string; // Assume it's a URI
    price: string;
    title: string;
    features: string[];
    location: string;
    postedDate: string;
  };
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to ViewAdScreen and pass ad details
    navigation.navigate('ViewAdScreen', { ad });
  };

  return (
    <TouchableOpacity style={styles.adContainer} onPress={handlePress}>
      {/* Placeholder for Image */}
      <View style={styles.adImageContainer}>
        <View style={styles.placeholderImage} />
        <TouchableOpacity style={styles.adFavoriteButton}>
          <Icon name="star-o" size={20} color="#FFD700" />
        </TouchableOpacity>
      </View>
      {/* Details Section */}
      <View style={styles.adDetails}>
        <Text style={styles.adTitle} numberOfLines={2}>{ad.title}</Text>
        <Text style={styles.adPrice}>{ad.price}</Text>
        <View style={styles.adFeaturesContainer}>
          {ad.features.map((feature, index) => (
            <Text key={index} style={styles.adFeature}>{feature}</Text>
          ))}
        </View>
        <View style={styles.adLocationContainer}>
          <Icon name="map-marker" size={16} color="#777" style={styles.locationIcon} />
          <Text style={styles.adLocation}>{ad.location}</Text>
          <Text style={styles.adPostedDate}>{ad.postedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 10,
  },
  adImageContainer: {
    width: 120,
    height: 150,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
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
    flex: 1,
    padding: 10,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  adPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginBottom: 5,
    color: '#FF5733', // Adjust color as needed
  },
  adFeaturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  adFeature: {
    color: '#555',
    marginRight: 10,
    marginBottom: 5,
  },
  adLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 5,
  },
  adLocation: {
    color: '#777',
    marginRight: 5,
  },
  adPostedDate: {
    color: '#777',
  },
});

export default AdCard;
