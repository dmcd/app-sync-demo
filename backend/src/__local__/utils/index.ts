import {
  AmplifyAppSyncSimulator,
  AmplifyAppSyncSimulatorConfig,
  AppSyncSimulatorDataSourceConfig,
  AppSyncSimulatorDataSourceLambdaConfig,
} from 'amplify-appsync-simulator'
import * as dynamoSimulator from 'amplify-dynamodb-simulator'
import * as fs from 'fs-extra'
import * as path from 'path'
import { ulid } from 'ulid'
import {
  configureDDBDataSource,
  createAndUpdateTable,
  MockDynamoDBConfig,
} from './dynamo-db'
import { getFunctionDetails } from './lambda'
import { DynamoDB } from 'aws-sdk'
import { invoke } from './lambda'

// this avoids copying amplify-dynamodb-simulator to ~/.amplify/lib on CI
if (typeof jest !== 'undefined') {
  jest.mock('amplify-cli-core', () => ({
    pathManager: {
      getAmplifyPackageLibDirPath: jest
        .fn()
        .mockReturnValue('node_modules/amplify-dynamodb-simulator'),
    },
  }))
}

export type DeployedAppSyncSimulator = {
  simulator: AmplifyAppSyncSimulator
  config: AmplifyAppSyncSimulatorConfig
}

export type MockDynamoDB = {
  ddbSimulator: any
  ddbPath: string
  ddbClient: DynamoDB
}

export async function launchDDBLocal(): Promise<MockDynamoDB> {
  let ddbPath = process.env.DYNAMODB_PATH
  if (!ddbPath) {
    while (true) {
      ddbPath = path.join('/tmp', `amplify-simulator-dynamodb-${ulid()}`)
      if (!fs.existsSync(ddbPath)) break
    }
  }

  fs.ensureDirSync(ddbPath)
  const ddbSimulator = await dynamoSimulator.launch({
    dbPath: ddbPath,
    port: process.env.DYNAMODB_PORT,
  })
  const ddbClient: DynamoDB = await dynamoSimulator.getClient(ddbSimulator)
  console.log(`DynamoDB path: ${ddbPath}`)
  return { ddbSimulator, ddbPath, ddbClient }
}

export async function deploy(
  config: AmplifyAppSyncSimulatorConfig,
  ddbConfig: MockDynamoDBConfig,
  ddbClient: DynamoDB,
  ddbSimulator: any,
): Promise<DeployedAppSyncSimulator> {
  await createAndUpdateTable(ddbClient, ddbConfig)
  config = configureDDBDataSource(config, ddbClient.config)
  config = await configureLambdaDataSource(config, ddbSimulator)
  const simulator = await runAppSyncSimulator(config)
  return { simulator, config }
}

async function configureLambdaDataSource(
  config: AmplifyAppSyncSimulatorConfig,
  ddbSimulator: any,
) {
  if (!config.dataSources) return config
  config.dataSources
    .filter((d) => d.type === 'AWS_LAMBDA')
    .forEach((d: AppSyncSimulatorDataSourceConfig) => {
      const lambdaConfig = getFunctionDetails(d.name)
      d = <AppSyncSimulatorDataSourceLambdaConfig>d
      d.invoke = (payload: any) => {
        logDebug('Invoking lambda with config', lambdaConfig)
        logDebug('with info', payload.info)
        logDebug('with arguments', payload.arguments)
        return invoke({
          ...lambdaConfig,
          event: payload,
          environment: {
            ...process.env,
            DYNAMODB_ENDPOINT: ddbSimulator.url,
            AWS_REGION: 'us-fake-1',
          },
        })
      }
    })
  return config
}

export async function terminateDDB(
  ddbSimulator: any,
  ddbPath: string,
  removeOnTerminate = true,
): Promise<void> {
  try {
    if (ddbSimulator && ddbSimulator.terminate) {
      await ddbSimulator.terminate()
    }
  } catch (e) {
    logDebug('Failed to terminate the Local DynamoDB Server', e)
  }
  if (removeOnTerminate) {
    try {
      fs.removeSync(ddbPath)
    } catch (e) {
      logDebug('Failed delete Local DynamoDB Server Folder', e)
    }
  }
}

export async function runAppSyncSimulator(
  config: AmplifyAppSyncSimulatorConfig,
  port?: number,
  wsPort?: number,
): Promise<AmplifyAppSyncSimulator> {
  const appsyncSimulator = new AmplifyAppSyncSimulator({ port, wsPort })
  appsyncSimulator.init(config)
  await appsyncSimulator.start()
  return appsyncSimulator
}

export function logDebug(message?: any, ...optionalParams: any[]): void {
  if (process.env.DEBUG || process.env.CI) {
    console.log(message, ...optionalParams)
  }
}
