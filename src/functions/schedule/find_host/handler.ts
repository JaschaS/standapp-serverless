import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse, notFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import { Host } from 'src/models/host';
import { getUserId } from '@libs/userhandler';
import { FindHostService } from './service';

const logger = createLogger('findHost');
const service = new FindHostService();

const findHost: APIGatewayProxyHandler = async (event) => {
  const user = getUserId(event.headers.Authorization);

  logger.info(`find host for user ${user}`);

  try {

    const host: Host = await service.findHost(user);

    return formatJSONResponse({
      ...host.current,
      end: host.end,
      start: host.start
    });

  } catch(e) {
    return notFound({message: e})
  }
}

export const main = middyfy(findHost);
/*
async function getHost(user: string): Promise<Host> {
  const members = await listAllMembers(user) as Member[];
  
  if(members.length == 0) {
    throw new Error(`find members found for user ${user}`);
  }

  const hostList: Host[] = await getCurrentHost(user) as Host[];
  const randMember = getRandomInt(members.length);
  
  if(hostList.length == 0) {
    const start = getStartDate(new Date());
    const end = getEndDate(start);

    return {
      userId: user,
      current: members[randMember],
      start: start.getTime().toString(),
      end: end.getTime().toString(),
    };
  }

  const currentEnd = hostList[0].end;
  const start = getStartDate(new Date(currentEnd));
  const end = getEndDate(start);
  return {
    userId: user,
    current: members[randMember],
    end: end.getTime().toString(),
    start: start.getTime().toString()
  }
}

function getStartDate(date: Date): Date {
  return new Date(date.getTime() + (3 * 24 * 60 * 60 * 1000));
}

function getEndDate(date: Date): Date {
  return new Date(date.getTime() + (4 * 24 * 60 * 60 * 1000));
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}*/