import 'source-map-support/register';

import { formatJSONResponse, notFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import { getUserId } from '@libs/userhandler';
import { CurrentHostService } from './service';
import { APIGatewayProxyHandler } from 'aws-lambda';

const logger = createLogger('currenthost');
const service = new CurrentHostService();

const currentHost: APIGatewayProxyHandler = async (event) => {
  const user = getUserId(event.headers.Authorization);

  logger.info(`current host for user ${user}`);

  try {
    const currentHost = await service.getCurrentHost(user);
    
    return formatJSONResponse({
      ...currentHost
    });

  } catch(e) {
    logger.error(`an error occured - ${e}`);
    return notFound({message: e})
  }
}

export const main = middyfy(currentHost);