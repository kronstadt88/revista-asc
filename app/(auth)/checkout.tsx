import { withAuthenticator } from "@aws-amplify/ui-react-native";
import { useState, useEffect, useMemo } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, DataTable, Chip } from "react-native-paper";
import { products } from "../../constants/products";

import {
  initPaymentSheet,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import { paymentIntentRequest, postUser } from "../../services";
import { getValueFor, save } from "../../services/secureStore";

function Checkout() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [items, setItems] = useState<Array<any>>([]);
  const [subscribed, setSubscribed] = useState();
  const [allProducts, setAllProducts] = useState(products);
  const [availableProducts, setAvailableProducts] = useState<any>()
  

  let cartTotal = 0;

  useMemo(()=>{
    let itemsToCalculate = items.map(item=>item.price)
    cartTotal= itemsToCalculate.reduce((currentValue, acc)=> currentValue + acc, 0)
  }, [items])


  useMemo(async ()=>{
    let subscription:any = await getValueFor("sub");
    setSubscribed(subscription);

    let array = products.filter(product=>{
      return subscription.includes(product.id)
      
    })
    
    setAvailableProducts(array)

  }, [])

  const setBaseSubscription = async () =>{
    let subscription:any = await getValueFor("sub");
    setSubscribed(subscription);
    console.log("SET BASE")
    console.log(allProducts)

    console.log(subscription)
    
    let array = allProducts.filter(product=> subscription.includes(product.id))

    console.log("avaiie", array)

    
  }


  useEffect(()=>{
    console.log("useEffect ")
    
    setBaseSubscription();
  }, )

  const addItemToTable = (product: any) => {
    if(product.id === "all"){
      setItems([product]);
      return;
    }
    setItems([...items, product]);
  };

  const removeItemFromTable = (e:any) => {
    const name = e.target.getAttribute("name")
    setItems(l => l.filter(item => item.name !== name));
  };

  const fetchPaymentSheetParams = async () => {
    
    try {
      let sub = items.map(product=>product.id)
      const response: any = await paymentIntentRequest(sub);
      const { paymentIntent, ephemeralKey, customerId } =
        await response.body.json();

      return {
        paymentIntent: paymentIntent,
        ephemeralKey,
        customer: customerId,
      };
    } catch (e) {
      console.log("An error has ocurred.");
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const { ephemeralKey, customer, paymentIntent }: any =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Merchant",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,

        paymentIntentClientSecret: paymentIntent,
      });
    } catch (e) {
      console.log("error" + e);
    }
  };

  const openPaymentSheet = async () => {
    
    
      
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      let currentSub: any = await getValueFor("sub");
      let addToSub = items.map(product=>product.id).join(",");
      let updatedSub = currentSub.concat(addToSub).concat(",")
      
      Alert.alert("Success", "Your order is confirmed!");
      await save("sub", updatedSub)
      await postUser(updatedSub)
    }
  };

  useEffect(() => {}, []);

  return (
    <ScrollView contentContainerStyle={s.container}>
      <StripeProvider
        publishableKey="pk_test_51OthaURvdA3t4SZBMnop8NP6tXvOpDv4hJYO7S8eHSAIsmG5BYCHigKirpZt7hkTLfYipw7sO5pxXkNd5GlyIQUH00fRJkpcR7"
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.myapp" // required for Apple Pay
      >
        <View style={s.infoContainer}>
          <Text style={s.cartTitle}> Mi Carrito</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                style={s.productTable}
                textStyle={{ color: "black" }}
              >
                Producto
              </DataTable.Title>
              <DataTable.Title textStyle={{ color: "black" }}>
                Precio
              </DataTable.Title>
            </DataTable.Header>
            {items.map((selectedProducts) => {
              return (
                <DataTable.Row key={selectedProducts.key}>
                  <DataTable.Cell
                    style={s.productTable}
                    textStyle={{ color: "black" }}
                  >
                    <Text>{selectedProducts.description}</Text>
                    
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={{ color: "black" }}>
                    <Text>{selectedProducts.price} €</Text> 
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}

            <DataTable.Row>
              <DataTable.Cell
                style={s.totalTable}
                textStyle={{ color: "black" }}
              >
                Total
              </DataTable.Cell>

              <DataTable.Cell textStyle={{ color: "black", fontSize: 20 }}>
                <Text>{cartTotal} €</Text> 
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
        <View style={s.infoContainerChip}>
          <Text style={s.cartTitle}>Subscripciones disponibles</Text>
          {allProducts.map((filteredProduct) => {
            return (
              <Chip
                key={filteredProduct.key}
                style={s.chip}
                onPress={() => addItemToTable(filteredProduct)}
              >
                {filteredProduct.name}
              </Chip>
            );
          })}
        </View>

        <View style={s.cartCheckoutContainer}>
          <Button
            style={s.checkoutButton}
            mode="elevated"
            onPress={initializePaymentSheet}
          >
            Checkout
          </Button>
          <Button
            style={s.checkoutButton}
            mode="elevated"
            onPress={openPaymentSheet}
          >
            Pagar
          </Button>
        </View>
      </StripeProvider>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",

    margin: 10,
  },
  container: {
    flex: 0,
    backgroundColor: "#e5dedd",
    alignContent: "center",
  },
  cartCheckoutContainer: {},
  checkoutButton: {
    borderRadius: 0,
    margin: 20,
    padding: 20,
  },
  productTable: {
    flex: 3,
  },
  totalTable: {
    flex: 3,
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
  infoContainerChip: {
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
