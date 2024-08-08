// CreateAdScreen.tsx
import React, { FunctionComponent, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';

type Props = {
    navigation: any; // Replace with correct navigation type if available
    addNewAd: (newAd: any) => void; // Function to add new ad to data source
};

const CreateAdScreen: FunctionComponent<Props> = ({ navigation, addNewAd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    // Add more state variables for other ad details

    const handleAddAd = () => {
        // Perform validation if needed

        // Prepare new ad object
        const newAd = {
            title,
            description,
            price: parseFloat(price), // Assuming price is numeric
            // Add other ad details here
        };

        // Call function to add new ad
        addNewAd(newAd);

        // Show success message or navigate back
        Alert.alert('Success', 'Ad added successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={(text) => setTitle(text)}
                placeholder="Enter ad title"
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                value={description}
                onChangeText={(text) => setDescription(text)}
                placeholder="Enter ad description"
                multiline
            />

            <Text style={styles.label}>Price:</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={(text) => setPrice(text)}
                placeholder="Enter ad price"
                keyboardType="numeric"
            />

            {/* Add more input fields for other ad details */}

            <Button title="Add Ad" onPress={handleAddAd} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default CreateAdScreen;
