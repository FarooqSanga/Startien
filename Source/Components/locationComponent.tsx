import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import locationsData from './../JSON/locations.json';
import Icon from 'react-native-vector-icons/Ionicons';

interface LocationInputProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ selectedLocation, setSelectedLocation }) => {
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [location, setLocation] = useState('');

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setLocation('');
    setLocationModalVisible(false);
  };

  const filteredLocations = locationsData.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <>
      <TouchableOpacity onPress={() => setLocationModalVisible(true)} style={styles.locationInput}>
        <Text style={styles.selectedLocationText}>
          {selectedLocation || 'Select Location'}
        </Text>
        <Icon name="location-outline" size={20} color="#666" />
      </TouchableOpacity>
      <Modal visible={locationModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search location..."
                value={location}
                onChangeText={setLocation}
                style={styles.modalTextInput}
              />
              {location ? (
                <Pressable onPress={() => setLocation('')} style={styles.clearButton}>
                  <Icon name="close-circle" size={20} color="#666" />
                </Pressable>
              ) : null}
            </View>
            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleLocationSelect(item)} style={styles.locationItem}>
                  <Text style={styles.locationText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>No locations found</Text>
              }
            />
            <Pressable style={styles.closeButton} onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  selectedLocationText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  modalTextInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 5,
  },
  locationItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationInput;
