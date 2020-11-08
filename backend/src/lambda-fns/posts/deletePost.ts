import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
})

async function deletePost(id: string): Promise<boolean> {
  const params = {
    TableName: process.env.PRIMARY_TABLE,
    Key: {
      pk: {
        S: id,
      },
    },
  }
  try {
    const command = new DeleteItemCommand(params)
    await client.send(command)
    return true
  } catch (err) {
    console.log('deletePost error: ', err)
    return false
  }
}

export default deletePost
