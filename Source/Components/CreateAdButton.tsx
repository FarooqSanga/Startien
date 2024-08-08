// FloatingButton.tsx
import React, { FunctionComponent } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
type Props = {
    navigation: any;
  };
const CreateAdButton:FunctionComponent<Props> = ({ navigation }) => {
//   const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => navigation.navigate('CreateAdScreen')}
    >
      <Ionicons name="add" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    floatingButton: {
    position: 'absolute',
    // display:'flex',
    flex:1,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default CreateAdButton;
