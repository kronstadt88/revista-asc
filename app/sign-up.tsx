// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import { StyleSheet, TextInput, View, Text, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';

import { Amplify } from 'aws-amplify';

import awsconfig from '../src/amplifyconfiguration.json';

import { useSession } from '../services/ctx';
import { signUp } from 'aws-amplify/auth';

import { confirmSignUp, type ConfirmSignUpInput } from 'aws-amplify/auth';

Amplify.configure(awsconfig);
//Auth.configure(awsconfig);

type SignUpParameters = {
  username: string;
  password: string;
  email: string;
};


const CreateUser = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userCode, setUserCode] = useState('');
  
  const emailInputRef = createRef();
  const ageInputRef = createRef();
  
  const passwordInputRef = createRef();

  //const { signIn } = useSession();

  const signUpToAws = async(username, password, email) =>{
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          
        }
      }});
  
      alert(userId);
    } catch (error) {
      alert('error signing up:'+ error);
    }
    /*try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email, // optional
          
        },
        autoSignIn: {
          // optional - enables auto sign in after user is confirmed
          enabled: true
        }
      });
      console.log(user);
    } catch (error) {
      console.log('error signing up:', error);
    }*/
  }

  async function handleSignUpConfirmation({
    username,
    confirmationCode
  }: ConfirmSignUpInput) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });
    } catch (error) {
      alert('error confirming sign up' + error);
    }
  }

  
  return (
    <View style={styles.container}>
      
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        
        <KeyboardAvoidingView enabled>
          <Text>After you register, please, confirm your account with an email that you will receive to your email.</Text>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current 
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current 
              
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current 
                
              }
              blurOnSubmit={false}
            />
          </View>
          
          
          
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            >
            <Text style={styles.buttonTextStyle} onPress={()=>signUpToAws( userName, userPassword,  userEmail)}>REGISTER</Text>
            
          
          </TouchableOpacity>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserCode(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Confirmation Code"
              placeholderTextColor="#8b9cb5"
              
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={() =>
                ageInputRef.current 
                
              }
              blurOnSubmit={false}
            />
           
            
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            >
              <Text style={styles.buttonTextStyle} onPress={()=>handleSignUpConfirmation({ username:userName, confirmationCode: userCode })}>Confirm User Creation</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default CreateUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#009688',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    backgroundColor:'white',
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});