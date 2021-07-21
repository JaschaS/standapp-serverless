import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'host/find',
        cors: true,
        authorizer: "auth",
        request: {
          parameters: {
            querystrings: {
              memberId: false
            }
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
    },
    {
      Effect: "Allow",
      Action: [
        "dynamodb:Query",
      ],
      Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.HOST_TABLE}"
    }
  ]
}
