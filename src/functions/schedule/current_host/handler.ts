import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse, notFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import { getCurrentHost } from '@libs/host_database';
import { Host } from 'src/models/host';

const logger = createLogger('currenthost');

const currentHost: APIGatewayProxyHandler = async (_) => {
  const user = 'jascha';

  logger.info(`current host for user ${user}`);

  try {

    const hostList: Host[] = await getCurrentHost(user) as Host[];

    if(hostList.length == 0) {
      return formatJSONResponse({
        userId: "",
        memberId: "",
        start: "",
        end: "",
        image: "",
        nickName: ""
      });
    }

    const currentHost = hostList[0];

    return formatJSONResponse({
      ...currentHost.current,
      end: currentHost.end,
      start: currentHost.start
    });

  } catch(e) {
    return notFound({message: e})
  }
}

export const main = middyfy(currentHost);