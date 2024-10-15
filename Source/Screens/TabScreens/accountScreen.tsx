import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; // Import FontAwesomeIcon
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icon for chevron
import {
  faUser,
  faCog,
  faHeart,
  faUsers,
  faShieldAlt,
  faQuestionCircle,
  faSignOutAlt,
  faBookmark,  // Icon for Saved Ads
  faStore,     // Icon for Shop (New for Manage My Shop)
} from '@fortawesome/free-solid-svg-icons'; // Import other FontAwesome icons as needed
import { getAuth, signOut } from '@react-native-firebase/auth';
import CustomStatusBar from '../../Components/customStatusBar';

type Props = {
  navigation: any;
};

const AccountScreen: React.FC<Props> = ({ navigation }) => {
  const auth = getAuth();

  const handleProfilePress = async () => {
    navigation.navigate("ProfileScreen");
  };

  const handleSavedAdsPress = async () => {
    navigation.navigate("SavedAdsScreen");
  };

  const handleManageShopPress = async () => {
    navigation.navigate("MyShopDetailScreen"); // This will navigate to MyShopScreen
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  // Define menu items dynamically with FontAwesome icons
  const menuItems = [
    { title: 'My Name', icon: faUser },
    { title: 'View and edit profile', icon: faCog, onPress: handleProfilePress },
    { title: 'Favorites & Saved searches', icon: faHeart },
    { title: 'Saved Ads', icon: faBookmark, onPress: handleSavedAdsPress }, // New "Saved Ads" item
    { title: 'Manage My Shop', icon: faStore, onPress: handleManageShopPress }, // "Manage My Shop" added here
    { title: 'Public Profile', icon: faUsers },
    { title: 'Settings', icon: faCog },
    { title: 'Privacy and manage account', icon: faShieldAlt },
    { title: 'Help and Support', icon: faQuestionCircle },
    { title: 'Logout', icon: faSignOutAlt, onPress: handleLogout }, // Add the handleLogout function here
  ];

  // Render each menu item
  const renderMenuItem = (title: string, icon: any, onPress: () => void) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <FontAwesomeIcon icon={icon} size={24} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
        <FontAwesomeIcon icon={faChevronRight} size={18} color="#888" />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <CustomStatusBar backgroundColor="#6200ea" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {renderMenuItem(item.title, item.icon, item.onPress || (() => {}))}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: 24,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
});

export default AccountScreen;