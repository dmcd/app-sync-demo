import * as cdk from '@aws-cdk/core'
import { AppsyncStack } from './appsync-stack'
import { DynamodbStack } from './dynamodb-stack'

export class App extends cdk.App {
  constructor(props?: cdk.AppProps) {
    super(props)
  }

  deploy(envName: string): void {
    const dynamodbStack = new DynamodbStack(this, `${envName}-Dynamodb`)
    const appsyncStack = new AppsyncStack(this, `${envName}-Appsync`)
    appsyncStack.setPrimaryTable(dynamodbStack.primaryTable)
  }
}
