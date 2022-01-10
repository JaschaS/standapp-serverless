import 'source-map-support/register';

import type {  } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '@libs/logger';
import { listAllMembers } from '@libs/member_database';

const logger = createLogger('getAllMembers');

const getAllMembers: APIGatewayProxyHandler = async (event) => {

  const user = event.pathParameters.userId;

  logger.info(`request all members for ${user}`);

  const result = await listAllMembers(user);

  return formatJSONResponse({members: result});
}

export const main = middyfy(getAllMembers);
