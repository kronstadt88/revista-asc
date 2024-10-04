/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 *
 *
 */

const products = {
  index: "prod_QxvSDb95tgJY0D",
  forex: "prod_QxvSkMMmnRC1pQ"
}


import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51OthaURvdA3t4SZBIz9U5uhlnZA9BHSeTbzezv5cEENMOSAJrQkqOjTTXClaBuQoFKSvjyuGcH9DeLEkHCtIL8If00uFWNUc7c"
);

const publishableKey = "pk_test_51OthaURvdA3t4SZBMnop8NP6tXvOpDv4hJYO7S8eHSAIsmG5BYCHigKirpZt7hkTLfYipw7sO5pxXkNd5GlyIQUH00fRJkpcR7";

export const handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  let requestJSON = JSON.parse(event.body);
  let customer;

  
  let existingCustomers = await stripe.customers.list({email : requestJSON.user.email});
  if(existingCustomers.data.length){
      customer = existingCustomers.data[0];
  }else{
    customer = await stripe.customers.create({
      name: requestJSON.user.name,
      email: requestJSON.user.email,
      metadata: {cognitoUserId: requestJSON.user.userId}
  
    });
  }
  
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2023-10-16" }
  );

  try{
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(requestJSON.amount * 100),
      currency: "eur",
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    let intentToReturn = {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: publishableKey
    }
  
    return {


      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(intentToReturn),
    };
  }catch (e){
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(e),
    };
  }  
};




/*

export const handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  let requestJSON = JSON.parse(event.body);
  let customer;

  
  let existingCustomers = await stripe.customers.list({email : requestJSON.user.email});
  if(existingCustomers.data.length){
      customer = existingCustomers.data[0];
  }else{
    customer = await stripe.customers.create({
      name: requestJSON.user.name,
      email: requestJSON.user.email,
      metadata: {cognitoUserId: requestJSON.user.userId}
  
    });
  }
  
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2023-10-16" }
  );

  try{
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(requestJSON.amount * 100),
      currency: "eur",
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    let intentToReturn = {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: publishableKey
    }
  
    return {


      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(intentToReturn),
    };
  }catch (e){
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(e),
    };
  }  
};

*/