// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, createRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

//import { StripeProvider, CardForm, CardField } from '@stripe/stripe-react-native';
import { useSession } from '../services/ctx';



import { Amplify} from 'aws-amplify';
import awsconfig from '../src/amplifyconfiguration.json';
Amplify.configure(awsconfig);



type SignInParameters = {
  username: string;
  password: string;
};


export async function signIn({ username, password }: SignInParameters) {
  try {
    //await Auth.signIn(username, password);
  } catch (error) {
    console.log('error signing in', error);
  }
}



const PaymentScreen = () => {
  

  /*return (
    <View style={styles.container}>
      <Text>12333</Text>
      <StripeProvider
      publishableKey="pk_test_51OthaURvdA3t4SZBMnop8NP6tXvOpDv4hJYO7S8eHSAIsmG5BYCHigKirpZt7hkTLfYipw7sO5pxXkNd5GlyIQUH00fRJkpcR7"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.myapp" // required for Apple Pay
    >
      <CardField></CardField>
      <CardForm style={{height: 200}}/>
      
    </StripeProvider>
    </View>
  );*/
};
export default PaymentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#009688",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#317d0c",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    backgroundColor:'white',
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  registerTextStyle: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});
