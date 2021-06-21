
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { Host } from "src/models/host";

const XAWS = AWSXRay.captureAWS(AWS);
const hostTable = process.env.HOST_TABLE;
const dbClient = new XAWS.DynamoDB.DocumentClient();

export async function saveAvailableMembers(data: Host) {
  await dbClient.put({
    TableName: hostTable,
    Item: data
  }).promise();
}

export async function saveNewHost(data: Host) {
  await dbClient.put({
    TableName: hostTable,
    Item: data
  }).promise();
}

export async function getCurrentHost(userId: string) : Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  const results = await dbClient.query({
    TableName: hostTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise();

  return results.Items;
}

export async function listAvailableMembers(userId: string) : Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  const results = await dbClient.query({
    TableName: hostTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise();

  return results.Items;
}