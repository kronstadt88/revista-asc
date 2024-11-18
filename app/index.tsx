import {
  StyleSheet,
  View,
  ImageBackground
} from "react-native";
import { router } from "expo-router";
import { Button} from "react-native-paper";

import { withAuthenticator } from "@aws-amplify/ui-react-native";

function IndexScreen() {
  
 
  return (
    
      <View style={styles.container}>
        
        <ImageBackground source={require('../assets/images/chart.jpg')} resizeMode="cover" style={styles.image}>
          <Button
            style={styles.button}
            mode="outlined"
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
