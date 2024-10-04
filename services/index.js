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
      //path: `/users/${idToken}`,
      path: `/users/${cognitoUserId}`,
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

export const postUser = async (subscription) => {
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

export const deleteArticle = async (articlePair) => {
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

export const paymentIntentRequest = async (amount, currency) => {
  

  try {
    const session = await fetchAuthSession();
    const cognitoUserId = session.userSub;
    const idToken = session.tokens?.idToken?.toString();
    const user = {name: session.tokens.idToken.payload["cognito:username"], email: session.tokens.idToken.payload["email"], userId: cognitoUserId }
    const bodyy = { currency: currency, amount: amount, user };

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
