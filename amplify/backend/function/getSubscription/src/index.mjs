

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51OthaURvdA3t4SZBIz9U5uhlnZA9BHSeTbzezv5cEENMOSAJrQkqOjTTXClaBuQoFKSvjyuGcH9DeLEkHCtIL8If00uFWNUc7c"
);

function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
      dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
      
      time;

  time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min;
  return time;
}

const products = {
  index: "prod_QxvSDb95tgJY0D",
  forex: "prod_QxvSkMMmnRC1pQ",
  commodities: "",
  crypto: "",
  bonds: "prod_RCKOgaZ4G3QcjU"
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
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
  if (event.resource === "/subscription" && event.requestContext.httpMethod === "GET") {
      
    const customer = await stripe.customers.list({
      limit: 3,
      email: event["queryStringParameters"]['email']
    });
  
    const subscription = await stripe.subscriptions.list({
      limit: 10,
      customer: customer.data[0].id
    });
    
    const currentSubscriptions= [] 
    
    subscription.data.forEach(sub=>{      
      sub.items.data.forEach(item=>{
        currentSubscriptions.push(item.price.id)
      })
    })
  
    let mappedArray = currentSubscriptions.map(value=>{
      return getKeyByValue(prices, value);
    })

    const groupedSubscriptions = [];

    subscription.data.forEach(value=>{
      let sub = {};
      sub.id = value.id
      sub.currentPeriodStart = convertTimestamp(value.current_period_start)
      sub.currentPeriodEnd = convertTimestamp(value.current_period_end)
      sub.startDate = convertTimestamp(value.start_date)
      
      let products = value.items.data.map(product=>getKeyByValue(prices, product.price.id))

      sub.products = products
      
      groupedSubscriptions.push(sub)
    })

    console.log(groupedSubscriptions)
  
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ currentSubscriptions: mappedArray, groupedSubscriptions})
    };
  }

  if (event.resource === "/subscription/{proxy+}" && event.httpMethod === "DELETE") {

    const subscription = await stripe.subscriptions.cancel(
      event.pathParameters.proxy
    );
    return {
  
  
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({info: "Item has been removed " + event.pathParameters.proxy})
    };
  } 
}