import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Header: React.FC = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>Startien</Text>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#20129D',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Header;
