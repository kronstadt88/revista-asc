import { StyleSheet, Pressable , Text, View, TouchableOpacity} from 'react-native';
import { Link } from "expo-router";

export default function IndexScreen() {
  

  return (
    <View style={styles.container}>
      <Link href="/sign-in" asChild>
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/sign-up" asChild>
        <Pressable style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </Link>
      <Link href="/(tabs)/products" asChild>
        <Pressable style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Experimental Route - APP </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: 'bold',
  },
  innerText: {
    color: 'red',
  },
  buttonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    marginVertical:50,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: "70%"
  },
  buttonText: {
    
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});
