import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { format, isYesterday, isToday } from 'date-fns';
import CustomStatusBar from '../../Components/customStatusBar';
import NoInternetConnection from '../../Components/noInternetConnection';
import NetInfo from '@react-native-community/netinfo';

interface Chat {
  id: string;
  title: string;
  createdBy: string;
  creatorName: string | null;
  timestamp: number;
  unread: boolean;
  featuredImage?: string;
}

type Props = {
  navigation: any;
};

const ChatsScreen: FunctionComponent<Props> = ({ navigation }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userID, setUserID] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isScreenRefreshing, setIsScreenRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connectionStatus = state.isConnected && state.isInternetReachable;
      setIsConnected(connectionStatus ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        setUserID(currentUser.uid);
      } else {
        console.log('No user logged in');
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    fetchChats();
  }, [userID]);

  const fetchChats = async () => {
    if (!userID) {
      console.error('Error: User ID is not available');
      return;
    }
  
    const userChatsRef = database().ref(`users/${userID}/chats`);
    userChatsRef.on('value', async (snapshot) => {
      if (!snapshot.exists()) {
        console.log('No chats found for the user');
        setChats([]);
        setLoading(false);
        return;
      }
  
      const chatIDs = Object.keys(snapshot.val()); // Get all chat IDs for this user
      const chatsRef = database().ref('chats');
  
      try {
        const chatsSnapshot = await chatsRef.once('value');
        const data = chatsSnapshot.val() || {};
  
        const userChats = chatIDs
          .map((chatId) => ({ id: chatId, ...data[chatId] }))
          .filter((chat) => chat.members && chat.members[userID]);
  
        setChats(userChats); // Update the state with the user's chats
        setLoading(false);
        console.log('Fetched chats:', userChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    });
  };
  const formatChatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'p');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'P');
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <Pressable
      style={styles.chatItem}
      android_ripple={{ color: '#DDDDDD' }}
      onPress={() => navigation.navigate('AdChatScreen', { chatId: item.id })}
    >
      {item.featuredImage ? (
        <Image source={{ uri: item.featuredImage }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <View style={styles.chatInfo}>
        <View style={styles.row}>
          <Text style={styles.chatTitle}>{item.title}</Text>
          <Text style={styles.messageTime}>{formatChatTime(item.timestamp)}</Text>
        </View>
        <Text style={styles.senderName}>
          {item.createdBy === userID ? '(Created by me)' : `Created by ${item.creatorName || 'Unknown User'}`}
        </Text>
      </View>
      <TouchableOpacity style={styles.optionsButton}>
        <FontAwesome name="ellipsis-v" size={24} color="#999999" />
      </TouchableOpacity>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (chats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {!isConnected && <NoInternetConnection onRetry={() => setIsScreenRefreshing(true)} />}
        {isConnected && !isScreenRefreshing && (
          <>
            <Text style={styles.emptyText}>No Chats available</Text>
            <Text style={[styles.emptyText, { color: 'darkgrey', marginTop: 30 }]}>
              Go to Home Screen and Report a Problem to Start Chat
            </Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isConnected && <NoInternetConnection onRetry={() => setIsScreenRefreshing(true)} />}
      {isConnected && !isScreenRefreshing && (
        <>
          <CustomStatusBar backgroundColor="#6200ea" barStyle="light-content" />
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#bdbdbd',
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333333',
  },
  senderName: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#999999',
  },
  optionsButton: {
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
});

export default ChatsScreen;