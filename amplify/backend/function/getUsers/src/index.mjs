/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "users";

export const handler = async (event) => {
  let article;
  let requestJSON = JSON.parse(event.body);
  
  
  try{
   if (event.resource === "/users/{proxy+}" && event.httpMethod === "GET") {
      article = await dynamo.send(
        new ScanCommand({
          TableName: tableName,
          FilterExpression: "#id = :id_val",
          ExpressionAttributeNames: {
            "#id": "id",
          },
          ExpressionAttributeValues: { ":id_val": event.pathParameters?.proxy }
        })
      );
    }
    
    if (event.resource === "/users" && event.httpMethod === "GET") {
      
      article = await dynamo.send(
        new ScanCommand({
          TableName: tableName,
          FilterExpression: "#id = :id_val",
          ExpressionAttributeNames: {
            "#id": "id",
          },
          ExpressionAttributeValues: { ":id_val": event.pathParameters?.id }
        })
      );
    }
    
    if (event.resource === "/users" && event.httpMethod === "POST") {
        
        article = await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: requestJSON.user,
              subscription: requestJSON.subscription,
              updated_at: new Date().toString(),
            },
          })
        );
    } 
  
    if (event.resource === "/users/{proxy+}" && event.httpMethod === "PUT") {

      
      
        article = await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: JSON.parse(event.pathParameters.proxy).toString(),
              subscription: requestJSON.subscription,
              updated_at: new Date().toString(),
            },
          })
        );
        article = `Put item ${event.pathParameters.proxy}`;
    } 
  }catch(e){
    return {
      isBase64Encoded: true,
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(e),
    };
    
  }
  
  
    return {
      isBase64Encoded: true,
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(article),
    };
};
