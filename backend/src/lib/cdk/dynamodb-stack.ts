import * as cdk from '@aws-cdk/core'
import * as ddb from '@aws-cdk/aws-dynamodb'

export class DynamodbStack extends cdk.Stack {
  primaryTable: ddb.Table

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.primaryTable = this.newPrimaryTable()
  }

  // should be kept insync with backend/src/__local__/config/dynamodb.ts

  newPrimaryTable(): ddb.Table {
    const table = new ddb.Table(this, 'Primary', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'pk',
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: ddb.AttributeType.STRING,
      },
    })
    table.addGlobalSecondaryIndex({
      indexName: 'gsi-1',
      partitionKey: {
        name: 'sk',
        type: ddb.AttributeType.STRING,
      },
    })
    return table
  }
}
