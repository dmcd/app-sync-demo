import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb'
import List from './models/List'
import Post from './models/Post'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
})

async function listPosts(
  limit?: number,
  nextToken?: string,
): Promise<List<Post> | null> {
  let params: QueryCommandInput = {
    TableName: process.env.PRIMARY_TABLE,
    IndexName: 'gsi-1',
    KeyConditionExpression: 'sk = :sk',
    ExpressionAttributeValues: {
      ':sk': {
        S: 'post-meta',
      },
    },
    ScanIndexForward: true,
    Limit: limit || 30,
  }
  if (nextToken) {
    params = {
      ...params,
      ExclusiveStartKey: {
        pk: {
          S: nextToken,
        },
      },
    }
  }
  try {
    const command = new QueryCommand(params)
    const data = await client.send(command)
    if (!data.Items) return null

    return {
      items: data.Items.map((item) => {
        return {
          id: item.pk.S,
          userId: item.userId.S,
          createdAt: item.createdAt.S,
          updatedAt: item.updatedAt.S,
          title: item.title?.S,
          description: item.description?.S,
          sourceUrl: item.sourceUrl?.S,
        } as Post
      }),
      nextToken: data.LastEvaluatedKey?.pk.S,
    }
  } catch (err) {
    console.log('listPosts error: ', err)
    return null
  }
}

export default listPosts
