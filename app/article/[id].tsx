import { StyleSheet, ScrollView, View, Alert, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Text,
  TextInput,
  Snackbar
  
} from "react-native-paper";
import { withAuthenticator } from "@aws-amplify/ui-react-native";

import * as ImagePicker from "expo-image-picker";

import { mediumTime } from "../../utils/utils";
import { useEffect, useState } from "react";

import {
  
  getArticles,
  putArticle,
  postArticle,
  deleteArticle,
} from "../../services";

function Article() {
  const [editMode, setEditMode] = useState<any>({ mode: false, selected: "" });
  const [addMode, setAddMode] = useState(false);
  const [addText, setAddText] = useState();
  const [loading, setLoading] = useState(false);

  const [articlesArray, setArticlesArray] = useState([]);

  const [file, setFile] = useState<any>(null);
  const [error, setError] = useState(null);

  const item = useLocalSearchParams();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      // If permission is denied, show an alert
      Alert.alert(
        "Permission Denied",
        `Sorry, we need camera  
             roll permission to upload images.`
      );
    } else {
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
        quality: 1,
      });
      

      if (!result.canceled) {
        // If an image is selected (not cancelled),
        // update the file state variable
        setFile(result.assets[0]);
        

        // Clear any previous errors
        setError(null);
      }
    }
  };

  const fetchArticles = async () => {
    let articles: any = await getArticles(item.id);
    return articles.body.json();
  };

  const putArticleCallback = async (createdAt: any, pair: any) => {
    await putArticle(
      editMode.selected,
      editMode.selected.text,
      file.base64,
      createdAt,
      pair
    );
    await fetchArticles().then((articlesPromise) => {
      setArticlesArray(articlesPromise.Items);
      console.log(articlesPromise)
    });
    setFile("");
    setEditMode({ mode: false, selected: "" });
  };

  const postArticleCallback = async () => {
    
    await postArticle(file.base64, addText, item.id);
    await fetchArticles().then((articlesPromise) => {
      setArticlesArray(articlesPromise.Items);
    });
    setFile("");
    setAddMode(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchArticles().then((articlesPromise) => {
      setArticlesArray(articlesPromise.Items);
      setLoading(false);
    });
  }, []);

  
    return (

      
      <ScrollView style={styles.container}>
        <Card style={styles.cardStyle}>
          <Card.Title title="Forex" subtitle={item.id}  style={styles.title}/>
        </Card>
        {editMode.mode && (
          <>
            <View style={styles.articleContainer}>
              <Card style={styles.cardStyle}>
                <Card.Title title="Editando artículo" />
                <TextInput
                  label="Texto para el artículo"
                  multiline={true}
                  numberOfLines={10}
                  value={editMode.selected.text}
                  onChangeText={(text: any) =>
                    setEditMode({
                      mode: true,
                      selected: { ...editMode.selected, text },
                    })
                  }
                />
                <Image
                  source={{ uri: file?.uri }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Button
                  
                  mode="contained"
                  onPress={() => pickImage()}
                >
                  Upload image
                </Button>

                <Card.Actions>
                  <Button
                    onPress={() => setEditMode({ mode: false, selected: "" })}
                  >
                    Cancelar{" "}
                  </Button>
                  <Button
                    onPress={() =>
                      putArticleCallback(
                        editMode.selected.created_at,
                        editMode.selected.pair
                      )
                    }
                  >
                    Guardar
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          </>
        )}

        {addMode && (
          <>
            <View style={styles.articleContainer}>
              <Card style={styles.cardStyle}>
                <Card.Title title="Añadiendo artículo" />
                <TextInput
                  label="Texto del artículo"
                  multiline={true}
                  numberOfLines={10}
                  value={addText}
                  onChangeText={(text: any) => setAddText(text)}
                />
                <Button
                  mode="contained"
                  onPress={() => pickImage()}
                >
                  Upload image
                </Button>

                {file ? (
                  // Display the selected image

                  <Image
                    source={{ uri: file.uri }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  
                  <Text style={styles.errorText}>{error}</Text>
                )}
                <Card.Actions>
                  <Button onPress={() => setAddMode(!addMode)}>
                    Cancelar{" "}
                  </Button>
                  <Button onPress={() => postArticleCallback()}>
                    Guardar
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          </>
        )}

        {!addMode && !editMode.mode && (
          <>
            <Button
              style={styles.addArticleButton}
              mode="outlined"
              onPress={() => setAddMode(!addMode)}
            >
              Add new Article
            </Button>

            {articlesArray.map((article: any, index) => {
              return (
                <View style={styles.articleContainer} key={index}>
                  <Card style={styles.cardStyle}>
                  <Card.Cover style={styles.image} source={{ uri: article.image }} resizeMode="contain" />
                    <Card.Title
                      style={styles.articleText}
                      title={item.id}
                      subtitle={mediumTime.format(new Date(article.created_at))}
                    />
                    <Card.Content key={index} style={styles.cardContentStyle}>
                      <View style={styles.cardContentViewStyle}>
                        <Text style={styles.articleText} variant="bodyMedium">
                          {article.text}
                        </Text>
                        
                      </View>
                    </Card.Content>

                    <Card.Actions>
                      <Button
                        mode="contained"
                        onPress={() =>
                          setEditMode({
                            mode: !editMode.mode,
                            selected: article,
                          })
                        }
                      >
                        Editar
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() =>
                          
                          deleteArticle(article)
                        }
                      >
                        Borrar [WIP]
                      </Button>
                    </Card.Actions>
                  </Card>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    );
  
}

export default withAuthenticator(Article);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#e5dedd",
    alignContent: "center",
  },
  title:{
    width: "80%",
    borderRadius: 0,
    color: 'red'
  },
  addArticleButton: {
    margin: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
  },
  articleContainer: {
    
  },
  cardContentStyle: {
    height: 100,
    marginBottom: 200,
    
  },

  cardContentViewStyle: {
    height: 100,
    marginBottom: 20,
  },
  cardStyle: {
    backgroundColor: '#ffffff',
    marginBottom: 40,
  },
  articleText: {
    color:'black',
    marginTop: 20,
  },

  header: {
    fontSize: 20,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 200,
    
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  errorText: {
    color: "red",
    marginTop: 16,
  },
});
