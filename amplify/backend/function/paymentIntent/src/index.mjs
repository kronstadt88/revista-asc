/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 *
 *
 */

const products = {
  index: "prod_QxvSDb95tgJY0D",
  forex: "prod_QxvSkMMmnRC1pQ"
}

const prices = {
  index: "price_1Q5zbsRvdA3t4SZBkKBy7Qjl"
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

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: "price_1Q5zbsRvdA3t4SZBkKBy7Qjl",
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      
    });

    

    /*try{
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: price_1Q5zbsRvdA3t4SZBkKBy7Qjl,
        }],
        
      });
    } catch(e){
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify(e),
      };
    }*/

    

    

    /*const session = await stripe.checkout.sessions.create({
      line_items: [
        
        {
          price: price_1Q5zbsRvdA3t4SZBkKBy7Qjl,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      ui_mode: 'embedded',
      return_url: 'https://example.com/return',
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: price_1Q5zbsRvdA3t4SZBkKBy7Qjl,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    console.log(subscription)
    */

    let intentToReturn = {
      paymentIntent: paymentIntent.client_secret,
      //session: session,
      sub: subscription ,
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