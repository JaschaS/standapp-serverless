import 'source-map-support/register';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse, notFound } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createLogger } from '@libs/logger'

import { Host } from 'src/models/host';
import { FindHostService } from '@functions/schedule/find_host/service';

const logger = createLogger('findHost');
const service = new FindHostService();

const findHost: APIGatewayProxyHandler = async (event) => {
  const user = event.pathParameters.userId;
  
  let memberId = "";
  if(event.queryStringParameters && event.queryStringParameters.memberId != null) {
    memberId = event.queryStringParameters.memberId;
  }

  logger.info(`find host for user ${user}`);

  try {

    const host: Host = await service.findHost(user, memberId);
    
    return formatJSONResponse({
      memberId: host.current.memberId,
      image: host.current.image,
      nickName: host.current.nickName,
      end: host.end,
      start: host.start
    });

  } catch(e) {
    return notFound({message: e})
  }
}

export const main = middyfy(findHost);