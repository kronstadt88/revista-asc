
import { get, post } from 'aws-amplify/api';


import { fetchAuthSession, getCurrentUser} from 'aws-amplify/auth'

const server = "https://sgsldh5134.execute-api.eu-west-1.amazonaws.com";

export const getArticle = async(id, articlePair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();

    const restOperation = get({ 
      apiName: 'ascpi',
      
      path: `/articles/${id}?pair=${articlePair}`,
      options: {
        headers: {
          Authorization: idToken,
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
  } catch (e) {
    console.log(e)
  }
}

export const getArticles = async(articlePair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    
    const sessionInfo = await fetchAuthSession()
    console.log(sessionInfo)
    const userInfo = await getCurrentUser()
    console.log(userInfo)

    const restOperation = get({ 
      apiName: 'ascpi',
      path: `/articles?pair=${articlePair}`,
      options: {
        headers: {
          Authorization: idToken,
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
  } catch (e) {
    console.log(e)
  }
}


export const paymentIntent = async(amount, currency) =>{
  const bodyy = { currency: currency, amount: amount };

  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();

    const restOperation = post({ 
      apiName: 'ascpi',
      path: '/paymentIntent',
      
      options: {
        headers: {
          Authorization: idToken,
        },
        body: bodyy
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
  } catch (e) {
    console.log(e)
  }
}


