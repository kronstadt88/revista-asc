

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import {
  paginateListUserPools,
  CognitoIdentityProviderClient,
  ListUsersCommand
} from "@aws-sdk/client-cognito-identity-provider";

export const handler = async (event, context, callback) => {
  
    const client = new CognitoIdentityProviderClient({});
    let email = event.request.userAttributes.email;

    const command = new ListUsersCommand({
      UserPoolId: "eu-west-1_w5asy0g68",
      "AttributesToGet": [
        "email"
      ],
      Filter: `email = \"${email}\"`
    });
    
    const response = await client.send(command);
    
    if(response.Users.length === 0){
      return callback(null, event);
    }else{
      
      let error = new Error("Ya existe una cuenta con el email proporcionado")
      return callback(error, event);
      
    }
};
