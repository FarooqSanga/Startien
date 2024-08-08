import React, { FunctionComponent, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 

type AdMessage = {
  content: string;
  fromUserId: string;
  timestamp: string;
};

type Ad = {
  listingId: string;
  title: string;
  messages: AdMessage[];
  sellerInfo: {
    name: string;
    profilePicture: string;
  };
};

type AdChatScreenRouteProp = RouteProp<{ AdChatScreen: { ad: Ad } }, 'AdChatScreen'>;

const AdChatScreen: FunctionComponent = () => {
  const route = useRoute<AdChatScreenRouteProp>();
  const navigation = useNavigation();
  const { ad } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image source={{ uri: ad.sellerInfo.profilePicture }} style={styles.headerImage} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{ad.title}</Text>
            <Text style={styles.headerSubtitle}>{ad.sellerInfo.name}</Text>
          </View>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="caret-left" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#075E54',
      },
      headerTintColor: 'white',
    });
  }, [navigation, ad.title, ad.sellerInfo]);

  const renderMessageItem = ({ item }: { item: AdMessage }) => {
    const isSent = item.fromUserId === 'u4'; // Replace 'u4' with the current user's ID

    return (
      <View style={[styles.messageContainer, isSent ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageDetails}>
          {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ad.messages}
        keyExtractor={(item) => item.timestamp}
        renderItem={renderMessageItem}
        inverted // To start from the bottom
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
    padding: 8,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  sentMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  receivedMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },
  messageDetails: {
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
    textAlign: 'right',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#D3D3D3',
  },
  backButton: {
    paddingHorizontal: 10,
  },
});

export default AdChatScreen;
