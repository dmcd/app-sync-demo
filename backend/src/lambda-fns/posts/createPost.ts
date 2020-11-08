import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb'
import { ulid } from 'ulid'
import CreatePostInput from './models/CreatePostInput'
import Post from './models/Post'
import { stringItem, optionalStringItem } from '../../lib/dynamodb/utils'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
})

async function createPost(post: CreatePostInput): Promise<Post | null> {
  const now = new Date().toISOString()
  const result: Post = {
    id: `post-${ulid()}`,
    createdAt: now,
    updatedAt: now,
    ...post,
  }

  const params: PutItemCommandInput = {
    TableName: process.env.PRIMARY_TABLE,
    Item: {
      ...stringItem('pk', result.id),
      ...stringItem('sk', 'post-meta'),
      ...stringItem('userId', post.userId),
      ...stringItem('createdAt', result.createdAt),
      ...stringItem('updatedAt', result.updatedAt),
      ...optionalStringItem('title', post.title),
      ...optionalStringItem('description', post.description),
      ...optionalStringItem('sourceUrl', post.sourceUrl),
    },
  }
  try {
    const command = new PutItemCommand(params)
    await client.send(command)
    return result
  } catch (err) {
    console.log('createPost error: ', err)
    return null
  }
}

export default createPost
