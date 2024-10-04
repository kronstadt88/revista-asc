import { StyleSheet, ScrollView, View, Alert, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Text,
  TextInput,
  ActivityIndicator,
  MD2Colors,
  PaperProvider
} from "react-native-paper";
import { withAuthenticator } from "@aws-amplify/ui-react-native";

import * as ImagePicker from "expo-image-picker";

import { mediumTime } from "../../utils/utils";
import { useEffect, useState } from "react";

import {
  getArticle,
  getArticles,
  putArticle,
  postArticle,
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
      // Launch the image library and get
      // the selected image
      const result: any = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) {
        // If an image is selected (not cancelled),
        // update the file state variable
        setFile(result.uri);

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
      file,
      createdAt,
      pair
    );
    await fetchArticles().then((articlesPromise) => {
      setArticlesArray(articlesPromise.Items);
    });
    setEditMode({ mode: false, selected: "" });
  };

  const postArticleCallback = async (image: any) => {
    await postArticle(file, addText, item.id);
    await fetchArticles().then((articlesPromise) => {
      setArticlesArray(articlesPromise.Items);
    });
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
        <Card>
          <Card.Title title="Forex" subtitle={item.id} />
        </Card>
        {editMode.mode && (
          <>
            <View style={styles.articleContainer}>
              <Card>
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
                  source={{ uri: editMode.selected.image }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Button
                  style={styles.button}
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
              <Card>
                <Card.Title title="Añadiendo artículo" />
                <TextInput
                  label="Texto del artículo"
                  multiline={true}
                  numberOfLines={10}
                  value={addText}
                  onChangeText={(text: any) => setAddText(text)}
                />
                <Button
                  style={styles.button}
                  mode="contained"
                  onPress={() => pickImage()}
                >
                  Upload image
                </Button>

                {file ? (
                  // Display the selected image

                  <Image
                    source={{ uri: file }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  // Display an error message if there's
                  // an error or no image selected
                  <Text style={styles.errorText}>{error}</Text>
                )}
                <Card.Actions>
                  <Button onPress={() => setAddMode(!addMode)}>
                    Cancelar{" "}
                  </Button>
                  <Button onPress={() => postArticleCallback("")}>
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
                    <Card.Title
                      title={item.id}
                      subtitle={mediumTime.format(new Date(article.created_at))}
                    />
                    <Card.Content key={index} style={styles.cardContentStyle}>
                      <View style={styles.cardContentViewStyle}>
                        <Text style={styles.articleText} variant="bodyMedium">
                          {article.text}
                        </Text>
                        <Image
                          source={{ uri: article.image }}
                          style={styles.image}
                          resizeMode="contain"
                        />
                      </View>
                    </Card.Content>

                    <Card.Actions>
                      <Button
                        onPress={() =>
                          setEditMode({
                            mode: !editMode.mode,
                            selected: article,
                          })
                        }
                      >
                        Editar
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
    flex: 1,
    backgroundColor: "white",
    alignContent: "center",
  },
  addArticleButton: {
    margin: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40,
  },
  articleContainer: {
    margin: 30,
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
    backgroundColor: "white",
  },
  articleText: {
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
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    marginTop: 16,
  },
});
