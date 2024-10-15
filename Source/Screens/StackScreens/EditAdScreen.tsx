import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import UUID from 'react-native-uuid';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import ImageResizer from 'react-native-image-resizer'; // Import the ImageResizer library
import categories from '../../JSON/categories.json';
import cities from '../../JSON/locations.json';
import DynamicFields from '../../Components/DynamicFields';
import CityPicker from '../../Components/CityPicker';
import { categoryProperties } from '../../JSON/categoryProperties';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './../../Navigation/types';

const { width: screenWidth } = Dimensions.get('window');

type Category = {
  name: string;
  icon: string;
  subcategories?: Category[];
};

type EditAdScreenRouteProp = RouteProp<RootStackParamList, 'EditAdScreen'>;
type EditAdScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditAdScreen'>;

type Props = {
  route: EditAdScreenRouteProp;
  navigation: EditAdScreenNavigationProp;
};

const EditAdScreen: React.FC<Props> = ({ route, navigation }) => {
  const { ad } = route.params;

  // Load existing ad data
  const [title, setTitle] = useState(ad.title || '');
  const [description, setDescription] = useState(ad.description || '');
  const [price, setPrice] = useState(ad.price || '');
  const [category, setCategory] = useState<string | null>(ad.category || null);
  const [subcategory, setSubcategory] = useState<string | null>(ad.subcategory || null);
  const [location, setLocation] = useState(ad.location || '');
  const [selectedCity, setSelectedCity] = useState(ad.city || 'Karachi');
  const [additionalImages, setAdditionalImages] = useState<string[]>(ad.additionalImages || []);
  const [contactInfo, setContactInfo] = useState(ad.contactInfo || '');
  const [featuredImage, setFeaturedImage] = useState<string | null>(ad.featuredImage || null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subcategoryModalVisible, setSubcategoryModalVisible] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<{ [key: string]: string }>(ad.dynamicFields || {});
  const [loading, setLoading] = useState(false); // State for loading

  const selectedCategory: Category | undefined = categories.find(
    (cat: Category) => cat.name === category
  );

  // Reuse the handle image picker function
  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, async (response) => {
      if (response.didCancel || response.errorCode) {
        Alert.alert('Image selection error', response.errorMessage || 'Unknown error');
        return;
      }

      setLoading(true); // Show loading while resizing

      try {
        const resizedImages: string[] = [];

        // Loop through selected images and resize them
        for (const asset of response.assets || []) {
          if (asset.uri) {
            // Compress the image
            const resizedImage = await ImageResizer.createResizedImage(
              asset.uri,
              800, // Width
              800, // Height
              'JPEG', // Format
              80, // Quality
              0 // Rotation
            );

            resizedImages.push(resizedImage.uri); // Store the resized image URI
          }
        }

        setAdditionalImages(resizedImages); // Update state with resized images
        setLoading(false); // Hide loading screen after resizing
      } catch (error) {
        console.error('Image compression error:', error);
        setLoading(false); // Hide loading screen on error
        Alert.alert('Error', 'Failed to resize image. Please try again.');
      }
    });
  };

  // Reuse compressAndUploadImage function from CreateAdScreen
  const compressAndUploadImage = async (uri: string) => {
    try {
      const compressedImage = await ImageResizer.createResizedImage(
        uri,
        800,
        800,
        'JPEG',
        80,
        0
      );
      const reference = storage().ref(`images/${UUID.v4()}`);
      await reference.putFile(compressedImage.uri);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Image compression or upload error:', error);
      throw error;
    }
  };

  // Reuse handlePublish as handleUpdate with modifications
  const handleUpdate = async () => {
    if (!title || !description || !price || !category || !subcategory || !location) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      let imageUrls: string[] = [];

      // Compress and upload featured image
      if (featuredImage && !ad.featuredImage) {
        const compressedImageUrl = await compressAndUploadImage(featuredImage);
        imageUrls.push(compressedImageUrl);
      } else {
        imageUrls.push(ad.featuredImage); // Keep existing featured image
      }

      // Compress and upload additional images
      for (const img of additionalImages) {
        const compressedImageUrl = await compressAndUploadImage(img);
        imageUrls.push(compressedImageUrl);
      }

      const now = new Date().toISOString();
      const adPublisherID = firebase.auth().currentUser?.uid; // Get the current user's UID

      const updatedAdData = {
        title,
        description,
        price,
        category,
        subcategory,
        location,
        city: selectedCity,
        contactInfo,
        featuredImage: imageUrls[0] || null,
        additionalImages: imageUrls.slice(1),
        dynamicFields,
        updatedAt: now,
        adPublisherID,
      };

      const userAdRef = database().ref(`users/${adPublisherID}/ads/${ad.id}`);
      const globalAdRef = database().ref(`adsCollection/${ad.id}`);

      // Update the ad in both user and global references
      await userAdRef.update(updatedAdData);
      await globalAdRef.update(updatedAdData);

      setLoading(false); // Hide loading indicator

      Toast.show({
        type: 'success',
        text1: 'Ad Updated Successfully',
      });

      navigation.goBack();
    } catch (error: any) {
      console.error('Update error:', error);
      setLoading(false); // Hide loading indicator
      Alert.alert('Error', `Something went wrong: ${error.message || 'Unknown error'}`);
    }
  };

  // Category selection logic
  const selectCategory = (categoryName: string) => {
    setCategory(categoryName);
    setSubcategory(null);
    setCategoryModalVisible(false);
    setDynamicFields({});
  };

  const selectSubcategory = (subcategoryName: string) => {
    setSubcategory(subcategoryName);
    setSubcategoryModalVisible(false);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => selectCategory(item.name)}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSubcategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => selectSubcategory(item.name)}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6200ea" />
        </View>
      )}
      <View style={styles.imagePicker}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
          <Icon name="image" size={24} color="#fff" />
          <Text style={styles.imagePickerButtonText}>Pick an Image</Text>
        </TouchableOpacity>
        {featuredImage && <Image source={{ uri: featuredImage }} style={styles.featuredImage} />}
        {additionalImages.length > 0 && (
          <ScrollView horizontal style={styles.imagePreviewContainer}>
            {additionalImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.additionalImage} />
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the title"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.title}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter the description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.title}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <Text style={styles.title}>Category</Text>
        <TouchableOpacity style={styles.categoryInput} onPress={() => setCategoryModalVisible(true)}>
          <View style={styles.categorySelection}>
            {category && selectedCategory?.icon && <Text style={styles.categoryIcon}>{selectedCategory.icon}</Text>}
            <Text style={styles.categoryName}>{category || 'Select a category'}</Text>
          </View>
        </TouchableOpacity>
        {category && (
          <>
            <Text style={styles.title}>Subcategory</Text>
            <TouchableOpacity style={styles.categoryInput} onPress={() => setSubcategoryModalVisible(true)}>
              <View style={styles.categorySelection}>
                {subcategory && selectedCategory?.subcategories && (
                  <Text style={styles.categoryIcon}>{selectedCategory.subcategories.find(sub => sub.name === subcategory)?.icon}</Text>
                )}
                <Text style={styles.categoryName}>{subcategory || 'Select a subcategory'}</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        <CityPicker selectedCity={selectedCity} setSelectedCity={setSelectedCity} cities={cities} />
        <Text style={styles.title}>Nearby Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter nearby location"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.title}>Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter contact information"
          value={contactInfo}
          onChangeText={setContactInfo}
        />
        <DynamicFields
          category={category}
          dynamicFields={dynamicFields}
          setDynamicFields={setDynamicFields}
          categoryProperties={categoryProperties}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      {/* Category Picker Modal */}
      <Modal
        transparent={true}
        visible={categoryModalVisible}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setCategoryModalVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.name}
            />
          </View>
        </View>
      </Modal>
      {/* Subcategory Picker Modal */}
      <Modal
        transparent={true}
        visible={subcategoryModalVisible}
        animationType="slide"
        onRequestClose={() => setSubcategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSubcategoryModalVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Subcategory</Text>
            <FlatList
              data={selectedCategory?.subcategories || []}
              renderItem={renderSubcategoryItem}
              keyExtractor={item => item.name}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: '4%',
    marginTop: 20,
    backgroundColor: '#F9F9F9',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  imagePicker: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '5%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '5%',
    elevation: 4,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: '3%',
    borderRadius: 10,
    marginBottom: '3%',
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: '2%',
  },
  featuredImage: {
    width: '100%',
    height: screenWidth * 0.4,
    borderRadius: 8,
    marginVertical: '3%',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
  },
  additionalImage: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    borderRadius: 8,
    marginRight: '3%',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  formContainer: {
    paddingHorizontal: '5%',
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    paddingVertical: '5%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '2%',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: '3%',
    marginBottom: '5%',
    backgroundColor: '#fff',
    width: '100%',
    elevation: 2,
  },
  textArea: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: '3%',
    marginBottom: '5%',
    backgroundColor: '#fff',
    width: '100%',
    elevation: 2,
    textAlignVertical: 'top',
  },
  categoryInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: '5%',
    backgroundColor: '#fff',
    width: '100%',
    elevation: 2,
    justifyContent: 'center',
    paddingHorizontal: '3%',
  },
  categorySelection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: '3%',
    color: '#007bff',
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: '4%',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '5%',
  },
  modalContent: {
    width: screenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '5%',
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '5%',
    color: '#333',
    alignSelf: 'center',
  },
  categoryListContainer: {
    maxHeight: screenWidth * 0.8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '3%',
    marginVertical: '1%',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    width: '100%',
    elevation: 1,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4d4d',
    padding: '3%',
    borderRadius: 50,
    zIndex: 1,
    elevation: 6,
  },
});

export default EditAdScreen;