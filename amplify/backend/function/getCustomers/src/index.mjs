

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

  if (event.resource === "/customers/{proxy+}" && event.httpMethod === "PUT") {

    let requestJSON = JSON.parse(event.body);

    try{
      const customer = await stripe.customers.update(event.pathParameters.proxy,
        {
          address:{
            line1:requestJSON.customer.line1,
            city:requestJSON.customer.city,
            postal_code:requestJSON.customer.postalCode,
            country:requestJSON.customer.country,
          },
          shipping:{
            name: requestJSON.customer.name,
            phone: requestJSON.customer.phone,
            address: {
              line1: requestJSON.customer.shippingAddressLine1,
              postal_code: requestJSON.customer.shippingAddressPostalCode,
              country: requestJSON.customer.shippingAddressCountry,
              city: requestJSON.customer.shippingAddressCity,
            },
            
          },
          
        }
      );
      return {
  
  
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        statusCode: 200,
        body: JSON.stringify({customer: customer})
      };
    }catch (e){
      return {
  
  
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        statusCode: 400,
        body: JSON.stringify({error: e})
      };
    }
    

    
  } 
}