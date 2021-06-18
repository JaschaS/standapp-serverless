import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import schema from './schema';
import { removeMember, listAllMembers } from '@libs/database'

const logger = createLogger('deleteMember');

const deleteMember: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const memberId = event.body.memberId;
  const user = 'jascha';

  logger.info(`create new todo for user ${user} and id ${memberId}`);

  await removeMember(user, memberId);
  const result = await listAllMembers(user);

  return formatJSONResponse({members: result});
}

export const main = middyfy(deleteMember);