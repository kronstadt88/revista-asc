/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 *
 *
 */

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
  
    
    let existingCustomers = await stripe.customers.list({email : requestJSON.userDetails.email});
  if(existingCustomers.data.length){
      customer = existingCustomers.data[0];
  }else{
    customer = await stripe.customers.create({
      name: requestJSON.userDetails.given_name + " " + requestJSON.userDetails.family_name,
      address: {
        line1: requestJSON.userDetails.address.formatted,
        country: requestJSON.userDetails.zoneinfo
      },
      email: requestJSON.userDetails.email,
      phone: requestJSON.userDetails.phone_number,
      metadata: {
        cognitoUserName: requestJSON.userDetails["cognito:username"],
        cognitoId: requestJSON.userDetails.sub,
        birthdate:  requestJSON.userDetails.birthdate,
      }
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
  
  