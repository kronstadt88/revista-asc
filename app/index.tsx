import { StyleSheet, Pressable , Text, View, TouchableOpacity} from 'react-native';
import { Link, router } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { Button } from 'react-native-paper';

export default function IndexScreen() {
  

  return (
    <PaperProvider>
      <View style={styles.container}>
      
      <Button style={styles.button}  mode="contained" onPress={() => router.push('/sign-in')}>
        Sign In
      </Button>

      <Button style={styles.button} mode="contained" onPress={() => router.push('/sign-up')}>
        Sign Up
      </Button>

      <Button style={styles.button}  mode="contained" onPress={() => router.push('/products')}>
        Open Products
      </Button>

      <Button style={styles.button}  mode="contained" onPress={() => router.push('/article/eurusd')}>
        Open Articles
      </Button>
      
    </View>
    </PaperProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
  }
  
});
