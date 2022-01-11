import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger';

import schema from '@functions/member/update_member/schema';
import { getMember, patchMember, listAllMembers } from '@libs/member_database';
import { Member } from 'src/models/member';

const logger = createLogger('updateMember');

const updateMember: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const memberId = event.pathParameters.memberId;
  const user = event.pathParameters.userId;

  logger.info(`update todo with id ${memberId} for user ${user}`);

  // TODO: optimize do we really need to do 3 database access?

  const member: Member[] = await getMember(memberId, user) as Member[];
  await patchMember(event.body.nickName, event.body.image, member[0])
  
  const result = await listAllMembers(user);

  return formatJSONResponse({members: result});
}

export const main = middyfy(updateMember);