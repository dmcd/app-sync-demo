import { DynamoDB } from 'aws-sdk'
import {
  createTables,
  describeTables,
  getUpdateTableInput,
  updateTables,
} from './utils'
import {
  AmplifyAppSyncSimulatorConfig,
  AppSyncSimulatorDataSourceConfig,
} from 'amplify-appsync-simulator'
import { CreateTableInput, UpdateTableInput } from 'aws-sdk/clients/dynamodb'

export type MockDynamoDBConfig = {
  tables: { Properties: CreateTableInput }[]
}

export async function createAndUpdateTable(
  dynamoDbClient: DynamoDB,
  config: MockDynamoDBConfig,
): Promise<void> {
  const tables = config.tables.map((table) => table.Properties)
  const existingTables = await dynamoDbClient.listTables().promise()
  const existingTablesWithDetails = await describeTables(
    dynamoDbClient,
    existingTables.TableNames as Array<string>,
  )
  const tablesToCreate = tables.filter((t) => {
    const tableName = t.TableName
    return !(existingTables.TableNames as Array<string>).includes(tableName)
  })

  const tablesToUpdate = tables.filter((t) => {
    const tableName = t.TableName
    return (existingTables.TableNames as Array<string>).includes(tableName)
  })
  await createTables(dynamoDbClient, tablesToCreate)
  const updateTableInputs = tablesToUpdate.reduce(
    (previousValue, currentValue) => {
      const existingTableDetail =
        existingTablesWithDetails[currentValue.TableName]
      return [
        ...previousValue,
        ...getUpdateTableInput(currentValue, existingTableDetail),
      ]
    },
    [] as UpdateTableInput[],
  )
  await updateTables(dynamoDbClient, updateTableInputs)
}

export function configureDDBDataSource(
  config: AmplifyAppSyncSimulatorConfig,
  ddbConfig: DynamoDB.Types.ClientConfiguration,
): AmplifyAppSyncSimulatorConfig {
  if (!config.dataSources) return config
  return {
    ...config,
    dataSources: config.dataSources.map(
      (d: AppSyncSimulatorDataSourceConfig) => {
        if (d.type !== 'AMAZON_DYNAMODB') {
          return d
        }
        return {
          ...d,
          config: {
            ...d.config,
            endpoint: ddbConfig.endpoint as string,
            region: ddbConfig.region,
            accessKeyId: ddbConfig.accessKeyId,
            secretAccessKey: ddbConfig.secretAccessKey,
          },
        }
      },
    ),
  }
}
