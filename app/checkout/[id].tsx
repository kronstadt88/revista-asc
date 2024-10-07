import { withAuthenticator } from "@aws-amplify/ui-react-native";
import { useState, useEffect } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, DataTable } from "react-native-paper";
import {save, getValueFor} from '../../services/secureStore';
import { useLocalSearchParams } from "expo-router";

function Checkout() {

  const item = useLocalSearchParams();

  const [items] = useState([
    {
      key: 1,
      name: "Subscripción mensual - Forex",
      calories: "10€ / mes",
      
    },
    {
      key: 2,
      name: "Eclair",
      calories: "10€ / mes",
      
    }
    
  ]);

  

  useEffect(() => {
    
  }, []);

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View>
        <Text style={s.cartTitle}> My Cart</Text>
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

          {items.map((item) => (
            <DataTable.Row key={item.key}>
              <DataTable.Cell style={s.productTable} textStyle={{ color: "black" }}>
                {item.name}
              </DataTable.Cell>
              <DataTable.Cell textStyle={{ color: "black" }}>
                {item.calories}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
          <DataTable.Row>
            <DataTable.Cell style={s.totalTable} textStyle={{ color: "black" }}>Total</DataTable.Cell>
            
            <DataTable.Cell textStyle={{ color: "black" }}>
              153.53 €
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
      <View style={s.cartCheckoutContainer}>
        <Button
          style={s.checkoutButton}
          mode="elevated"
          onPress={() => console.log("Pressed")}
        >
          Checkout
        </Button>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#e5dedd",
    alignContent: "center",
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