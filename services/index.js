import { get, post, put, del } from "aws-amplify/api";

import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const getArticle = async (id, articlePair) => {
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();

    const restOperation = get({
      apiName: "ascpi",

      path: `/articles/${id}?pair=${articlePair}`,
      options: {
        headers: {
          Authorization: idToken,
        },
      },
    });
    const response = await restOperation.response;
    console.log("GET call succeeded: ", response);
  } catch (e) {
    console.log(e);
  }
};

export const getCustomer = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    const restOperation = get({
      apiName: "ascpi",

      path: `/customers?${session.tokens.idToken.payload.email}`,
      options: {
        headers: {
          Authorization: idToken,
        },
      },
    });
    const { body } = await restOperation.response;
    const json = await body.json();
    return json;
  } catch (e) {
    console.log(e);
  }
};

export const getArticles = async (articlePair) => {
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = get({
      apiName: "ascpi",
      path: `/articles?pair=${articlePair}`,
      options: {
        headers: {
          Authorization: idToken,
        },
      },
    });
    const response = await restOperation.response;
    console.log("GET call succeeded: ", response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const postArticle = async (image = "", text, pair) => {
  
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = post({
      apiName: "ascpi",
      path: `/articles`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body: {
          text,
          pair,
          image,
        },
      },
    });
    const response = await restOperation.response;
    console.log("GET call succeeded: ", response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const getUser = async () => {
  try {
    const session = await fetchAuthSession();

    const cognitoUserId = session.userSub;
    const idToken = session.tokens?.idToken?.toString();
    const restOperation = get({
      apiName: "ascpi",
      path: `/users/${cognitoUserId}`,
      options: {
        headers: {
          Authorization: idToken,
        },
      },
    });
    const { body } = await restOperation.response;
    const json = await body.json();
    return json;
  } catch (e) {
    console.log(e);
  }
};

export const getSubscription = async () => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    
    const restOperation = get({
      apiName: "ascpi",
      path: `/subscription?email=${session.tokens.idToken.payload["email"]}`,
      options: {
        headers: {
          Authorization: idToken,
        },
      },
    });
    const { body } = await restOperation.response;
    const json = await body.json();
    return json;
  } catch (e) {
    console.log(e);
  }
};

export const deleteSubscription = async (id) => {
  try {
    
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    
    const restOperation = del({
      apiName: "ascpi",
      path: `/subscription/${id}`,
      options: {
        headers: {
          Authorization: idToken,
        },
      },
    });
    const { body } = await restOperation.response;
    const json = await body.json();
    return json;
  } catch (e) {
    console.log(e);
  }
};

export const postUser = async (subscription = "") => {
  try {
    const session = await fetchAuthSession();
    const cognitoUserId = session.userSub;
    const idToken = session.tokens?.idToken?.toString();
    const restOperation = post({
      apiName: "ascpi",
      path: `/users`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body: {
          user: cognitoUserId,
          subscription,
        },
      },
    });
    const response = await restOperation.response;
    console.log("GET call succeeded: ", response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const putArticle = async (article, text, image, createdAt, pair) => {
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = put({
      apiName: "ascpi",
      path: `/articles/${article.id}`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body: {
          pair,
          text,
          image,
          createdAt,
        },
      },
    });
    const response = await restOperation.response;
    console.log("GET call succeeded: ", response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const putCustomer = async (customer) => {
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = put({
      apiName: "ascpi",
      path: `/customers/${customer.id}`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body: {
          customer
        },
      },
    });
    const { body } = await restOperation.response;
    const json = await body.json();
    return json;
  } catch (e) {
    console.log(e);
  }
};


export const putUser = async (subscription) => {
  try {
    const session = await fetchAuthSession();
    const cognitoUserId = session.userSub;
    const idToken = session.tokens?.idToken?.toString();
    const restOperation = put({
      apiName: "ascpi",
      path: `/users`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body: {
          user: cognitoUserId,
          subscription,
        },
      },
    });
    const response = await restOperation.response;
    console.log("GET call succeeded: ", response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const deleteArticle = async (article) => {
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = del({
      apiName: "ascpi",
      path: `/articles/${article.id}`,
      options: {
        headers: {
          Authorization: idToken,
        }
      },
    });
    const response = await restOperation.response;
    console.log("DELETE call succeeded: ", response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const deleteUser = async (articlePair) => {
  try {
    const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    const restOperation = del({
      apiName: "ascpi",
      path: `/articles?pair=${articlePair}`,
      options: {
        headers: {
          Authorization: idToken,
        },
        body: {},
      },
    });
    const response = await restOperation.response;
    console.log("GET call succeeded: ", response);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const paymentIntentRequest = async (subscription) => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    const bodyy = { subscription,  userDetails: session.tokens?.idToken.payload };

    const restOperation = post({
      apiName: "ascpi",
      path: "/paymentIntent",

      options: {
        headers: {
          Authorization: idToken,
        },
        body: bodyy,
      },
    });
    const response = await restOperation.response;
    return response;
  } catch (e) {
    console.log(e);
  }
};


export const paymentIntentLibraryRequest = async (subscription) => {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    const bodyy = { product,  userDetails: session.tokens?.idToken.payload };

    const restOperation = post({
      apiName: "ascpi",
      path: "/paymentIntentLibrary",

      options: {
        headers: {
          Authorization: idToken,
        },
        body: bodyy,
      },
    });
    const response = await restOperation.response;
    return response;
  } catch (e) {
    console.log(e);
  }
};