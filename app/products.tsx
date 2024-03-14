import { StyleSheet, Text, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AnimatedAcordion from "../components/accordion";
import { useEffect } from "react";
import { useSession } from '../services/ctx';
import { getArticles} from '../services/index'
import { PaperProvider } from 'react-native-paper';
import {
  Authenticator,
  useAuthenticator,
  withAuthenticator,
} from '@aws-amplify/ui-react-native';


function Products() {
  const { session, isLoading } = useSession();

  /*
  
  useEffect(()=>{
    getArticles()
  }, [])
  */


  return (
    <PaperProvider>
    <View style={styles.container}>
      <Text>123</Text>
    </View>
    </PaperProvider>
  );
}

export default withAuthenticator(Products);

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
