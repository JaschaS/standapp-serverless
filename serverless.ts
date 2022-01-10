import type { AWS } from '@serverless/typescript';

import getAllMembers from '@functions/member/get_all'
import addMember from '@functions/member/add_member'
import deleteMember from '@functions/member/delete_member'
import updateMember from '@functions/member/update_member'
import currentHost from '@functions/schedule/current_host'
import privateCurrentHost from '@functions/private/current_host'
import findHost from '@functions/schedule/find_host'
import privateFindHost from '@functions/private/find_host'
import saveHost from '@functions/schedule/save_host'
import auth from '@functions/auth'
import history from '@functions/schedule/history'
import privateHistory from '@functions/private/history'
import privateSaveHost from '@functions/private/save_host'

const serverlessConfiguration: AWS = {
  service: 'standapp-serverless',
  variablesResolutionMode: "20210326",
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
      apiKeys: [
        "testKey"
      ]
    },
    tracing: {
        lambda: true,
        apiGateway: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      MEMBERS_TABLE: "members",
      HOST_TABLE: "hosts",
      CLIENT_EMAIL: "${ssm:/clientEmail}",
      PRIVATE_KEY: "${ssm:/privateKey}",
      PROJECT_ID: "${ssm:/projectId}",
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { 
    auth, 
    getAllMembers, 
    addMember, 
    deleteMember, 
    updateMember, 
    currentHost, 
    findHost, 
    saveHost, 
    history, 
    privateCurrentHost,
    privateFindHost,
    privateHistory,
    privateSaveHost
  },
  resources: {
    Resources: {
      MembersDB: {
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
            TableName: "${self:provider.environment.MEMBERS_TABLE}",
        }
      },
      HostDB: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            AttributeDefinitions: [
                {
                    AttributeName: "userId",
                    AttributeType: "S"
                },
                {
                    AttributeName: "hostState",
                    AttributeType: "S"
                },
            ],
            KeySchema: [
                {
                    AttributeName: "userId",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "hostState",
                    KeyType: "RANGE"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            },
            TableName: "${self:provider.environment.HOST_TABLE}",
        }
      },
      GatewayResponseDefault4xx: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
            ResponseParameters: {
                "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
                "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
            },
            ResponseType: "DEFAULT_4XX",
            RestApiId: {
                Ref: "ApiGatewayRestApi"
            }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
