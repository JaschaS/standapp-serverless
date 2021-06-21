import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import schema from './schema';
import { Host } from 'src/models/host';
import { saveNewHost } from '@libs/host_database';

const logger = createLogger('savehost');

const saveHost: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const user = 'jascha';
  
  logger.info(`save host for user ${user} with name ${event.body.nickName}`);

  const newHost: Host = {
    userId: user,
    current: {
      userId: user,
      memberId: event.body.memberId,
      nickName: event.body.nickName,
      image: event.body.image
    },
    end: event.body.end,
    start: event.body.start
  }

  await saveNewHost(newHost)

  return formatJSONResponse(null);
}

export const main = middyfy(saveHost);