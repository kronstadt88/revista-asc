import { StyleSheet, View, Pressable, useColorScheme } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Avatar, Button, Card, Text, TextInput } from "react-native-paper";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

import { mediumTime } from "../../utils/utils";
import { useEffect, useState } from "react";

import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from "react-native-document-picker";

import { getArticle, getArticles, putArticle, postArticle } from "../../services";

function Article() {
  const [editMode, setEditMode] = useState<any>({mode: false, selected:""});
  const [addMode, setAddMode] = useState(false);
  const [editText, setEditText] = useState();
  const [addText, setAddText] = useState();

  const [articlesArray, setArticlesArray] = useState([]);

  const item = useLocalSearchParams();

  const fetchArticles = async () => {
    let articles = await getArticles(item.id);
    return articles.body.json();
  };

  const putArticleCallback = async (image:any, createdAt: any, pair: any) => {
    await putArticle(editMode.selected, editText, image, createdAt, pair);
    await fetchArticles().then((articlesPromise) => {
      setArticlesArray(articlesPromise.Items);
    });
    setEditMode({mode: false, selected: ""});
  };

  const postArticleCallback = async (image:any) => {
    await postArticle(image, addText, item.id);
    await fetchArticles().then((articlesPromise) => {
      setArticlesArray(articlesPromise.Items);
    });
    setEditMode({mode: false, selected: ""});
  };
  

  useEffect(() => {
    fetchArticles().then((articlesPromise) => {
      setArticlesArray(articlesPromise.Items);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title="Forex" subtitle={item.id} left={LeftContent} />
      </Card>
      {editMode.mode && (
        <>
          <View style={styles.articleContainer}>
            <Card>
              <TextInput
                label="Email"
                value={editText}
                onChangeText={(text: any) => setEditText(text)}
              />
              <Button style={styles.button}  mode="contained" onPress={() => {}}>
                Upload image
              </Button>
              <Card.Actions>
                <Button onPress={() => setEditMode({mode: false, selected:""})}>Cancelar </Button>
                <Button onPress={() => putArticleCallback("", editMode.selected.created_at, editMode.selected.pair)}>Guardar</Button>
              </Card.Actions>
            </Card>
          </View>
        </>
      )}

      {addMode && (
        <>
          <View style={styles.articleContainer}>
            <Card>
              <TextInput
                label="Texto del artículo"
                value={addText}
                onChangeText={(text: any) => setAddText(text)}
              />
              <Button style={styles.button}  mode="contained" onPress={() => {}}>
                Upload image
              </Button>
              <Card.Actions>
                <Button onPress={() => setAddMode(!addMode)}>Cancelar </Button>
                <Button onPress={() => postArticleCallback("")}>Guardar</Button>
              </Card.Actions>
            </Card>
          </View>
        </>
      )}

      {!addMode && !editMode.mode && (
        <>
          <Button style={styles.button}  mode="contained" onPress={() => setAddMode(!addMode)}>
            Add new Article
          </Button>
          
          {articlesArray.map((article: any, index) => {
            return (
              <View style={styles.articleContainer} key={index}>
                
                <Card>
                <Card.Title title={item.id} subtitle={mediumTime.format(new Date(article.created_at))}left={LeftContent} />
                  <Card.Content key={index}>
                    
                    <Text style={styles.articleText} variant="bodyMedium">
                      
                      {article.text}
                    </Text>
                  </Card.Content>
                  <Card.Cover
                    style={styles.articleContainer}
                    source={{
                      uri: "https://img.freepik.com/premium-photo/creative-glowing-forex-chart-with-map-dark-blue-background-trade-finance-concept-3d-rendering_670147-11936.jpg",
                    }}
                  />
                  <Card.Actions>
                    <Button onPress={() => setEditMode({mode: !editMode.mode, selected:article})}>
                      Editar
                    </Button>
                  </Card.Actions>
                </Card>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
}

export default withAuthenticator(Article);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    overflow: "visible",
    alignContent: "center"
  },
  articleContainer: {
    margin: 30,
  },
  articleText: {
    marginTop: 20,
  },
  button: {
    margin: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 40,
    paddingLeft: 40    
  }
});
