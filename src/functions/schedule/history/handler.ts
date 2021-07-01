import 'source-map-support/register';

import { formatJSONResponse, notFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import { getUserId } from '@libs/userhandler';
import { HistoryService } from './service';
import { APIGatewayProxyHandler } from 'aws-lambda';

const logger = createLogger('history');
const service = new HistoryService();

const getHistory: APIGatewayProxyHandler = async (event) => {
  const user = getUserId(event.headers.Authorization);

  logger.info(`get history for user ${user}`);

  try {
    const historyList = await service.getHistory(user);
    
    return formatJSONResponse({
      ...historyList
    });

  } catch(e) {
    logger.error(`an error occured - ${e}`);
    return notFound({message: e})
  }
}

export const main = middyfy(getHistory);