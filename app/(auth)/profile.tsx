import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { Text } from "react-native-paper";
import {
  useAuthenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react-native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Button, Chip, Divider } from "react-native-paper";

import { deleteSubscription, getCustomer, getSubscription } from "../../services";

import { useFocusEffect } from "@react-navigation/native";
import { getValueFor, save } from "../../services/secureStore";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any>([]);
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  useFocusEffect(
    useCallback(() => {
      getUserSubscription();
      getCustomerDetails()
      return () => {
        setAvailableProducts([]);
      };
    }, [])
  );

  const getUserSubscription = async () => {
    let needsReload = await getValueFor("needsReload");
    if (needsReload === "false") {
      return;
    }

    setLoading(true);
    let userSubscription: any = await getSubscription();
    setLoading(false);
    setAvailableProducts(userSubscription.groupedSubscriptions);
  };

  const getCustomerDetails = async () =>{
    let customer = await getCustomer();
    console.log(customer)
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
    save("needsReload", "true");
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.infoContainer}>
        <Text style={s.textMarginBottom20} variant="headlineMedium">
          Datos personales
        </Text>
        <Button mode="outlined" onPress={()=>{}}>
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
