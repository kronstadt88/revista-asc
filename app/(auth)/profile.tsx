import { StyleSheet, View, Text, ScrollView } from "react-native";
import {
  useAuthenticator,
  withAuthenticator,
} from '@aws-amplify/ui-react-native';
import { useEffect, useState } from "react";
import { Button, Chip } from "react-native-paper";

import { deleteSubscription, getSubscription } from "../../services";


function Profile() {

  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any>([]);
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  
  const getUserSubscription = async () =>{
    setLoading(true);
    let userSubscription: any = await getSubscription();
    console.log(userSubscription)
    setLoading(false);
    setAvailableProducts(userSubscription.subscription.data)
    console.log(" availe",availableProducts)
    
  }
  const unsubscribe = (product: any) =>{
    deleteSubscription(product);
  }
  
  useEffect(()=>{
    getUserSubscription();
  }, [])


  return (
    
      
        <ScrollView style={s.container}>
          <View style={s.infoContainer}>
            <Button mode="contained" onPress={signOut}>Cerrar sesión</Button>
          </View>

          <View style={s.infoContainer}>
            <Text>Cancelar Suscripciones</Text>
            {!loading &&
              availableProducts.map((filteredProduct: any) => {
                return (
                  <Chip
                    key={filteredProduct.id}
                    style={s.chip}
                    onPress={() => unsubscribe(filteredProduct)}
                  >
                    {filteredProduct.id}
                  </Chip>
                );
              })
            }
            
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
  chip: {
    alignSelf: "flex-start",
    margin: 10,
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
});