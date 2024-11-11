import {
  StyleSheet,
  View,
  ImageBackground
} from "react-native";
import {  router } from "expo-router";
import { PaperProvider, Button} from "react-native-paper";

import { useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react-native";

import { Amplify } from "aws-amplify";
import awsconfig from "../amplifyconfiguration.json";


Amplify.configure(awsconfig);
import { useEffect } from "react";
import { getUser } from "../services";
import {save, getValueFor } from '../services/secureStore'

function IndexScreen() {

  async function getUserData(){
    let user:any = await getUser();
    
    await save("user", user.Items[0].id);
    await save("sub", user.Items[0].subscription);
    console.log("sub", await getValueFor("sub"))
    
  }

  useEffect(()=>{
    getUserData();
    
  },[])
 
  return (
    
      <View style={styles.container}>
        
        <ImageBackground source={require('../assets/images/chart.jpg')} resizeMode="cover" style={styles.image}>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => router.push("/products")}
          >
            Empezar
          </Button>
        </ImageBackground>


        

        
      </View>
    
  );
}

export default withAuthenticator(IndexScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: "white",
    margin: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
  },
});
