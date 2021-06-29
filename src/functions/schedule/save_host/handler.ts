import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import schema from './schema';
import { getUserId } from '@libs/userhandler';
import { SaveHostService } from './service';

const logger = createLogger('savehost');
const service = new SaveHostService();

const saveHost: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const user = getUserId(event.headers.Authorization);
  
  logger.info(`save host for user ${user} with name ${event.body.nickName}`);

  await service.saveHost(user, event.body);

  return formatJSONResponse(null);
}

export const main = middyfy(saveHost);