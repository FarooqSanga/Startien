import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, setSearchQuery }) => (
  <View style={styles.searchContainer}>
    <TextInput
      placeholder="What are you looking for?"
      value={searchQuery}
      onChangeText={setSearchQuery}
      style={styles.searchInput}
    />
    <Icon name="search" size={20} style={styles.searchIcon} />
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
  },
  searchIcon: {
    marginLeft: 10,
  },
});

export default SearchInput;
