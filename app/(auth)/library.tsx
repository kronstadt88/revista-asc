import { withAuthenticator } from "@aws-amplify/ui-react-native";

import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  
  View,
} from "react-native";

import { Button, Card, Text, Portal, Modal, } from "react-native-paper";
import { books } from "../../constants/books";

import {
  initPaymentSheet,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import { paymentIntentRequestLibrary,  } from "../../services";
import { router } from "expo-router";
import { useEffect, useState } from "react";


function Checkout() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();  
  const [availableBooks, setBooks] = useState<Array<any>>([]);
  const [visible, setVisible] = useState(false);

  const [shippingAddress, setShippingAddress] = useState()

  const showModal = (book) => {
    setVisible(true);
  }
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  useEffect(()=>{
    setBooks(books)
  }, [])



  const fetchPaymentSheetParams = async () => {
    
    try {
      const response: any = await paymentIntentRequestLibrary();
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
      Alert.alert("Error", "Ha ocurrido un error, por favor, contacta con el administrador." );
      console.log("error" + e);
    
    }
  };

  const openPaymentSheet = async () => {
    
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Éxito", "Tu pedido se ha realizado");
      router.push("/products")
    }
  };

  
  return (
    <ScrollView style={s.container}>
      <StripeProvider
        publishableKey="pk_test_51OthaURvdA3t4SZBMnop8NP6tXvOpDv4hJYO7S8eHSAIsmG5BYCHigKirpZt7hkTLfYipw7sO5pxXkNd5GlyIQUH00fRJkpcR7"
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.myapp" // required for Apple Pay
      >
        <View style={s.infoContainer}>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <Text variant="titleLarge">Tu pedido se enviará a la dirección: </Text>
            <Text variant="bodyMedium">Body Medium</Text>

            <Button
              style={s.checkoutButton}
              mode="elevated"
              onPress={openPaymentSheet}
            >
            Pagar
          </Button>
            
          </Modal>
        </Portal>
          {availableBooks.map((selectedProducts:any, index: any) => {
            return (
              <View key={index} style={s.infoContainer}>
                <Card style={s.cardContent}>
                  <Card.Content >
                    <Text  variant="titleLarge">{selectedProducts.book}</Text>
                    <Text variant="titleLarge">Precio: {selectedProducts.price} €</Text>
                  </Card.Content>
                  
                  <Card.Cover  source={ require("../../assets/images/libro-asi-se-gana-dinero-en-bolsa_1.jpg") } />
                  <Card.Actions >
                    <Button onPress={()=>showModal(selectedProducts.id)}>Comprar</Button>
                  </Card.Actions>
                  </Card>
                  
                  
              </View>
              
            );
          })}
        </View>
      </StripeProvider>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#e5dedd",
    alignContent: "center",
  },
  checkoutButton: {
    borderRadius: 0,
    margin: 20,
    padding: 20,
  },
  infoContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  cardContent:{
    backgroundColor: "white"
  }
});
export default withAuthenticator(Checkout);
