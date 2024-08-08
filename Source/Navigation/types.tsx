import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
export type RootStackParamList = {
  TabNavigation: undefined;
  EditAdScreen: { adId: string };
  ChatsScreen: undefined;
  AdChatScreen: { ad: Ad };
};
export type Ad = {  listingId: string;  title: string;  messages: AdMessage[];};
export type AdMessage = {  content: string;  fromUserId: string;  timestamp: string };
export type ChatsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatsScreen'>;
export type AdChatScreenRouteProp = RouteProp<RootStackParamList, 'AdChatScreen'>;
