// src/screens/SplashScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Dimensions, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import NetInfo from '@react-native-community/netinfo';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: any;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useAuth(navigation);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connectionStatus = state.isConnected && state.isInternetReachable;
      setIsConnected(connectionStatus ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Platform.OS === 'android' ? StatusBar.setBackgroundColor('transparent') : StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('light-content');
  }, []);

  return (
    <LinearGradient
      colors={['#6200ea', '#3700b3']}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        source={require('../../Assets/Logo/startienlogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Startien</Text>
      <Text style={styles.subtitle}>Your Online Shopping Center</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: height * 0.3, 
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: width * 0.08, 
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  subtitle: {
    color: '#D1C4E9',
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Arial',
  },
});

export default SplashScreen;
