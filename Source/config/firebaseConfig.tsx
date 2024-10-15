// src/config/firebaseConfig.ts

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC_I3lG6JSSEcmWKPm4w7yc5_v54th_mhc",
  authDomain: "startien-classified.firebaseapp.com",
  databaseURL: "https://startien-classified-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "startien-classified",
  storageBucket: "startien-classified.appspot.com",
  messagingSenderId: "678562136700",
  appId: "1:678562136700:web:3fdf26d26b208c8a9bfff9",
  measurementId: "G-2YZQPKWQH0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, auth, database };
