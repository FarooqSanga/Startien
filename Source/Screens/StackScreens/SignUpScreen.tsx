import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import 'react-native-gesture-handler';
import { FunctionComponent, useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Image,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';

type Props = {
  navigation: any;
}

const SignUpScreen: FunctionComponent<Props> = (props, { navigation }) => {
  useEffect(() => {
    StatusBar.setBackgroundColor('#20129D'); // Change status bar color
    return () => {
      StatusBar.setBackgroundColor('#20129D'); // Reset status bar color when unmounting
    };
  }, []);

  const navigateToLoginScreen = () => {
    props.navigation.replace("LoginScreen");
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailText = (text: string) => setEmail(text);
  const handlePassText = (text: string) => setPassword(text);

  const SignUp = (email: string, password: string) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        // const user = userCredential.user;
        // const token = await user.getIdToken();
        props.navigation.replace("CompleteProfileScreen");
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert('That email address is already in use!');

        } else if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        } else {
          console.error(error);
        }
      });
  }

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
          placeholder='Email...'
          onChangeText={handleEmailText}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder='Password...'
          secureTextEntry
          onChangeText={handlePassText}
          value={password}
        />
        <View style = {styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => SignUp(email, password)}>
          <Text style={styles.buttonText}>Sign Up Now</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>Already have an Account?</Text>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={navigateToLoginScreen}>
          <Text style={styles.buttonText}>Login Now</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}


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
    borderRadius: 20,
    paddingVertical:30,
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
  loginText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 14,
        color: '#20129D',
      },
  buttonContainer: {
    marginTop:10,
    paddingHorizontal:20
  }
});

export default SignUpScreen;
