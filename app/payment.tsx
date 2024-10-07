
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";

import {
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";


import { withAuthenticator } from "@aws-amplify/ui-react-native";
import { paymentIntentRequest } from "../services/index";

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    { id: "1", name: "Alerta judiada", price: 123 },
  ]);

  const fetchPaymentSheetParams = async () => {
    

    try {
      const response: any = await paymentIntentRequest(123, "usd");
      
      const { paymentIntent, ephemeralKey, customerId, sub } = await response.body.json();
      
    return {
      paymentIntent: paymentIntent,
      ephemeralKey,
      customer: customerId,
      sub
    };


    } catch (e) {
      console.log("An error has ocurred.");
    }

    
  };

  const initializePaymentSheet = async () => {
    
    try {
      const { paymentIntent, ephemeralKey, customer, sub } : any= await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Merchant",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        //paymentIntentClientSecret: paymentIntent,
        paymentIntentClientSecret: sub.latest_invoice.payment_intent.client_secret,
      });

      if (!error) {
        setLoading(true);
      }
    } catch (e) {
      console.log("error"+ e);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  return (
    <View style={styles.mainContainer}>
      
      <StripeProvider
        publishableKey="pk_test_51OthaURvdA3t4SZBMnop8NP6tXvOpDv4hJYO7S8eHSAIsmG5BYCHigKirpZt7hkTLfYipw7sO5pxXkNd5GlyIQUH00fRJkpcR7"
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.myapp" // required for Apple Pay
      >
        <View style={styles.mainContainer}>
          <View style={styles.boxedContainer}>
            <View style={styles.cartContainer}>
              <Text style={styles.headingText}>Your Cart</Text>
            </View>
            
            <View style={styles.checkoutAreaContainer}>
              <TouchableOpacity
                disabled={!loading}
                onPress={openPaymentSheet}
                style={styles.checkoutButton}
              >
                <Text style={styles.checkoutText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </StripeProvider>
    </View>
  );
};
export default withAuthenticator(PaymentScreen);

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "gray",
  },
  boxedContainer: {
    width: "80%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: "#9c333c",
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    alignItems: "center",
    paddingVertical: 8,
  },
  image: { width: 80, height: 40 },
  row: {
    flexGrow: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  checkoutButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    backgroundColor: "#db0d48",
  },
  headingText: { fontSize: 24, color: "white" },
  cartItemText: { fontSize: 16, color: "black" },
  divider: { marginLeft: 16 },
  checkoutAreaContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  checkoutText: { fontSize: 16, color: "white" },
  cartContainer: { marginVertical: 8 },
});

/*


import { StyleSheet, Pressable , Text, View, TouchableOpacity} from 'react-native';
import { Link, router } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { Button } from 'react-native-paper';
import {
  withAuthenticator
} from '@aws-amplify/ui-react-native';

import { paymentIntent } from '../services';
import { useEffect } from 'react';



function IndexScreen() {

  useEffect(()=>{
    paymentIntent
    paymentIntent(123, 'usd')
  },[])

  return (
    
      <PaperProvider>
      <View style={styles.container}>
      
      <Button style={styles.button}  mode="contained" onPress={() => router.push('/sign-in')}>
        Sign In
      </Button>

      <Button style={styles.button} mode="contained" onPress={() => router.push('/payment')}>
        Payment
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

export default withAuthenticator(IndexScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
    flex: 1
  },
  button: {
    margin: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
  }
  
});

*/