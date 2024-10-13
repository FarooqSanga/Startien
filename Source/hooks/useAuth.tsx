// src/hooks/useAuth.ts

import { useEffect } from 'react';
import { auth } from '../config/firebaseConfig';

export const useAuth = (navigation: any) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const currentUser = auth().currentUser;

      if (currentUser) {
        navigation.replace('TabNavigation');
      } else {
        navigation.replace('LoginScreen');
      }
    };

    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);
};
