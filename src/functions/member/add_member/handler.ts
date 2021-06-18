import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '@libs/logger'

import schema from './schema';
import { Member } from 'src/models/member';
import { saveMember, listAllMembers } from '@libs/database'

const logger = createLogger('addMember');

const addMember: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const memberId = uuidv4();
  const user = 'jascha';

  logger.info(`create new todo for user ${user} and id ${memberId}`);

  const member: Member = {
    userId: user,
    memberId: memberId,
    ...event.body
  }

  await saveMember(member);
  const result = await listAllMembers(user);

  return formatJSONResponse({members: result});
}

export const main = middyfy(addMember);