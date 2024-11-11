import { StyleSheet, View, Text } from "react-native";
import {
  useAuthenticator,
  withAuthenticator,
} from '@aws-amplify/ui-react-native';
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { getValueFor } from "../../services/secureStore";



function Profile() {

  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [sub, setSub] = useState();

  const setSubscription = async()=>{
    let subscriptions = await getValueFor("sub");
    setSub(sub)
  }
  
  useEffect(()=>{
    console.log("user", user);
    setSubscription();
    
  })


  return (
    
      
        <View style={styles.container}>
          <Button mode="contained" onPress={signOut}>Cerrar sesión</Button>
          <Text>My Subscription</Text>
          <Text>{user.userId}</Text>
          
        </View>
      
    
  );
}

export default withAuthenticator(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignContent: "center",
  },
  row: {
    
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
  shopIcon:{
    
  }
});
