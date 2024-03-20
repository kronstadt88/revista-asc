import { StyleSheet, View, Pressable, useColorScheme, } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { withAuthenticator } from "@aws-amplify/ui-react-native";
const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

import { useEffect, useState } from "react";


import { getArticle, getArticles } from "../../services";


function Article() {
  const [editMode, setEditMode] = useState(false);

  const [articles, setArticles] = useState([]);

  const item = useLocalSearchParams();

  useEffect(()=>{
    getArticles(item.id)
      
  }, [])


  const { slug } = useLocalSearchParams();
  
  
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title="Forex" subtitle={item.id} left={LeftContent} />
        <Card.Content>
          <Text variant="titleLarge">Análisis 23/01/2024</Text>
          <Text variant="bodyMedium"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed tempus urna et pharetra pharetra massa massa. Consectetur a erat nam at lectus urna duis. Commodo ullamcorper a lacus vestibulum sed arcu non. Arcu dui vivamus arcu felis bibendum ut tristique et egestas. Enim neque volutpat ac tincidunt vitae semper quis lectus nulla. Suscipit tellus mauris a diam maecenas sed enim. Velit euismod in pellentesque massa placerat duis ultricies lacus sed. Lobortis elementum nibh tellus molestie nunc non. Tristique nulla aliquet enim tortor at auctor urna nunc id. </Text>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://img.freepik.com/premium-photo/creative-glowing-forex-chart-with-map-dark-blue-background-trade-finance-concept-3d-rendering_670147-11936.jpg' }} />
        <Card.Actions>
          <Button onPress={()=>getArticles(item.id)}>Editar</Button>
          <Button>Añadir</Button>
        </Card.Actions>
      </Card>
    </View>
    
     
  );
}


export default withAuthenticator(Article);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    overflow: "visible",
    alignContent: "center",
  },
  articleContainer: {
    padding: 30,
  },
});
