import React, { FunctionComponent, useEffect, useState, useRef, useCallback } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary, ImagePickerResponse, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';
import NoInternetConnection from '../../Components/noInternetConnection'; 
import NetInfo from '@react-native-community/netinfo';

interface AdMessage {
  content: string;
  fromUserId: string;
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  messages: AdMessage[];
  sellerInfo: {
    name: string;
    profilePicture: string;
  };
}

interface Message {
  text?: string;
  imageUrl?: string;
  sender: string;
  timestamp: number;
  unread?: boolean; 
}

type AdChatScreenRouteProp = RouteProp<{ AdChatScreen: { chatId: string } }, 'AdChatScreen'>;

const AdChatScreen: FunctionComponent = () => {
  const route = useRoute<AdChatScreenRouteProp>();
  const navigation = useNavigation();
  const { chatId } = route.params; // Ensure the route params have type
  const [chatData, setChatData] = useState<Chat | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const messagesRef = database().ref(`chats/${chatId}/messages`);
  const flatListRef = useRef<FlatList<Message> | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isScreenRefreshing, setIsScreenRefreshing] = useState<boolean>(false);

  const handleRetry = () => {
    setIsScreenRefreshing(true);
    setTimeout(() => {
      setIsScreenRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connectionStatus = state.isConnected && state.isInternetReachable;
      setIsConnected(connectionStatus ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chatRef = database().ref(`chats/${chatId}`);
        chatRef.on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setChatData(data);
          }
        });
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const cachedMessages = await AsyncStorage.getItem(`messages_${chatId}`);
        const loadedMessages: Message[] = cachedMessages ? JSON.parse(cachedMessages) : [];
        setMessages(loadedMessages);
  
        const user: FirebaseAuthTypes.User | null = auth().currentUser;
        if (user) {
          setUserID(user.uid);
  
          const initialSnapshot: FirebaseDatabaseTypes.DataSnapshot = await messagesRef.once('value');
          const initialMessages: Message[] = [];
          initialSnapshot.forEach(snapshot => {
            const message = snapshot.val();
            const lastMessageTimestamp = loadedMessages.length > 0 ? loadedMessages[0].timestamp : 0;
            if (message.timestamp > lastMessageTimestamp) {
              initialMessages.push(message);
            }
            return true;
          });
  
          const combinedMessages = [...initialMessages.reverse(), ...loadedMessages];
          setMessages(combinedMessages);
          await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(combinedMessages));
  
          messagesRef.on('child_added', snapshot => {
            const newMessage: Message = snapshot.val();
            setMessages(prevMessages => {
              const messageExists = prevMessages.some(
                msg => msg.timestamp === newMessage.timestamp && msg.sender === newMessage.sender
              );
              if (!messageExists) {
                const lastMessageTimestamp = prevMessages.length > 0 ? prevMessages[0].timestamp : 0;
                if (newMessage.timestamp > lastMessageTimestamp) {
                  const updatedMessages = [newMessage, ...prevMessages];
                  AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));
                  return updatedMessages;
                }
              }
              return prevMessages;
            });
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  
    return () => {
      messagesRef.off();
    };
  }, [chatId]);

  useEffect(() => {
    if (chatData) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            
            {chatData.sellerInfo && chatData.sellerInfo.profilePicture ? (
              <Image source={{ uri: chatData.sellerInfo.profilePicture }} style={styles.headerImage} />
            ) : (
              <View style={styles.headerImagePlaceholder} />
            )}
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{chatData.title}</Text>
              <Text style={styles.headerSubtitle}>{chatData.sellerInfo ? chatData.sellerInfo.name : 'Unknown Seller'}</Text>
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
    }
  }, [navigation, chatData]);

  const markMessagesAsRead = async () => {
    if (messages.length > 0 && userID) {
      const lastMessage = messages[0];
      if (lastMessage.sender !== userID) {
        // Mark the chat as read in Firebase
        await database().ref(`chats/${chatId}`).update({ unread: false });

        // Update the unread status for the specific message
        const messageRef = database().ref(`chats/${chatId}/messages`);
        messageRef
          .orderByChild('timestamp')
          .equalTo(lastMessage.timestamp)
          .once('value', snapshot => {
            snapshot.forEach(child => {
              child.ref.update({ unread: false });
              return true;
            });
          });
      }
    }
  };

  useEffect(() => {
    markMessagesAsRead();
  }, [messages, userID, chatId]);

  const sendMessage = async (messageData: Message): Promise<void> => {
    if (userID) {
      try {
        await messagesRef.push({ ...messageData, sender: userID, unread: true });
        await database().ref(`chats/${chatId}`).update({ 
          timestamp: messageData.timestamp,
          unread: true
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      const fileName = uri.substring(uri.lastIndexOf('/') + 1);
      const reference = storage().ref(fileName);
      await reference.putFile(uri);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  const requestPermission = async (permission: Permission): Promise<boolean> => {
    try {
      const result = await check(permission);
      if (result !== RESULTS.GRANTED) {
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const handleImageAction = async (action: 'library' | 'camera'): Promise<void> => {
    if (userID) {
      const permissionGranted = await (action === 'camera'
        ? requestPermission(PERMISSIONS.ANDROID.CAMERA)
        : requestPermission(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE as Permission)) ||
        (await requestPermission(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES as Permission));

      if (!permissionGranted) {
        Alert.alert('Permission Denied', 'You need to grant permission to access this feature.');
        return;
      }

      const options: ImageLibraryOptions | CameraOptions = { mediaType: 'photo' };
      const result: ImagePickerResponse = action === 'library' ? await launchImageLibrary(options) : await launchCamera(options);

      if (result.assets && result.assets.length > 0) {
        const imageUri: string = result.assets[0].uri as string;
        const localMessage: Message = { imageUrl: imageUri, sender: userID, timestamp: Date.now(), unread: true };
        setMessages([localMessage, ...messages]);

        const downloadUrl = await uploadImage(imageUri);
        if (downloadUrl) {
          setMessages(prevMessages =>
            prevMessages.map(msg => (msg.timestamp === localMessage.timestamp ? { ...msg, imageUrl: downloadUrl } : msg))
          );
          await sendMessage({ ...localMessage, imageUrl: downloadUrl });
        }
      }
    }
  };

  const handleSendTextMessage = (): void => {
    if (newMessage.trim() && userID) {
      sendMessage({ text: newMessage, sender: userID, timestamp: Date.now(), unread: true });
    }
  };

  const handleImagePress = (imageUrl: string): void => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      const isSender = item.sender === userID;
  
      if (!isSender && item.unread) {
        const messageRef = database().ref(`chats/${chatId}/messages`);
        messageRef
          .orderByChild('timestamp')
          .equalTo(item.timestamp)
          .once('value', snapshot => {
            snapshot.forEach(child => {
              child.ref.update({ unread: false });
              return true;
            });
          });
      }
  
      return (
        <View style={[styles.messageContainer, isSender ? styles.sentMessage : styles.receivedMessage]}>
          {item.imageUrl ? (
            <TouchableOpacity onPress={() => handleImagePress(item.imageUrl!)}>
              <Image source={{ uri: item.imageUrl }} style={styles.imageMessage} />
            </TouchableOpacity>
          ) : (
            <Text style={styles.messageText}>{item.text}</Text>
          )}
          <Text style={styles.timestamp}>{moment(item.timestamp).fromNow()}</Text>
        </View>
      );
    },
    [userID, chatId]
  );

  return (
    <View style={styles.container}>
      {!isConnected && <NoInternetConnection onRetry={handleRetry} />}
      {isConnected && !isScreenRefreshing && (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            inverted
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message"
              multiline
            />
            <TouchableOpacity onPress={() => handleImageAction('library')} style={styles.iconButton}>
              <Icon name="photo-library" size={30} color="#6200ee" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImageAction('camera')} style={styles.iconButton}>
              <Icon name="camera-alt" size={30} color="#6200ee" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSendTextMessage} style={styles.iconButton}>
              <Icon name="send" size={30} color="#6200ee" />
            </TouchableOpacity>
          </View>
          {selectedImage && (
            <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </Modal>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  header: { 
    // backgroundColor: '#6200ea', 
    paddingTop: 0, 
    paddingHorizontal: 10, 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  avatar: { 
    width: 38, 
    height: 38, 
    borderRadius: 50, 
    backgroundColor: '#F0F4F8', 
    borderWidth: 2, 
    borderColor: 'white' 
  },
  chatTitle: { 
    marginLeft: 18, 
    color: 'white', 
    fontSize: 22, 
    fontWeight: '500' 
  },
  messageContainer: { 
    marginVertical: 5, 
    marginHorizontal: 15, 
    maxWidth: '75%', 
    borderRadius: 12, 
    padding: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 2 
  },
  messageText: { 
    fontSize: 16, 
    color: '#333' 
  },
  sentMessage: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#e1ffc7' 
  },
  receivedMessage: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#f2f2f2' 
  },
  timestamp: { 
    fontSize: 12, 
    color: '#888', 
    alignSelf: 'flex-end', 
    marginTop: 5 
  },
  imageMessage: { 
    width: 200, 
    height: 200, 
    borderRadius: 12 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    backgroundColor: '#f2f2f2', 
    borderTopWidth: 1, 
    borderTopColor: '#ddd' 
  },
  textInput: { 
    flex: 1, 
    fontSize: 16, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    backgroundColor: '#fff', 
    borderRadius: 25, 
    marginHorizontal: 10 
  },
  iconButton: { 
    padding: 10 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.8)' 
  },
  fullImage: { 
    width: '90%', 
    height: '100%', 
    resizeMode: 'contain' 
  },
  closeButton: { 
    position: 'absolute', 
    top: 30, 
    right: 30, 
    padding: 6, 
    borderWidth: 2, 
    borderColor: '#fff', 
    borderRadius: 50, 
    zIndex: 1 
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 10
  },
  headerImagePlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginRight: 10
  },
  headerTextContainer: {
    flexDirection: 'column'
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14
  },
  backButton: {
    padding: 10
  },
});

// export default AdChatScreen;


export default AdChatScreen;
