const { paymentIntent } = require('../../../../../services');


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify('Paymenty!'),
    };
};
context.succeed({
    "isBase64Encoded": true|false,
    "statusCode": 200,
    "headers": { "Access-Control-Allow-Origin": "*" },
    "body": paymentIntent
});