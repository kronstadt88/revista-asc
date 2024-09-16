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

import { v1 as uuidv1 } from 'uuid';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();


const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "users";

export const handler = async (event) => {
  let article;
  let requestJSON = JSON.parse(event.body);
  
  
  try{
   if (event.resource === "/users/{proxy+}" && event.httpMethod === "GET") {
      article = await dynamo.send(
        new GetCommand({
          TableName: tableName,
          Key: {
            id: JSON.parse(event.pathParameters.proxy).toString(),
          },
        })
      );
    }
    
    if (event.resource === "/users" && event.httpMethod === "GET") {
      
      article = await dynamo.send(
        new ScanCommand({
          TableName: tableName,
          FilterExpression: "#pair = :pair_val",
          ExpressionAttributeNames: {
            "#pair": "pair",
          },
          ExpressionAttributeValues: { ":pair_val": event.queryStringParameters.pair }
        })
      );
    }
    
    if (event.resource === "/users" && event.httpMethod === "POST") {
        
        article = await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: uuidv1(),
              pairs: requestJSON.pairs,
              created_at: new Date().toString(),
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
              pairs: requestJSON.pairs,
              created_at: requestJSON.createdAt,
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
