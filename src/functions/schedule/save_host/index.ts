import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'host/save',
        cors: true,
        authorizer: "auth",
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: [
        "dynamodb:PutItem"
      ],
      Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.HOST_TABLE}"
    }
  ]
}
