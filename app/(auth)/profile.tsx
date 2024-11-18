import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { Text, TextInput } from "react-native-paper";
import {
  useAuthenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react-native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Button, Chip, Divider } from "react-native-paper";

import { deleteSubscription, getCustomer, getSubscription, putCustomer } from "../../services";

import { useFocusEffect } from "@react-navigation/native";
import { getValueFor, save } from "../../services/secureStore";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any>([]);
  const [customer, setCustomer] = useState<any>({
    
  })
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  useFocusEffect(
    useCallback(() => {
      getUserSubscription();
      getCustomerDetails();
      return () => {
        setAvailableProducts([]);
      };
    }, [])
  );

  const getUserSubscription = async () => {

    setLoading(true);
    let userSubscription: any = await getSubscription();
    setLoading(false);
    setAvailableProducts(userSubscription.groupedSubscriptions);
  };

  const getCustomerDetails = async () =>{
    let customerRetrieved: any = await getCustomer();

    customerRetrieved = customerRetrieved.customer;

    setCustomer({
      id: customerRetrieved.id,
      name: customerRetrieved.name,
      lastname: customerRetrieved.lastname,
      email: customerRetrieved.email,
      phone: customerRetrieved.phone,
      line1: customerRetrieved.address.line1,
      postalCode: customerRetrieved.address.postal_code,
      city: customerRetrieved.address.city,
      country: customerRetrieved.address.country,
      shippingAddressLine1: customerRetrieved.shipping.address.line1,
      shippingAddressCity: customerRetrieved.shipping.address.city,
      shippingAddressPostalCode: customerRetrieved.shipping.address.postal_code,
      shippingAddressCountry: customerRetrieved.shipping.address.country,
    })
    console.log( "customer", customerRetrieved)
  }

  const updateCustomerDetails = async ()=>{
    console.log("inside customer")
    if(customer.shippingAddressLine1 === "" || customer.shippingAddressLine1 === null || customer.shippingAddressLine1 === undefined ){
      Alert.alert("El campo dirección de envío no puede estar vacío");
      return;
    }
    if(customer.shippingAddressCity === "" || customer.shippingAddressCity === null || customer.shippingAddressCity === undefined ){
      Alert.alert("El campo ciudad de envío no puede estar vacío");
      return;
    }
    if(customer.shippingAddressPostalCode === "" || customer.shippingAddressPostalCode === null || customer.shippingAddressPostalCode === undefined ){
      Alert.alert("El campo código postal de envío no puede estar vacío");
      return;
    }
    if(customer.shippingAddressCountry === "" || customer.shippingAddressCountry === null || customer.shippingAddressCountry === undefined ){
      Alert.alert("El campo país de envío no puede estar vacío");
      return;
    }
    if(customer.line1 === "" || customer.line1 === null || customer.line1 === undefined ){
      Alert.alert(" El campo dirección no puede estar vacío");
      return;
    }
    if(customer.postalCode === "" || customer.postalCode === null || customer.postalCode === undefined ){
      Alert.alert("El campo código postal no puede estar vacío");
      return;
    }
    if(customer.city === "" || customer.city === null || customer.city === undefined ){
      Alert.alert("El campo ciudad no puede estar vacío");
      return;
    }
    if(customer.country === "" || customer.country === null || customer.country === undefined ){
      Alert.alert("El campo país no puede estar vacío");
      return;
    }
    try {
      await putCustomer(customer);
      await getCustomerDetails()
      Alert.alert("Los datos han sido guardados.")
    }catch (e){
      console.log(e);
      Alert.alert("Ocurrió un error al guardar los datos.")
    }
    
    

  }

  const showCancelPrompt = (product: any) => {
    Alert.alert(
      "Cancelar subscripción",
      "Cancelando esta subscripción se perderá el acceso a los artículos correspondientes. ¿Desea continuar?",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Aceptar",
          onPress: () => unsubscribe(product),
          style: "cancel",
        },
      ]
    );
  };

  const unsubscribe = async (product: any) => {
    console.log("unsubscribe");
    setLoading(true);
    await deleteSubscription(product);

    await getUserSubscription();
    Alert.alert("La subscripción se ha cancelado.");
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.infoContainer}>
        <Text style={s.textMarginBottom20} variant="headlineMedium">
          Datos personales
      
        </Text>
        
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Nombre"
          value={customer.name}
          disabled={true}
        />
        
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Email"
          disabled={true}
          value={customer.email}
        />
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Teléfono"
          value={customer.phone}
          disabled={true}
        />
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Dirección"
          value={customer.line1}
          onChangeText={text => setCustomer({...customer, line1:text})}
        />
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Código postal"
          value={customer.postalCode}
          onChangeText={text => setCustomer({...customer, postalCode:text})}
        />
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Ciudad"
          value={customer.city}
          onChangeText={text => setCustomer({...customer, city:text})}
        />
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="País"
          value={customer.country}
          onChangeText={text => setCustomer({...customer, country:text})}
        />

        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Dirección para envíos"
          value={customer.shippingAddressLine1}
          onChangeText={text => setCustomer({...customer, shippingAddressLine1:text})}
        />
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Código postal para envíos"
          value={customer.shippingAddressPostalCode}
          onChangeText={text => setCustomer({...customer, shippingAddressPostalCode:text})}
        />
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="Ciudad de envío"
          value={customer.shippingAddressCity}
          onChangeText={text => setCustomer({...customer, shippingAddressCity:text})}
        />
        <TextInput
          mode="outlined"
          style={s.formInput}
          label="País de envío"
          value={customer.shippingAddressCountry}
          onChangeText={text => setCustomer({...customer, shippingAddressCountry:text})}
        />
        <Button mode="outlined" onPress={updateCustomerDetails}>
          Actualizar datos
        </Button>
      </View>

      <View style={s.infoContainer}>
        <Text style={s.textMarginBottom20} variant="headlineMedium">
          Subscripciones activas
        </Text>
        {loading && (
          <ActivityIndicator
            style={s.spinner}
            size={"large"}
            animating={true}
          />
        )}
        {!loading && availableProducts.length === 0 && (
          <Text variant="bodyMedium">
            {" "}
            No tienes ninguna subscripción activa{" "}
          </Text>
        )}
        {!loading &&
          availableProducts.map((filteredProduct: any, index: any) => {
            return (
              <View style={s.subContainer} key={index}>
                <Text variant="bodyMedium">
                  Subscripción {filteredProduct.id} incluye:{" "}
                </Text>
                {filteredProduct.products.map((product: any, index: any) => (
                  <View key={index} style={s.chipContainer}>
                    <Chip key={index} style={s.chip}>
                      {product}
                    </Chip>
                  </View>
                ))}
                <Text variant="bodyMedium">
                  Creada: {filteredProduct.startDate}{" "}
                </Text>
                <Text variant="bodyMedium">
                  Empezó: {filteredProduct.currentPeriodStart}{" "}
                </Text>
                <Text variant="bodyMedium">
                  Acaba: {filteredProduct.currentPeriodEnd}{" "}
                </Text>
                <Button
                  mode="outlined"
                  style={s.divider}
                  onPress={() => showCancelPrompt(filteredProduct.id)}
                >
                  Cancelar
                </Button>

                <Divider style={s.divider} />
              </View>
              
            );
          })}
      </View>
      <View style={s.infoContainer}>
        <Text style={s.textMarginBottom20} variant="headlineMedium">
          Sesión
        </Text>
        <Button mode="outlined" onPress={signOut}>
          Cerrar sesión
        </Button>
      </View>
    </ScrollView>
  );
}

export default withAuthenticator(Profile);

const s = StyleSheet.create({
  container: {
    flex: 0,
    height: "100%",
    backgroundColor: "#e5dedd",
    alignContent: "center",
  },
  subContainer: {
    display: "flex",
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
  },
  formInput:{
    marginBottom:20
  },
  spinner: {
    marginTop: 30,
  },
  chip: {
    margin: 10,
  },
  textMarginBottom20: {
    marginBottom: 20,
  },
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: "row",
  },
  infoContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
});
