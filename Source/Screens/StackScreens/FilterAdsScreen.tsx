import React, { FunctionComponent } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView from react-native-safe-area-context
import FilterAdsComponent from '../../Components/FilterAdsComponent';

type Props = {
  route: any;
  navigation: any;
};

const FilterAdsScreen: FunctionComponent<Props> = ({ route, navigation }) => {
  const { category } = route.params;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6200ea" />
      <SafeAreaView style={styles.container}>
        <FilterAdsComponent category={category} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default FilterAdsScreen;