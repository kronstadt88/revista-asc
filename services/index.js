import sigV4Client from '../utils/sigV4Client'
import { get } from 'aws-amplify/api';


import { fetchAuthSession } from 'aws-amplify/auth'


const server = "https://sgsldh5134.execute-api.eu-west-1.amazonaws.com";

export const getArticle = async() =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();

    const restOperation = get({ 
      apiName: 'ascpi',
      path: '/articles',
      options: {
        headers: {
          // @ts-ignore: Unreachable code error
          Authorization: idToken,
          'X-Amz-Date': new Date().getTime().toString()
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
  } catch (e) {
    console.log(e)
  }
}


export const getArticles = async (token) =>{
    myHeaders = new Headers({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded'
      });

    fetch(`${server}`, {method:"GET", headers: myHeaders});
}


/*export const getArticle = async() =>{
  try {
    const session = (await fetchAuthSession());
    console.log(session)

    const idToken = session.tokens?.idToken?.toString();


    const signedRequest = sigV4Client
    .newClient({
      accessKey: session.credentials.accessKeyId,
      secretKey: session.credentials.secretAccessKey,
      sessionToken: idToken,
      region: "eu-west-1",
      endpoint: server
    })
    .signRequest({
      method: "GET",
      path: `${server}/articles`,
      headers: {Authorization: "123"},
      queryParams: "lol=123",
      body: {a: "123"}
    });

    const restOperation = get({ 
      apiName: 'ascpi',
      path: '/articles',
      options: {
        headers: signedRequest
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
  } catch (e) {
    console.log(e)
  }
}*/
