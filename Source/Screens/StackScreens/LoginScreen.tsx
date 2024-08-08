// import React, { FunctionComponent, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// // import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
// // import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

// // GoogleSignin.configure({
// //   webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
// // });

// type Props = {
//     navigation: any;
//   };
// const LoginScreen: FunctionComponent<Props> = ({ navigation }) => {
//   const [emailOrMobile, setEmailOrMobile] = useState('');
//   const [password, setPassword] = useState('');

//   const handleEmailLogin = () => {
//     // Handle email or mobile login
//     Alert.alert('Login', `Logged in with email/mobile: ${emailOrMobile}`);
//   };

// //   const handleGoogleLogin = async () => {
// //     try {
// //       await GoogleSignin.hasPlayServices();
// //       const userInfo = await GoogleSignin.signIn();
// //       Alert.alert('Login', `Logged in with Google: ${userInfo.user.email}`);
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   const handleFacebookLogin = async () => {
// //     try {
// //       const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
// //       if (result.isCancelled) {
// //         Alert.alert('Login cancelled');
// //       } else {
// //         const data = await AccessToken.getCurrentAccessToken();
// //         if (!data) {
// //           Alert.alert('Something went wrong obtaining the access token');
// //         } else {
// //           Alert.alert('Login', `Logged in with Facebook: ${data.accessToken.toString()}`);
// //         }
// //       }
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

//   return (
//     <View style={styles.container}>
//       {/* <Image source={require('./path/to/logo.png')} style={styles.logo} /> */}
//       <Text style={styles.title}>Welcome Back</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email or Mobile"
//         value={emailOrMobile}
//         onChangeText={setEmailOrMobile}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         autoCapitalize="none"
//       />
//       <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin}>
//         <Text style={styles.loginButtonText}>Login</Text>
//       </TouchableOpacity>
//       <Text style={styles.orText}>or login with</Text>
//       <View style={styles.socialButtonsContainer}>
//         {/* <GoogleSigninButton
//           style={styles.googleButton}
//           size={GoogleSigninButton.Size.Wide}
//           color={GoogleSigninButton.Color.Dark}
//         //   onPress={            handleGoogleLogin        }
//         /> */}
//         <TouchableOpacity style={styles.facebookButton} 
//         // onPress={handleFacebookLogin}
//         >
//           <Text style={styles.facebookButtonText}>Login with Facebook</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     height: 50,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   loginButton: {
//     height: 50,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   loginButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   orText: {
//     textAlign: 'center',
//     marginVertical: 10,
//     color: '#888',
//   },
//   socialButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   googleButton: {
//     width: '48%',
//     height: 50,
//   },
//   facebookButton: {
//     width: '48%',
//     height: 50,
//     backgroundColor: '#3b5998',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   facebookButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;
