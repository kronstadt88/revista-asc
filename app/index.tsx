import {
  StyleSheet,
  
  View,
} from "react-native";
import {  router } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { Button } from "react-native-paper";
import {
  useAuthenticator,
  Authenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react-native";

import { Amplify } from "aws-amplify";
import awsconfig from "../src/amplifyconfiguration.json";


Amplify.configure(awsconfig);
import { useEffect } from "react";
import { getUser } from "../services";
import {save } from '../services/secureStore'


function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button onPress={signOut}>Sign Out </Button>;
}

function IndexScreen() {

  async function getUserData(){
    let user:any = await getUser();
    
    await save("user", user.Items[0].id);
    await save("sub", user.Items[0].subscription);
    
    
  }

  useEffect(()=>{
    getUserData()
  },[])
 
  return (
    
    <PaperProvider>
      <View style={styles.container}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => router.push("/payment")}
        >
          Payment
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => router.push("/checkout/forex")}
        >
          Checkout
        </Button>

        <SignOutButton />

        <Button
          style={styles.button}
          mode="contained"
          onPress={() => router.push("/products")}
        >
          Open Products
        </Button>

        <Button
          style={styles.button}
          mode="contained"
          onPress={() => router.push("/article/eurusd")}
        >
          Open Articles
        </Button>
      </View>
    </PaperProvider>
    
  );
}

export default withAuthenticator(IndexScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  button: {
    margin: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
  },
});
