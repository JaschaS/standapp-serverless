import 'source-map-support/register';

import { middyfy } from '@libs/lambda';

import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler} from "aws-lambda";
import {APIGatewayTokenAuthorizerEvent} from "aws-lambda/trigger/api-gateway-authorizer";
import { createLogger } from '@libs/logger'
import * as admin from 'firebase-admin';

const logger = createLogger('auth')
const serverKey = process.env.SERVER_KEY;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serverKey))
});

const auth: APIGatewayTokenAuthorizerHandler = async (event : APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  
  try {
    logger.info(`Validating user`);

    const user = await validate(event.authorizationToken);

    return {
      principalId: user,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*"
          }
        ]
      }
    };
  }
  catch (e) {

    logger.error(`User was not authorized - reason: ${e}`);

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*"
          }
        ]
      }
    };
  }
}

export const main = middyfy(auth);

async function validate(authHeader: string): Promise<string> {
  if(!authHeader) throw new Error("Missing authorization header");
  if(!authHeader.toLocaleLowerCase().startsWith("bearer ")) throw new Error("Invalid authorization header");

  const token = authHeader.split(" ")[1]

  const decodedToken = await admin.auth().verifyIdToken(token);

  return decodedToken.sub;
}