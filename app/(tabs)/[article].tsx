import { StyleSheet, Text, View, Pressable } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { Link, Tabs } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";

export default function Article() {
  const { slug } = useLocalSearchParams();
  console.log(slug)
  return (
    <>
      <Tabs>
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          
          headerRight: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      
    </Tabs>
    <View style={styles.container}>
      <View>
        
      </View>
      <View style={styles.articleContainer}>
        <Text>
          Lorem Ipsum es simplemente el texto de relleno de las imprentas y
          archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de
          las industrias desde el año 1500, cuando un impresor (N. del T.
          persona que se dedica a la imprenta) desconocido usó una galería de
          textos y los mezcló de tal manera que logró hacer un libro de textos
          especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como
          texto de relleno en documentos electrónicos, quedando esencialmente
          igual al original. Fue popularizado en los 60s con la creación de las
          hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más
          recientemente con software de autoedición, como por ejemplo Aldus
          PageMaker, el cual incluye versiones de Lorem Ipsum.
        </Text>
      </View>
    </View>
    </>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignContent: "center",
  },
  articleContainer: {
    padding: 30,
  },
});
