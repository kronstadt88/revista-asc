import { StyleSheet, View } from "react-native";
import AnimatedAcordion from "../../components/accordion";
import { PaperProvider } from 'react-native-paper';
import {
  withAuthenticator,
} from '@aws-amplify/ui-react-native';



function Products() {


  return (
    
      <PaperProvider>
        <View style={styles.container}>
          <AnimatedAcordion/>
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
