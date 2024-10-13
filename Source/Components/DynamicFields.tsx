import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type DynamicFieldsProps = {
  category: string | null;
  dynamicFields: { [key: string]: string };
  setDynamicFields: (fields: React.SetStateAction<{ [key: string]: string }>) => void;
  categoryProperties: { [key: string]: { [key: string]: { type: 'text' | 'dropdown'; options?: string[] } } };
};

const DynamicFields: React.FC<DynamicFieldsProps> = ({ category, dynamicFields, setDynamicFields, categoryProperties }) => {
  if (!category) return null;

  const properties = categoryProperties[category] || {};
  return (
    <>
      {Object.entries(properties).map(([key, prop]) => (
        <View key={key} style={styles.propertyContainer}>
          <Text style={styles.title}>{key}</Text>
          {prop.type === 'text' ? (
            <TextInput
              style={styles.input}
              placeholder={`Enter ${key}`}
              value={dynamicFields[key] || ''}
              onChangeText={(text) => setDynamicFields((prev) => ({ ...prev, [key]: text }))}
            />
          ) : (
            <Picker
              selectedValue={dynamicFields[key] || ''}
              style={styles.input}
              onValueChange={(itemValue) => setDynamicFields((prev) => ({ ...prev, [key]: itemValue }))}
            >
              {prop.options?.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          )}
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
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
  propertyContainer: {
    marginBottom: '5%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '2%',
    color: '#333',
  },
});

export default DynamicFields;
