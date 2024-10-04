import {
  StyleSheet,
  Pressable,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { PaperProvider, MD3DarkTheme as DefaultTheme, } from "react-native-paper";
import { Button } from "react-native-paper";
import {
  useAuthenticator,
  Authenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react-native";


import { Amplify } from "aws-amplify";
import awsconfig from "../src/amplifyconfiguration.json";

import { signIn, type SignInInput } from "aws-amplify/auth";
import { DarkTheme } from "@react-navigation/native";
Amplify.configure(awsconfig);

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button onPress={signOut}>Sign Out </Button>;
}

const theme = {
  ...DarkTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  
};

function IndexScreen() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => router.push("/payment")}
        >
          Payment
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
