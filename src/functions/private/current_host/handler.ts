import 'source-map-support/register';

import { formatJSONResponse, notFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import { CurrentHostService } from '@functions/schedule/current_host/service';
import { APIGatewayProxyHandler } from 'aws-lambda';

const logger = createLogger('currenthost');
const service = new CurrentHostService();

const currentHost: APIGatewayProxyHandler = async (event) => {
  const user = event.pathParameters.userId;

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