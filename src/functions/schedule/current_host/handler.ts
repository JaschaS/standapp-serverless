import 'source-map-support/register';

import { formatJSONResponse, notFound, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import { getUserId } from '@libs/userhandler';
import { CurrentHostService } from './service';
import schema from './schema';

const logger = createLogger('currenthost');
const service = new CurrentHostService();

const currentHost: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const user = getUserId(event.headers.Authorization);

  logger.info(`current host for user ${user}`);

  try {
    const currentHost = await service.getCurrentHost(user, event.body.start, event.body.end);

    return formatJSONResponse({
      ...currentHost
    });

  } catch(e) {
    return notFound({message: e})
  }
}

export const main = middyfy(currentHost);