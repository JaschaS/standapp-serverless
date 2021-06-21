
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import {Member} from "../models/member"

const XAWS = AWSXRay.captureAWS(AWS);
const standappTable = process.env.MEMBERS_TABLE;
const dbClient = new XAWS.DynamoDB.DocumentClient();

export async function patchMember(nickName: string, image: string, existing: Member) {

  let updatedMember: Member = {
    nickName: nickName ?? existing.nickName,
    image: image ?? existing.image,
    userId: existing.userId,
    memberId: existing.memberId
  };

  await dbClient.put({
    TableName: standappTable,
    Item: updatedMember
  }).promise();
}

export async function getMember(memberId: string, userId: string) : Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  const results = await dbClient.query({
    TableName: standappTable,
    KeyConditionExpression: 'userId = :userId and memberId = :memberId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':memberId': memberId
    }
  }).promise();

  return results.Items;
}

export async function saveMember(member: Member) {
  await dbClient.put({
    TableName: standappTable,
    Item: member
  }).promise();
}
  
export async function listAllMembers(userId: string) : Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  const results = await dbClient.query({
    TableName: standappTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise();

  return results.Items;
}

export async function removeMember(userId: string, memberId: string) {
  await dbClient.delete({
    TableName: standappTable,
    Key: {
      memberId: memberId,
      userId: userId
    }
  }).promise();
}