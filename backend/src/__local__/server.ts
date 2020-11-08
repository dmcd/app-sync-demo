import * as fs from 'fs'
import { join } from 'path'
import { GraphQLClient } from './utils/graphql-client'
import { AmplifyAppSyncSimulator } from 'amplify-appsync-simulator'
import { deploy, launchDDBLocal } from './utils'
import { MockDynamoDBConfig } from './utils/dynamo-db'
import { defaultAppSyncConfig } from './config/appSync'
import { PrimaryTable } from './config/dynamodb'

export type LocalServer = {
  graphqlEndpoint: string
  graphqlClient: GraphQLClient
  ddbSimulator: any
  ddbPath: string
  appSyncServer: AmplifyAppSyncSimulator
}

export default async function main(): Promise<LocalServer | null> {
  try {
    const schema = await fs.promises.readFile(
      join(process.cwd(), '../graphql/schema.graphql'),
      'utf8',
    )

    const dynamoDBConfig: MockDynamoDBConfig = {
      tables: [
        {
          Properties: PrimaryTable,
        },
      ],
    }

    const { ddbPath, ddbSimulator, ddbClient } = await launchDDBLocal()
    const result = await deploy(
      defaultAppSyncConfig(schema),
      dynamoDBConfig,
      ddbClient,
      ddbSimulator,
    )
    console.log(`DynamoDB url: ${ddbSimulator.url}`)

    const appSyncServer: AmplifyAppSyncSimulator = result.simulator
    const graphqlEndpoint = appSyncServer.url + '/graphql'
    console.log(`Graphql url: ${graphqlEndpoint}`)

    const apiKey = result.config.appSync.apiKey
    console.log(`Appsync apiKey: ${apiKey}`)
    const graphqlClient = new GraphQLClient(graphqlEndpoint, {
      'x-api-key': apiKey,
    })
    return {
      graphqlEndpoint,
      graphqlClient,
      ddbSimulator,
      ddbPath,
      appSyncServer,
    }
  } catch (e) {
    console.error('error starting local servers')
    console.error(e)
    return null
  }
}
