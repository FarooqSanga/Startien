import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
  PanResponder,
  Linking,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface Ad {
  id: string;
  featuredImage: string;
  title: string;
  price: string;
  location: string;
  postedDate: string;
  description?: string;
  contactInfo?: string;
  additionalImages?: string[];
  category?: string;
  subcategory?: string;
  dynamicFields?: { [key: string]: string };
  city?: string;
  userId?: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
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
  const navigation = useNavigation();
  const [relatedAds, setRelatedAds] = useState<Ad[]>([]);
  const [sellerInfo, setSellerInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const allImages = [ad.featuredImage, ...(ad.additionalImages || [])];

  // Get the current user ID
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setCurrentUserId(currentUser.uid);
    }
  }, []);

  useEffect(() => {
    const fetchRelatedAds = async () => {
      try {
        const adsRef = database().ref('adsCollection');
        adsRef
          .orderByChild('category')
          .equalTo(ad.category ?? '')
          .on('value', (snapshot) => {
            const adsData: Ad[] = [];
            snapshot.forEach((childSnapshot) => {
              const childAd = childSnapshot.val();
              if (childSnapshot.key && childAd && childSnapshot.key !== ad.id) {
                adsData.push({ id: childSnapshot.key, ...childAd });
                return true;
              }
            });
            setRelatedAds(adsData);
          });

        if (ad.userId) {
          const userRef = database().ref(`users/${ad.userId}`);
          userRef.once('value').then((userSnapshot) => {
            const userData = userSnapshot.val();
            if (userData) {
              setSellerInfo(userData);
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching related ads or seller info:', error);
        setLoading(false);
      }
    };

    fetchRelatedAds();
  }, [ad]);

  const handleSMS = () => {
    console.log('SMS button pressed');
  };

  const handleCall = () => {
    if (ad.contactInfo) {
      Linking.openURL(`tel:${ad.contactInfo}`);
    }
  };

  const handleChat = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser || !ad.userId) return;
  
    const chatTitle = ad.title;
    const featuredImage = ad.featuredImage;
    const chatRef = database().ref('chats').push();
    const chatId = chatRef.key;  // This can be null, so we check it
  
    if (!chatId) {
      console.error('Error: Chat ID is null');
      return; // Exit if chatId is null
    }
  
    const timestamp = Date.now();
  
    try {
      // Set chat data in the 'chats' node in Firebase
      await chatRef.set({
        title: chatTitle,
        createdBy: currentUser.uid,
        members: {
          [currentUser.uid]: true, // Add buyer (current user) to members
          [ad.userId]: true, // Add ad publisher to members
        },
        featuredImage,
        timestamp,
      });
  
      // Add chat ID to the buyer's chat list
      const buyerChatsRef = database().ref(`users/${currentUser.uid}/chats`);
      await buyerChatsRef.update({ [chatId]: true });
  
      // Add chat ID to the ad publisher's chat list
      const sellerChatsRef = database().ref(`users/${ad.userId}/chats`);
      await sellerChatsRef.update({ [chatId]: true });
  
      // Navigate to the chats list screen
      navigation.navigate('ChatsScreen');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleImagePreview = (index: number) => {
    setCurrentImageIndex(index);
    setPreviewVisible(true);
  };

  const closeImagePreview = () => {
    setPreviewVisible(false);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dx > 50) {
        if (currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
        }
      } else if (gestureState.dx < -50) {
        if (currentImageIndex < allImages.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {ad.featuredImage && (
          <TouchableOpacity onPress={() => handleImagePreview(0)}>
            <Image source={{ uri: ad.featuredImage }} style={styles.image} />
          </TouchableOpacity>
        )}

        <View style={styles.infoBlock}>
          {ad.title && <Text style={styles.title}>{ad.title}</Text>}
          {ad.price && <Text style={styles.price}>Price: {ad.price}</Text>}
        </View>

        <View style={styles.infoBlock}>
          {ad.location && ad.city && (
            <Text style={styles.location}>Location: {ad.location}, {ad.city}</Text>
          )}
          {ad.postedDate && <Text style={styles.postedDate}>Posted on: {ad.postedDate}</Text>}
        </View>

        {ad.description && (
          <View style={styles.infoBlock}>
            <Text style={styles.blockTitle}>Description</Text>
            <Text style={styles.description}>{ad.description}</Text>
          </View>
        )}

        {ad.dynamicFields && (
          <View style={styles.infoBlock}>
            <Text style={styles.blockTitle}>Additional Information</Text>
            {Object.entries(ad.dynamicFields).map(([key, value], index) => (
              <Text key={index} style={styles.dynamicField}>
                {key}: {value}
              </Text>
            ))}
          </View>
        )}

        {sellerInfo && (
          <View style={styles.infoBlock}>
            <Text style={styles.blockTitle}>Seller Information</Text>
            <Text style={styles.sellerName}>{sellerInfo.firstName} {sellerInfo.lastName}</Text>
            <Text style={styles.sellerEmail}>{sellerInfo.email}</Text>
          </View>
        )}

        {ad.contactInfo && (
          <View style={styles.infoBlock}>
            <Text style={styles.blockTitle}>Contact Information</Text>
            <Text style={styles.contactInfo}>Phone: {ad.contactInfo}</Text>
          </View>
        )}

        <View style={styles.infoBlock}>
          <Text style={styles.blockTitle}>Instructions for Purchasing</Text>
          <Text style={styles.purchaseText}>
            Meet and greet the seller at a mutually agreed location. Check the product thoroughly before purchasing to ensure it meets your expectations.
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.blockTitle}>Safety Tips</Text>
          <Text style={styles.bulletPoint}>• Always meet in a public place.</Text>
          <Text style={styles.bulletPoint}>• Do not transfer money before inspecting the product.</Text>
          <Text style={styles.bulletPoint}>• Verify the seller’s identity and product condition.</Text>
          <Text style={styles.bulletPoint}>• Avoid deals that seem too good to be true.</Text>
        </View>

        {ad.additionalImages && ad.additionalImages.length > 0 && (
          <ScrollView horizontal style={styles.additionalImagesContainer}>
            {ad.additionalImages.map((uri, index) => (
              <TouchableOpacity key={index} onPress={() => handleImagePreview(index + 1)}>
                <Image source={{ uri }} style={styles.additionalImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {relatedAds.length > 0 && (
          <View style={styles.relatedAdsContainer}>
            <Text style={styles.relatedTitle}>Related Ads</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedAds.map((relatedAd) => (
                <TouchableOpacity
                  key={relatedAd.id}
                  style={styles.relatedAdItem}
                  onPress={() => console.log(`Viewing related ad ${relatedAd.id}`)}
                >
                  <Image source={{ uri: relatedAd.featuredImage }} style={styles.relatedAdImage} />
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
        )}
      </ScrollView>

      {currentUserId !== ad.userId && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity style={styles.fixedButton} onPress={handleSMS}>
            <Text style={styles.buttonText}>📱 SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fixedButton} onPress={handleCall}>
            <Text style={styles.buttonText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fixedButton} onPress={handleChat}>
            <Text style={styles.buttonText}>💬 Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={previewVisible} transparent={true} onRequestClose={closeImagePreview}>
        <View style={styles.previewContainer} {...panResponder.panHandlers}>
          <TouchableOpacity style={styles.closeButton} onPress={closeImagePreview}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: allImages[currentImageIndex] }} style={styles.previewImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  infoBlock: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  price: {
    fontSize: 20,
    color: '#FF5733',
    marginBottom: 10,
    fontWeight: '600',
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
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 10,
  },
  dynamicField: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  sellerName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  sellerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  purchaseText: {
    fontSize: 14,
    color: '#004d40',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
    marginLeft: 10,
  },
  additionalImagesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 10,
  },
  additionalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 5,
    borderColor: '#ddd',
    borderWidth: 1,
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
    backgroundColor: '#FFF',
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
    color: '#333',
  },
  relatedAdPrice: {
    fontSize: 14,
    color: '#FF5733',
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
    elevation: 5,
  },
  fixedButton: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginTop: 5,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    resizeMode: 'contain',
  },
});

export default ViewAdScreen;