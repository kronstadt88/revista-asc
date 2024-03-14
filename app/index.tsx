import { StyleSheet, Pressable , Text, View, TouchableOpacity} from 'react-native';
import { Link, router } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { Button } from 'react-native-paper';
import {
  useAuthenticator,
  Authenticator
} from '@aws-amplify/ui-react-native';

import { Amplify} from 'aws-amplify';
import awsconfig from '../src/amplifyconfiguration.json';

import { signIn, type SignInInput } from 'aws-amplify/auth';
Amplify.configure(awsconfig);


function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button onPress={signOut}>Sign Out </Button>;
}


function IndexScreen() {

  return (
    <Authenticator.Provider>
      <Authenticator
        services={{
          handleSignIn: ({ username, password, options }: SignInInput) =>
            signIn({
              username: username,
              password: password,
              options: { authFlowType: "USER_PASSWORD_AUTH" } 
              
            }),
        }}>

    
      <PaperProvider>
      <View style={styles.container}>
      
      <Button style={styles.button}  mode="contained" onPress={() => router.push('/sign-in')}>
        Sign In
      </Button>

      <Button style={styles.button} mode="contained" onPress={() => router.push('/sign-in')}>
        Sign Up
      </Button>

      <SignOutButton/>

      <Button style={styles.button}  mode="contained" onPress={() => router.push('/products')}>
        Open Products
      </Button>

      <Button style={styles.button}  mode="contained" onPress={() => router.push('/article/eurusd')}>
        Open Articles s
      </Button>
      
      
    </View>
    </PaperProvider>
    </Authenticator>
    </Authenticator.Provider>
    
    
  );
}

export default IndexScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
    flex: 1
  },
  button: {
    margin: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
  }
  
});
