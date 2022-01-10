import schema from '@functions/schedule/save_host/schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'private/{userId}/save',
        cors: true,
        private: true,
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
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.HOST_TABLE}"
    },
    {
      Effect: "Allow",
      Action: [
        "dynamodb:PutItem"
      ],
      Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.MEMBERS_TABLE}"
    }
  ]
}
