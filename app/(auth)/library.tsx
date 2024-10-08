import { StyleSheet, View } from "react-native";
import { PaperProvider } from 'react-native-paper';
import {
  withAuthenticator,
} from '@aws-amplify/ui-react-native';
import { Text } from 'react-native-paper';



function Products() {


  return (
    
      
        <View style={styles.container}>
          <Text>
          My Subscription
          </Text>
          
        </View>
      
    
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
