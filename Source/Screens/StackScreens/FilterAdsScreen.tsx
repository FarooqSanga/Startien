import React, { FunctionComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import FilterAdsComponent from '../../Components/FilterAdsComponent';

type Props = {
  route: any;
  navigation: any;
};

const FilterAdsScreen: FunctionComponent<Props> = ({ route, navigation }) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <FilterAdsComponent category={category} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default FilterAdsScreen;
