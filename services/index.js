
import { get, post, put, del } from 'aws-amplify/api';


import { fetchAuthSession, getCurrentUser} from 'aws-amplify/auth'

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

export const getUser = async(id, articlePair) =>{
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
    return response;
    
  } catch (e) {
    console.log(e)
  }
}

export const getUsers = async(articlePair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
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
    return response;
    
  } catch (e) {
    console.log(e)
  }
}



export const postArticle = async(image= "", text, pair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = post({ 
      apiName: 'ascpi',
      path: `/articles`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body:{
          text, pair, image
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
    return response;
    
  } catch (e) {
    console.log(e)
  }
}

export const postUser = async(image= "", text, pair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = post({ 
      apiName: 'ascpi',
      path: `/articles`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body:{
          text, pair, image
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
    return response;
    
  } catch (e) {
    console.log(e)
  }
}

export const putArticle = async(article, text, image, createdAt, pair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = put({ 
      apiName: 'ascpi',
      path: `/articles/${article.id}`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body:{
          pair,
          text,
          image,
          createdAt
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
    return response;
    
  } catch (e) {
    console.log(e)
  }
}

export const putUser = async(article, text, image, createdAt, pair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = put({ 
      apiName: 'ascpi',
      path: `/articles/${article.id}`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body:{
          pair,
          text,
          image,
          createdAt
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
    return response;
    
  } catch (e) {
    console.log(e)
  }
}

export const deleteArticle = async(articlePair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = del({ 
      apiName: 'ascpi',
      path: `/articles?pair=${articlePair}`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body:{
          
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
    return response;
    
  } catch (e) {
    console.log(e)
  }
}

export const deleteUser = async(articlePair) =>{
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = del({ 
      apiName: 'ascpi',
      path: `/articles?pair=${articlePair}`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body:{
          
        }
      }
    });
    const response = await restOperation.response;
    console.log('GET call succeeded: ', response);
    return response;
    
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


