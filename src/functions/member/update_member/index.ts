import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'patch',
        path: 'member/{memberId}',
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
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.MEMBERS_TABLE}"
    }
  ]
}
