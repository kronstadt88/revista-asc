import { StyleSheet, Text, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AnimatedAcordion from "../../components/accordion";


export default function Products() {
  
  return (
    <View style={styles.container}>
      <AnimatedAcordion/>
    </View>
  );
}

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
