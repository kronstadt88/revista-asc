

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51OthaURvdA3t4SZBIz9U5uhlnZA9BHSeTbzezv5cEENMOSAJrQkqOjTTXClaBuQoFKSvjyuGcH9DeLEkHCtIL8If00uFWNUc7c"
);

const products = {
  index: "prod_QxvSDb95tgJY0D",
  forex: "prod_QxvSkMMmnRC1pQ",
  commodities: "",
  crypto: "",
  bonds: "prod_RCKOgaZ4G3QcjU"
}

const prices = {
  index: "price_1Q5zbsRvdA3t4SZBkKBy7Qjl",
  forex: "price_1Q5zbJRvdA3t4SZBB1mIAXEV",
  commodities: "price_1QJvkQRvdA3t4SZBWuXB3kme",
  bonds: "price_1QJvjqRvdA3t4SZBX7hEXOq0",
  crypto: "price_1QJvhVRvdA3t4SZBU2fwasUt",
  all: "price_1QKIkyRvdA3t4SZBkBAE90xk"
}

const publishableKey = "pk_test_51OthaURvdA3t4SZBMnop8NP6tXvOpDv4hJYO7S8eHSAIsmG5BYCHigKirpZt7hkTLfYipw7sO5pxXkNd5GlyIQUH00fRJkpcR7";


export const handler = async (event, context)=>{

  const customer = await stripe.customers.search({
    query: 'email:\'Jane Doe\' ',
  });

  const subscription = await stripe.subscriptions.list({
    limit: 10,
    customer: event["queryStringParameters"]['email']
  });
  

  return {


    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(subscription),
  };
}