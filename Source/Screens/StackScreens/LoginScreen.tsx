import React, { FunctionComponent, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

type Props = {
  navigation: any;
};

const LoginScreen: FunctionComponent<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Email Error', 'Email cannot be empty');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Password Error', 'Password cannot be empty');
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.replace('TabNavigation');
      })
      .catch(error => {
        let errorMessage = 'Login failed. Please try again.';

        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'That email address is already in use!';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address!';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Invalid password. Please try again.';
        }

        Alert.alert('Login Error', errorMessage);
      });
  };

  const handlePasswordReset = () => {
    if (!email.trim()) {
      Alert.alert('Password Reset Error', 'Please enter your email to reset password');
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
      })
      .catch(error => {
        let errorMessage = 'Failed to send password reset email.';

        if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address!';
        } else if (error.code === 'auth/user-not-found') {
          errorMessage = 'No user found with this email address!';
        }

        Alert.alert('Password Reset Error', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6200ea'} />
      <View style={styles.content}>
        <Image
          source={require('../../Assets/Logo/startienlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Startien</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email..."
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity onPress={handlePasswordReset}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login Now</Text>
          </TouchableOpacity>
          <Text style={styles.secondaryText}>Don't have an Account?</Text>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.replace('SignUpScreen')}>
            <Text style={styles.buttonText}>Sign Up Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: '50%',
    height: undefined,
    aspectRatio: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ea',
    marginTop: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingVertical: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    backgroundColor: '#EFEFEF',
    borderRadius: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6200ea',
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#707070',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 14,
    color: '#20129D',
  },
  buttonContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  forgotPasswordText: {
    color: '#6200ea',
    textAlign: 'right',
    marginBottom: 15,
    fontSize: 14,
  },
});

export default LoginScreen;