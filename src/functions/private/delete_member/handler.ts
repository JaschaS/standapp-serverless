import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';

import schema from '@functions/member/delete_member/schema';
import { removeMember, listAllMembers } from '@libs/member_database';

const logger = createLogger('deleteMember');

const deleteMember: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const memberId = event.body.memberId;
  const user = event.pathParameters.userId;

  logger.info(`create new todo for user ${user} and id ${memberId}`);

  await removeMember(user, memberId);
  const result = await listAllMembers(user);

  return formatJSONResponse({members: result});
}

export const main = middyfy(deleteMember);