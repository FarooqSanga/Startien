import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type CityPickerProps = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
};

const CityPicker: React.FC<CityPickerProps> = ({ selectedCity, setSelectedCity, cities }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>City</Text>
      <Picker
        selectedValue={selectedCity}
        style={styles.input}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
      >
        {cities.map((city) => (
          <Picker.Item key={city} label={city} value={city} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: '5%',
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
    backgroundColor: '#fff',
    width: '100%',
    elevation: 2,
  },
});

export default CityPicker;
