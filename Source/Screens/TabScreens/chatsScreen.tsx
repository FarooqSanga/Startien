import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import jsonData from './../../JSON/adData.json';
import { Ad, ChatsScreenNavigationProp } from './../../Navigation/types';

const ChatsScreen = () => {
  const [ads] = useState<Ad[]>(jsonData.ads);
  const navigation = useNavigation<ChatsScreenNavigationProp>();

  const renderChatItem = ({ item }: { item: Ad }) => (
    <Pressable 
      style={styles.chatItem} 
      android_ripple={{ color: '#DDDDDD' }}
      onPress={() => navigation.navigate('AdChatScreen', { ad: item })}
    >
      <View style={styles.avatarPlaceholder} />
      <View style={styles.chatInfo}>
        <View style={styles.row}>
          <Text style={styles.chatTitle}>{item.title}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.messages[0].timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
          </Text>
        </View>
        <Text style={styles.senderName}>{item.messages[0].fromUserId}</Text>
        <Text style={styles.lastMessage} numberOfLines={2}>{item.messages[0].content}</Text>
      </View>
      <TouchableOpacity style={styles.optionsButton}>
        <FontAwesome name="ellipsis-v" size={24} color="#999999" />
      </TouchableOpacity>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ads}
        keyExtractor={(item) => item.listingId}
        renderItem={renderChatItem}
        showsVerticalScrollIndicator={false}
      />
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
  lastMessage: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#999999',
  },
  optionsButton: {
    marginLeft: 16,
  },
});

export default ChatsScreen;
