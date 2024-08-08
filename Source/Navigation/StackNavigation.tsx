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

const Stack = createStackNavigator<RootStackParamList>();

const MyStack: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TabNavigation">
        <Stack.Screen  name="TabNavigation"  component={TabNavigation}  options={{ headerShown: false }}/>
        <Stack.Screen  name="EditAdScreen"   component={EditAdScreen}   options={{ title: 'Edit Ad', headerShown:false }}/>
        <Stack.Screen  name="AdChatScreen"   component={AdChatScreen}   options={{headerShown:true}}/>
        {/* <Stack.Screen  name="LoginScreen"   component={LoginScreen}   options={{headerShown:true}}/> */}
        <Stack.Screen  name="CreateAdScreen"   component={CreateAdScreen}   options={{headerShown:true}}/>
        <Stack.Screen name="ViewAdScreen" component={ViewAdScreen}  />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
