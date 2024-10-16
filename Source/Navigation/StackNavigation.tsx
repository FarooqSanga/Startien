import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EditAdScreen from '../Screens/StackScreens/EditAdScreen';
import TabNavigation from './TabNavigation';
import { RootStackParamList } from './types';
import AdChatScreen from '../Screens/StackScreens/AdChatScreen';
// import LoginScreen from '../Screens/StackScreens/LoginScreen';
import CreateAdScreen from '../Screens/StackScreens/CreateAdScreen';
import ViewAdScreen from '../Screens/StackScreens/viewAdScreen';
import SplashScreen from '../Screens/StackScreens/SplashScreen';
import { faL } from '@fortawesome/free-solid-svg-icons';
import LoginScreen from '../Screens/StackScreens/LoginScreen';
import SignUpScreen from '../Screens/StackScreens/SignUpScreen';
import CompleteProfileScreen from '../Screens/StackScreens/CompleteProfileScreen';
import ProfileScreen from '../Screens/StackScreens/profileScreen';
import ChatsScreen from '../Screens/TabScreens/chatsScreen';
import FilterAdsScreen from '../Screens/StackScreens/FilterAdsScreen';
import SavedAdsScreen from '../Screens/StackScreens/savedAdsScreen';
import MyShopDetailScreen from '../Screens/StackScreens/myShopScreen';
import MarketListScreen from '../Screens/TabScreens/marketScreen';
import ShopDetailScreen from '../Screens/StackScreens/shopDetailsScreen';
import PrivacyScreen from '../Screens/StackScreens/PrivacyScreen';
import TermsAndConditionsScreen from '../Screens/StackScreens/TermsAndConditionsScreen';
// import { PrivacyScreen, TermsAndConditionsScreen } from '../Screens/StackScreens/PrivacyScreen';
// import ViewEditProfileScreen from '../Screens/StackScreens/ViewEditProfileScreen';

const Stack = createStackNavigator<RootStackParamList>();

const MyStack: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options = {{headerShown: false}} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen  name="TabNavigation"  component={TabNavigation}  options={{ headerShown: false }}/>
        <Stack.Screen  name="EditAdScreen"   component={EditAdScreen}   options={{ title: 'Edit Ad', headerShown:false }}/>
        <Stack.Screen  name="AdChatScreen"   component={AdChatScreen}   options={{headerShown:false}}/>
        {/* <Stack.Screen  name="LoginScreen"   component={LoginScreen}   options={{headerShown:true}}/> */}
        <Stack.Screen  name="CreateAdScreen"   component={CreateAdScreen}   options={{headerShown:false}}/>
        <Stack.Screen name="ViewAdScreen" component={ViewAdScreen}  options={{headerShown:false}}/>
        <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen}  options={{headerShown:false}}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen}  options={{headerShown:false}}/>
        <Stack.Screen name="ChatsScreen" component={ChatsScreen}  options={{headerShown:false}}/>
        <Stack.Screen name="FilterAdsScreen" component={FilterAdsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="SavedAdsScreen" component={SavedAdsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MyShopDetailScreen" component={MyShopDetailScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MarketListScreen" component={MarketListScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ShopDetailScreen" component={ShopDetailScreen} options={{headerShown:false}}/>
        <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} options={{headerShown:false}}/>
        <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} options={{headerShown:false}}/>


        
        
        

        


        {/* <Stack.Screen name="ViewEditProfileScreen" component={ViewEditProfileScreen}  options={{headerShown:false}}/> */}

        
        


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
