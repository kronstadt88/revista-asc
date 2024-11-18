

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51OthaURvdA3t4SZBIz9U5uhlnZA9BHSeTbzezv5cEENMOSAJrQkqOjTTXClaBuQoFKSvjyuGcH9DeLEkHCtIL8If00uFWNUc7c"
);


export const handler = async (event, context)=>{
  if (event.resource === "/customers" && event.requestContext.httpMethod === "GET") {
      
    const customer = await stripe.customers.list({
      email: event["queryStringParameters"]['email']
    });
  
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ customer: customer.data[0]})
    };
  }

  if (event.resource === "/subscription/{proxy+}" && event.httpMethod === "PUT") {

    const customer = await stripe.customers.update(event.pathParameters.proxy,
        {
          metadata: {
            order_id: '6735',
          },
        }
      );

    return {
  
  
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({customer: customer.data})
    };
  } 
}