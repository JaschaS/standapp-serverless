
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { Host } from "src/models/host";
import { HostState } from "src/models/host_state";

const XAWS = AWSXRay.captureAWS(AWS);
const hostTable = process.env.HOST_TABLE;
const dbClient = new XAWS.DynamoDB.DocumentClient();

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

export async function getHostByDate(userId: string) : Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  const results = await dbClient.query({
    TableName: hostTable,
    KeyConditionExpression: 'userId = :userId and hostState = :hostState',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':hostState': HostState.CurrentHost
    }
  }).promise();

  return results.Items;
}