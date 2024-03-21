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

export const handler = async (event) => {
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
      /*article = article.Items.map(async item=>{
        let imageFromS3 = await s3.getObject({Bucket: bucketName, Key: item.image}).promise();
        return {
          ...item,
          image: Buffer.from(imageFromS3.Body).toString("base64")
        }
      })*/
    }
    
    if (event.resource === "/articles" && event.httpMethod === "POST") {
        let uploadResult;
        try{
          const base64File = requestJSON.image;
          const decodedFile = Buffer.from(base64File, "base64");

          const params = {
            Bucket: bucketName,
            Key: `/images/${new Date().toISOString()}.jpg`,
            Body: decodedFile,
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
              image: uploadResult.Key,
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
          const decodedFile = Buffer.from(base64File, "base64");

          const params = {
            Bucket: bucketName,
            Key: `/images/${new Date().toISOString()}.jpg`,
            Body: decodedFile,
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
              id: JSON.parse(event.pathParameters.proxy).toString(),
              text: requestJSON.text,
              image:uploadResult.Key,
              pair: requestJSON.pair,
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
