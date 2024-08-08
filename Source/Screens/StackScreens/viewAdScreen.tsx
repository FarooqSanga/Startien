import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

interface Ad {
  id: string;
  picture: string;
  title: string;
  price: string;
  location: string;
  postedDate: string;
  features: string[];
}

interface ViewAdScreenProps {
  route: {
    params: {
      ad: Ad;
    };
  };
}

const ViewAdScreen: React.FC<ViewAdScreenProps> = ({ route }) => {
  const { ad } = route.params;
  const [relatedAds, setRelatedAds] = useState<Ad[]>([]);

  // Simulated data fetching (replace with actual fetching logic)
  useEffect(() => {
    // Simulating fetching related ads
    const fetchRelatedAds = async () => {
      // Assume related ads data is fetched from an API or database
      const mockData: Ad[] = [
        {
          id: '2',
          picture: 'https://example.com/ad2.jpg',
          title: 'Second Ad',
          price: '$200',
          location: 'City B',
          postedDate: '2 days ago',
          features: ['Feature A', 'Feature B', 'Feature C'],
        },
        {
          id: '3',
          picture: 'https://example.com/ad3.jpg',
          title: 'Third Ad',
          price: '$300',
          location: 'City C',
          postedDate: '1 day ago',
          features: ['Feature X', 'Feature Y', 'Feature Z'],
        },
        {
          id: '4',
          picture: 'https://example.com/ad4.jpg',
          title: 'Fourth Ad',
          price: '$400',
          location: 'City D',
          postedDate: '3 days ago',
          features: ['Feature P', 'Feature Q', 'Feature R'],
        },
        {
          id: '5',
          picture: 'https://example.com/ad5.jpg',
          title: 'Fifth Ad',
          price: '$500',
          location: 'City E',
          postedDate: '4 days ago',
          features: ['Feature M', 'Feature N', 'Feature O'],
        },
      ];

      // Set related ads after fetching
      setRelatedAds(mockData);
    };

    fetchRelatedAds();
  }, []);

  const handleSMS = () => {
    console.log('SMS button pressed');
  };

  const handleCall = () => {
    console.log('Call button pressed');
  };

  const handleChat = () => {
    console.log('Chat button pressed');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Main Ad */}
        <Image source={{ uri: ad.picture }} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{ad.title}</Text>
          <Text style={styles.price}>{ad.price}</Text>
          <Text style={styles.location}>{ad.location}</Text>
          <Text style={styles.postedDate}>{ad.postedDate}</Text>
          <View style={styles.featuresContainer}>
            {ad.features.map((feature, index) => (
              <Text key={index} style={styles.feature}>
                {feature}
              </Text>
            ))}
          </View>
        </View>

        {/* Related Ads */}
        <View style={styles.relatedAdsContainer}>
          <Text style={styles.relatedTitle}>Related Ads</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedAds.map((relatedAd) => (
              <TouchableOpacity
                key={relatedAd.id}
                style={styles.relatedAdItem}
                onPress={() => console.log(`Viewing related ad ${relatedAd.id}`)}
              >
                <Image source={{ uri: relatedAd.picture }} style={styles.relatedAdImage} />
                <View style={styles.relatedAdDetails}>
                  <Text style={styles.relatedAdTitle}>{relatedAd.title}</Text>
                  <Text style={styles.relatedAdPrice}>{relatedAd.price}</Text>
                  <Text style={styles.relatedAdLocation}>{relatedAd.location}</Text>
                  <Text style={styles.relatedAdPostedDate}>{relatedAd.postedDate}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Fixed buttons at the bottom */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.fixedButton} onPress={handleSMS}>
          <Text style={styles.buttonText}>📱</Text>
          <Text style={styles.buttonText}>SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fixedButton} onPress={handleCall}>
          <Text style={styles.buttonText}>📞</Text>
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fixedButton} onPress={handleChat}>
          <Text style={styles.buttonText}>💬</Text>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#888',
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  postedDate: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  feature: {
    fontSize: 14,
    color: '#444',
    marginRight: 10,
    marginBottom: 5,
  },
  relatedAdsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  relatedAdItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  relatedAdImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 5,
    marginRight: 10,
  },
  relatedAdDetails: {
    flex: 1,
  },
  relatedAdTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  relatedAdPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  relatedAdLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  relatedAdPostedDate: {
    fontSize: 12,
    color: '#aaa',
  },
  fixedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOpacity: 0.3, // for iOS shadow
    shadowRadius: 5, // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
  },
  fixedButton: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default ViewAdScreen;
