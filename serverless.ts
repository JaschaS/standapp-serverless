import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import getAllMembers from '@functions/member/get_all'
import addMember from '@functions/member/add_member'
import deleteMember from '@functions/member/delete_member'
import updateMember from '@functions/member/update_member'

const serverlessConfiguration: AWS = {
  service: 'standapp-serverless',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: "serverless",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    tracing: {
        lambda: true,
        apiGateway: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      STANDAPP_TABLE: "standapp",
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { hello, getAllMembers, addMember, deleteMember, updateMember },
  resources: {
    Resources: {
      StandAppDB: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            AttributeDefinitions: [
                {
                    AttributeName: "userId",
                    AttributeType: "S"
                },
                {
                    AttributeName: "memberId",
                    AttributeType: "S"
                }
            ],
            KeySchema: [
                {
                    AttributeName: "userId",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "memberId",
                    KeyType: "RANGE"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            },
            TableName: "${self:provider.environment.STANDAPP_TABLE}",
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;
