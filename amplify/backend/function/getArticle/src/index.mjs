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

const bucketName = "asc-images";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "articles";

export const handler = async (event, context) => {
  let article;
  let requestJSON = JSON.parse(event.body);
  
  
  try{
   if (event.resource === "/articles/{proxy+}" && event.httpMethod === "GET") {
      article = await dynamo.send(
        new GetCommand({
          TableName: tableName,
          Key: {
            id: JSON.parse(event.pathParameters.proxy).toString(),
          },
        })
      );
    }
    
    if (event.resource === "/articles" && event.httpMethod === "GET") {
      
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
    
    if (event.resource === "/articles" && event.httpMethod === "POST") {
        let uploadResult;
        try{
          const base64File = requestJSON.image;
          const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""),'base64')

          const params = {
            Bucket: bucketName, 
            Key: `images/${new Date().getTime()}.jpg`,
            Body: decodedFile,
            ContentEncoding: 'base64',
            ContentType: 'image/jpg'
          }

          uploadResult = await s3.upload(params).promise();

          

        }catch(e){
          return {
            isBase64Encoded: true,
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(e),
          };
        }
      
        article = await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: uuidv1(),
              text: requestJSON.text,
              image: uploadResult.Location,
              pair: requestJSON.pair,
              created_at: new Date().toString(),
              updated_at: new Date().toString(),
            },
          })
        );
    } 
  
    if (event.resource === "/articles/{proxy+}" && event.httpMethod === "PUT") {

      let uploadResult;
        try{
          const base64File = requestJSON.image;
          
          const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""),'base64');

          const params = {
            Bucket: bucketName,
            Key: `images/${new Date().getTime()}.jpg`,
            Body: decodedFile,
            ContentEncoding: 'base64',
            ContentType: 'image/jpg'
          }

          uploadResult = await s3.upload(params).promise();
          
          

        }catch(e){
          return {
            isBase64Encoded: true,
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(e),
          };
        }
      
        article = await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: event.pathParameters.proxy.toString(),
              //id: context.awsRequestId,
              text: requestJSON.text,
              image:uploadResult.Location,
              pair: requestJSON.pair,
              created_at: requestJSON.createdAt,
              updated_at: new Date().toString(),
            },
          })
        );
        article = `Put item ${event.pathParameters.proxy}`;
    } 

    if (event.resource === "/articles/{proxy+}" && event.httpMethod === "DELETE") {

          
          try{
            /*articleToDelete = await dynamo.send(
              new GetCommand({
                TableName: tableName,
                Key: {
                  id: JSON.parse(event.pathParameters.proxy).toString(),
                },
              })
            );

            let s3reference = articleToDelete.Items[0].image;
            let params = {  Bucket: 'your bucket', Key: s3reference };

            deleteResult = await s3.upload(params).promise();

            */
            


            article = await dynamo.send(
              new DeleteCommand({
                TableName: tableName,
                Key: {
                  id: event.pathParameters.proxy.toString(),
                },
                
              })
            );
            article = `Deleted item ${event.pathParameters.proxy} and deleteResult`;
            
      
          }catch(e){
            return {
              isBase64Encoded: true,
              statusCode: 200,
              headers: { "Access-Control-Allow-Origin": "*" },
              body: JSON.stringify(e),
            };
          }
          

      
        
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
