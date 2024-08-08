import React, { useState } from 'react';
import { Modal, TextInput, FlatList, TouchableOpacity, View, Text, Button, StyleSheet } from 'react-native';
import locationsData from './../JSON/locations.json';

interface LocationInputProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ selectedLocation, setSelectedLocation }) => {
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [location, setLocation] = useState('');

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setLocationModalVisible(false);
  };

  const filteredLocations = locationsData.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <>
      <TouchableOpacity onPress={() => setLocationModalVisible(true)} style={styles.locationInput}>
        <Text>{selectedLocation || 'Select Location'}</Text>
      </TouchableOpacity>
      <Modal visible={locationModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Search location..."
            value={location}
            onChangeText={setLocation}
            style={styles.modalTextInput}
          />
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleLocationSelect(item)}>
                <Text style={styles.locationItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Close" onPress={() => setLocationModalVisible(false)} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  locationInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTextInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  locationItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
});

export default LocationInput;
