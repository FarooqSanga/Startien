
import React from 'react';
import { View, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BackButton = () => {
    const navigation = useNavigation();
    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
            <TouchableOpacity onPress={handleBackPress} style={{}}>
                <Ionicons style={{width:50}} color={'white'} size={30} name={'arrow-back-circle-sharp'}  />
            </TouchableOpacity>
    );
};

export default BackButton;
