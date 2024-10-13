import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  ToastAndroid,
  TextInput,
  StatusBar,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
// import AvatarComponent from '../../Components/avatar';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
// import CustomAlert from '../../Components/customAlert';
// import CountriesList from './../../JSON/countriesList.json';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import BackButton from '../../Components/BackButton';


type Props = {
  navigation: any;
};

type UserData = {
  firstName: string;
  lastName: string;
  designation: string;
  gender: string;
  dob: string;
  selectedCountry: string;
  country: string;
  email: string;
  contact: string;
};

const CompleteProfileScreen: FunctionComponent<Props> = ({ navigation }) => {
  const [userID, setUserID] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    designation: '',
    gender: '',
    dob: '',
    selectedCountry: '',
    country: '',
    email: '',
    contact: '',
  });

//   const countries = CountriesList.map(country => ({
//     label: country.name,
//     value: country.name,
//   }));

  const saveDataLocally = async (data: UserData) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('userData', jsonValue);
    } catch (e) {
      console.error('Error saving data locally:', e);
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
    setDob(date.toISOString());  // Update date to ISO 8601 format before setting it
  };

  const currentUser = auth().currentUser;

  useEffect(() => {
    if (currentUser) {
      setUserID(currentUser.uid);
      setEmail(currentUser.email || 'Your Email Here');
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref(`users/${userID}`)
          .once('value');
        const data = snapshot.val();
        if (data) {
          setUserData(data);
        } else {
          console.log('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (userID) fetchUserData();
  }, [userID]);

  const [firstName, setFirstName] = useState<string>(userData.firstName);
  const [lastName, setLastName] = useState<string>(userData.lastName);
  const [designation, setDesignation] = useState<string>(userData.designation);
  const [country, setCountry] = useState<string>(userData.country);
  const [gender, setGender] = useState<string>(userData.gender || 'Male');
  const [dob, setDob] = useState<string>(userData.dob ? format(new Date(userData.dob), 'dd/MM/yyyy') : 'Select your DOB');
  const [email, setEmail] = useState<string>(userData.email || 'Your Email Here');
  const [contact, setContact] = useState<string>(userData.contact);
  const [selectedCountry, setSelectedCountry] = useState<string>(userData.selectedCountry);

  const saveProfile = () => {
    if (firstName && lastName && designation && dob && gender && contact) {
      database().ref(`users/${userID}`).set({
        uid: userID,
        firstName,
        lastName,
        designation,
        gender,
        dob: new Date(dob).toISOString(),  // Ensure the dob is in ISO format when saving
        selectedCountry,
        country,
        email,
        contact,
        role: 'user',
        profileCompleted: true,
      }).then(() => {
        ToastAndroid.show('Profile created successfully.', ToastAndroid.SHORT);
        saveDataLocally({
          firstName,
          lastName,
          designation,
          gender,
          dob: new Date(dob).toISOString(),  // Ensure the dob is in ISO format for local storage as well
          selectedCountry,
          country,
          email,
          contact,
        });
        navigation.replace('TabNavigation');
      }).catch(error => {
        console.error('Error adding profile: ', error);
        showAlert('Error', 'Failed to save profile. Please try again.');
      });
    } else {
      showAlert('Error', 'Please fill all the fields.');
    }
  };

  const handleExitButton = () => {
    auth().signOut()
      .then(() => {
        console.log('User signed out!');
        navigation.replace('LoginScreen');
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6200ea" barStyle="light-content" />
      <BackButton />

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {/* <AvatarComponent /> */}
        </View>
        <Text style={styles.completeProfileText}>Complete Your Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {[
          { label: 'First Name', value: firstName, setter: setFirstName, placeholder: 'Enter First Name' },
          { label: 'Surname', value: lastName, setter: setLastName, placeholder: 'Enter Surname' },
          { label: 'Role', value: designation, setter: setDesignation, placeholder: 'Enter your role' },
        ].map((field, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>{field.label}:</Text>
            <TextInput
              style={styles.input}
              onChangeText={field.setter}
              value={field.value}
              placeholder={field.placeholder}
            />
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender:</Text>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country:</Text>
          {/* <RNPickerSelect
            placeholder={{ label: 'Select a country', value: null }}
            items={countries}
            onValueChange={setSelectedCountry}
            style={pickerSelectStyles}
            value={selectedCountry}
          /> */}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          <TouchableOpacity onPress={togglePopup} style={styles.datePickerContainer}>
            <Text style={styles.datePicker}>{dob}</Text> 
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.input}>{email}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={setContact}
            value={contact}
            placeholder="Enter Contact Number"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.saveButton, styles.exitButton]} onPress={handleExitButton}>
          <Text style={styles.saveButtonText}>Exit</Text>
        </TouchableOpacity>

        {/* <CustomAlert
          visible={alertVisible}
          onClose={hideAlert}
          title={alertTitle}
          message={alertMessage}
          buttons={[
            { text: 'Cancel', onPress: hideAlert, color: 'gray' },
            { text: 'OK', onPress: hideAlert, color: 'blue' },
          ]}
        /> */}
      </ScrollView>

      <Modal
        visible={isPopupVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Date of Birth</Text>
            <DatePicker date={date} onDateChange={setDate} mode="date" />
            <TouchableOpacity style={styles.modalButton} onPress={togglePopup}>
              <Text style={styles.modalButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CompleteProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    height: 200,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  avatarContainer: {
    height: 80,
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'white',
  },
  completeProfileText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 24,
  },
  scrollView: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
  },
  datePickerContainer: {
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    padding: 12,
  },
  datePicker: {
    fontSize: 16,
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#6200ea',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  exitButton: {
    backgroundColor: '#ff9800',
    marginBottom: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#6200ea',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    width:140,
    textAlign:'center'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    color: 'black',
    backgroundColor: '#DDDDDD',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    color: 'black',
    backgroundColor: '#DDDDDD',
    paddingRight: 30,
  },
});
