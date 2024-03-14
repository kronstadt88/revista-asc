import { StyleSheet, Pressable , Text, View, TouchableOpacity} from 'react-native';
import { Link, router } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { Button } from 'react-native-paper';
import {
  useAuthenticator,
  withAuthenticator,
} from '@aws-amplify/ui-react-native';

import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);
Auth.configure(awsconfig);



function IndexScreen() {
  const { user, signOut } = useAuthenticator();

  return (
    
    <PaperProvider>
      <View style={styles.container}>
      
      <Button style={styles.button}  mode="contained" onPress={() => router.push('/sign-in')}>
        Sign In
      </Button>

      <Button style={styles.button} mode="contained" onPress={() => Auth.signOut()}>
        Sign Up
      </Button>

      <Button style={styles.button}  mode="contained" onPress={() => router.push('/products')}>
        Open Products
      </Button>

      <Button style={styles.button}  mode="contained" onPress={() => router.push('/article/eurusd')}>
        Open Articles s
      </Button>
      <Text>{`Welcome, ${user}!`}</Text>
      
    </View>
    </PaperProvider>
    
  );
}

export default withAuthenticator(IndexScreen)

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
