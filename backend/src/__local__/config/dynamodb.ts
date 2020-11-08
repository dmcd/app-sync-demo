import { CreateTableInput } from 'aws-sdk/clients/dynamodb'

// should be kept insync with backend/src/lib/cdk/dynamodb-stack.ts

export const PrimaryTable: CreateTableInput = {
  TableName: process.env.PRIMARY_TABLE || '',
  KeySchema: [
    {
      AttributeName: 'pk',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'sk',
      KeyType: 'RANGE',
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'pk',
      AttributeType: 'S',
    },
    {
      AttributeName: 'sk',
      AttributeType: 'S',
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'gsi-1',
      KeySchema: [
        {
          AttributeName: 'sk',
          KeyType: 'HASH',
        },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
  BillingMode: 'PAY_PER_REQUEST',
}
