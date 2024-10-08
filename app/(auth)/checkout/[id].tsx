import { withAuthenticator } from "@aws-amplify/ui-react-native";
import { useState, useEffect } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, DataTable, Chip } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { products } from "../../../constants/products";

import {
  initPaymentSheet,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import { paymentIntentRequest } from "../../../services";

function Checkout() {

  const routeParams = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState({key:"", price:"", description:""})

  const fetchPaymentSheetParams = async () => {
    
    try {
      const response: any = await paymentIntentRequest(10, "eur");
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
      const { ephemeralKey, customer, clientSecret } : any= await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Nuevo Gesmovasa",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
      });

      if (!error) {
        setLoading(true);
      }
    } catch (e) {
      console.log("error"+ e);
    }
  };

  useEffect(() => {
    let product: any = products.find(product=>product.id === routeParams.id )
    setItem(product)
    
  }, []);

  const openPaymentSheet = async () => {

    await initializePaymentSheet();

    setTimeout(async ()=>{
      
    const { error } = await presentPaymentSheet();
    
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert("Success", "Your order is confirmed!");
      }
    }, 500)

  };

  

  useEffect(() => {
    
  }, []);

  return (
    <StripeProvider
        publishableKey="pk_test_51OthaURvdA3t4SZBMnop8NP6tXvOpDv4hJYO7S8eHSAIsmG5BYCHigKirpZt7hkTLfYipw7sO5pxXkNd5GlyIQUH00fRJkpcR7"
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.myapp" // required for Apple Pay
      >
    <ScrollView contentContainerStyle={s.container}>
      <View>
        <Text style={s.cartTitle}> Mi Carrito</Text>
      </View>

      <View style={s.infoContainer}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={s.productTable} textStyle={{ color: "black" }}>
              Producto
            </DataTable.Title>
            <DataTable.Title textStyle={{ color: "black" }}>
              Precio
            </DataTable.Title>
            
          </DataTable.Header>          
            <DataTable.Row key={item.key}>
              <DataTable.Cell style={s.productTable} textStyle={{ color: "black" }}>
                {item.description}
              </DataTable.Cell>
              <DataTable.Cell textStyle={{ color: "black" }}>
                {item.price} €
              </DataTable.Cell>
            </DataTable.Row>
          
          <DataTable.Row>
            <DataTable.Cell style={s.totalTable} textStyle={{ color: "black" }}>Total</DataTable.Cell>
            
            <DataTable.Cell textStyle={{ color: "black", fontSize:20 }}>
            {item.price} €
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
      <View style={s.subscriptions}>
        <View><Text>Subscripciones disponibles</Text>

        </View>
        <View><Text>Subscripciones disponibles</Text></View>
      </View>
      <View style={s.cartCheckoutContainer}>
        <Button
          style={s.checkoutButton}
          mode="elevated"
          onPress={openPaymentSheet}
        >
          Checkout
        </Button>
      </View>
    </ScrollView>
    </StripeProvider>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#e5dedd",
    alignContent: "center",
  },
  subscriptions:{

  },
  cartCheckoutContainer: {},
  checkoutButton: {
    borderRadius: 0,
    margin: 20,
    padding: 20,
  },
  productTable:{
    flex: 3
  },
  totalTable:{
    flex: 3
  },
  cartTitle: {
    textAlign: "center",
    justifyContent: "center",
  },
  dataTableText: {
    color: "black",
  },
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  
  infoContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    
    borderRadius: 5,
  },
  info: {
    fontFamily: Platform.select({
      ios: "Courier",
      android: "monospace",
      web: "monospace",
    }),
  },
});
export default withAuthenticator(Checkout);