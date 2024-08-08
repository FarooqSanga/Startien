import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; // Import FontAwesomeIcon
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icon for chevron
import {
  faUser,
  faCog,
  faHeart,
  faFileAlt,
  faUsers,
  faEye,
  faTags,
  faMoneyBillAlt,
  faReceipt,
  faBox,
  faLocationArrow,
  faShieldAlt,
  faQuestionCircle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'; // Import other FontAwesome icons as needed

const AccountScreen: React.FC = () => {
  // Define menu items dynamically with FontAwesome icons
  const menuItems = [
    { title: 'My Name', icon: faUser },
    { title: 'View and edit profile', icon: faCog },
    { title: 'Favorites & Saved searches', icon: faHeart },
    // { title: 'All of your favorite ads & saved filters', icon: faFileAlt },
    { title: 'Public Profile', icon: faUsers },
    // { title: 'See how others view your profile', icon: faEye },
    // { title: 'Buy Discounted Packages', icon: faTags },
    // { title: 'Sell faster, more & at higher margins with packages', icon: faMoneyBillAlt },
    // { title: 'Orders and Billing Info', icon: faReceipt },
    // { title: 'Orders, billing and invoices', icon: faBox },
    // { title: 'Delivery Orders', icon: faLocationArrow },
    // { title: 'Track your selling or buying delivery orders', icon: faLocationArrow },
    { title: 'Settings', icon: faCog },
    { title: 'Privacy and manage account', icon: faShieldAlt },
    { title: 'Help and Support', icon: faQuestionCircle },
    { title: 'Logout', icon: faSignOutAlt },
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
    <ScrollView contentContainerStyle={styles.container}>
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          {renderMenuItem(item.title, item.icon, () => {})}
        </React.Fragment>
      ))}
    </ScrollView>
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
