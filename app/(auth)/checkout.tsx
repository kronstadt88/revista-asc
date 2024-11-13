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
import { Button, DataTable, Chip, ActivityIndicator } from "react-native-paper";
import { products } from "../../constants/products";

import {
  initPaymentSheet,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import { paymentIntentRequest, getSubscription } from "../../services";
import { remove } from "aws-amplify/storage";
import { router } from "expo-router";

function Checkout() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [items, setItems] = useState<Array<any>>([]);
  
  const [availableProducts, setAvailableProducts] = useState<any>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>([]);

  const [loading, setLoading] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  

  let cartTotal = 0;

  useMemo(()=>{
    let itemsToCalculate = items.map(item=>item.price)
    cartTotal= itemsToCalculate.reduce((currentValue, acc)=> currentValue + acc, 0)
  }, [items])

  const getUserSubscription = async () =>{
    setLoading(true);
    let userSubscription: any = await getSubscription();
    setLoading(false);
    let available = products.filter(product=>{
      let currentSub = userSubscription.currentSubscriptions;
      
      let found = currentSub.find((item: any) => item ===product.id)
      return !found
    })
    setAvailableProducts(available);
    setCurrentSubscription(available);
  }


  useEffect(()=>{
    getUserSubscription();
  }, [])

  const addItemToTable = (selectedProduct: any) => {
    if(selectedProduct.id === "all"){
      setAvailableProducts([]);
      setItems([selectedProduct]);
      return;
    }else{
      let array = availableProducts.filter((product: any)=>{
        return product.id !== selectedProduct.id
      })
      setAvailableProducts(array)
      setItems([...items, selectedProduct]);
    }
    
  };

  const removeItemFromTable = (selectedProduct: any) => {

    if(selectedProduct.id === "all"){
      setItems([]);
      setAvailableProducts(currentSubscription)
      return
    }

    let productRemoved = products.find((product)=>{
      return product.id === selectedProduct.id
    })
    
    setAvailableProducts([...availableProducts, productRemoved]);

    let array = items.filter(item=>{
      return item.id !== selectedProduct.id
    })
    setItems(array);

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
    if(items.length===0){
      Alert.alert("Necesitas añadir alguna subscripción al carrito para continuar.")
      return;
    }
    
    setLoadingCheckout( true);
    
    try {
      const { ephemeralKey, customer, paymentIntent }: any =
        await fetchPaymentSheetParams();
        setLoadingCheckout( false );
        setCheckoutDone(true);
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Merchant",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,

        paymentIntentClientSecret: paymentIntent,
      });
    } catch (e) {
      Alert.alert("Error", "Ha ocurrido un error, por favor, contacta con el administrador." );
      console.log("error" + e);
      setLoadingCheckout( false );
    }
  };

  const openPaymentSheet = async () => {
    
    
      
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      router.push("/checkout")
      getUserSubscription();
    }
  };

  
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
              <DataTable.Title textStyle={{ color: "black" }}>
                {""}
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
                  <DataTable.Cell textStyle={{ color: "black" }}>
                  <Button mode="text" onPress={()=>removeItemFromTable(selectedProducts)}>
                    Quitar
                  </Button>
                    
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
              <DataTable.Cell textStyle={{ color: "black", fontSize: 20 }}>
              {""}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
        <View style={s.infoContainerChip}>
          <Text style={s.cartTitle}>Subscripciones disponibles</Text>
          {loading &&
            <ActivityIndicator style={s.loadingSpinner} size={'large'} animating={true} />
          }
          {!loading &&
            availableProducts.map((filteredProduct: any) => {
              return (
                <Chip
                  key={filteredProduct.key}
                  style={s.chip}
                  onPress={() => addItemToTable(filteredProduct)}
                >
                  {filteredProduct.name}
                </Chip>
              );
            })
          }
        </View>
        <View>
          {!checkoutDone &&
            <Button
            style={s.checkoutButton}
            mode="elevated"
            onPress={initializePaymentSheet}
          >
            {loadingCheckout &&
              <ActivityIndicator style={s.loadingSpinner} size={'small'} animating={true} />
            }
            {!loadingCheckout &&
              <Text>Checkout</Text>
            }
            
          </Button>
          }

          {checkoutDone &&
            <Button
            style={s.checkoutButton}
            mode="elevated"
            onPress={openPaymentSheet}
          >
            Pagar
          </Button>
          }
          
          
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
    height: "100%",
  },
  
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
  loadingSpinner:{
    margin: 20
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
