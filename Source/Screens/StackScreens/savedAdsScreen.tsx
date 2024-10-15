import React, { FunctionComponent, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, StatusBar } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AdCard from '../../Components/adCardComponent'; // Assuming this is the path to your AdCard component

type Props = {
    navigation:any
}
const SavedAdsScreen:FunctionComponent<Props> = ({navigation}) => {
  const [savedAds, setSavedAds] = useState<any[]>([]); // State to hold the saved ads
  const [loading, setLoading] = useState(true); // State to handle loading

  const userID = auth().currentUser?.uid; // Get the current user's ID

  useEffect(() => {
    if (!userID) {
      setLoading(false);
      return; // Ensure the user is logged in
    }

    const fetchSavedAds = async () => {
      try {
        const savedAdsRef = database().ref(`users/${userID}/savedAds`);

        savedAdsRef.on('value', async (snapshot) => {
          if (snapshot.exists()) {
            const savedAdsIDs = Object.keys(snapshot.val()); // Get the list of saved ad IDs
            const fetchedAds: any[] = [];

            // Fetch details of each saved ad by its ID
            for (const adID of savedAdsIDs) {
              const adRef = database().ref(`adsCollection/${adID}`);
              const adSnapshot = await adRef.once('value');
              if (adSnapshot.exists()) {
                fetchedAds.push({ id: adID, ...adSnapshot.val() }); // Collect full ad details
              }
            }

            setSavedAds(fetchedAds); // Set the fetched ads in state
          } else {
            setSavedAds([]); // No saved ads
          }
        });
      } catch (error) {
        console.error("Error fetching saved ads:", error);
      } finally {
        setLoading(false); // End loading after fetching
      }
    };

    fetchSavedAds();

    // Clean up the Firebase listener on unmount
    return () => database().ref(`users/${userID}/savedAds`).off('value');
  }, [userID]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading saved ads...</Text>
      </View>
    );
  }

  return (
    <>
    <StatusBar />
    <View style={styles.container}>
      {savedAds.length === 0 ? (
        <Text style={styles.noAdsText}>You have no saved ads.</Text>
      ) : (
        <FlatList
          data={savedAds} // Render saved ads
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AdCard ad={item} />} // Use the AdCard component
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:60,
    backgroundColor: '#fff',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAdsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default SavedAdsScreen;