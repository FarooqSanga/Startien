import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../Screens/TabScreens/homeScreen';
import ChatsScreen from '../Screens/TabScreens/chatsScreen';
import MyAdsScreen from '../Screens/TabScreens/myAdsScreen';
import AccountScreen from '../Screens/TabScreens/accountScreen';
import CreateAdScreen from '../Screens/StackScreens/CreateAdScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
type Props = {
  navigation: any;
};
const CustomListButton = () => (
  <Pressable>
    <View style={styles.customButton}>
      
    </View>
  </Pressable>
);

const TabNavigation:FunctionComponent<Props> = ({}) => {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === 'Chats') {
            iconName = 'chat';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'My Ads') {
            iconName = 'th-list';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === 'Account') {
            iconName = 'user';
            return <FontAwesome name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
          marginTop: -5,
          marginBottom: 15
        },
        tabBarStyle: {
          height: 80,
          paddingBottom: 5,
          paddingHorizontal: 10,
          backgroundColor: "#FFFFFF",
        },
        tabBarIconStyle: {
          width: 50,
          maxHeight: 35,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      {/* <Tab.Screen
        name="List"
        component={CreateAdScreen}
        options={{
          tabBarButton: (props) => (
            <Pressable style= {{backgroundColor:''}} onPress={() => props.navigation.navigate('CreateAdScreen')}>
              <Ionicons name="add" size={30} color="#fff" />
            </Pressable>
          ),
        }}
      /> */}
      <Tab.Screen name="My Ads" component={MyAdsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 55,
    height:55,
    borderRadius: 35,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default TabNavigation;
