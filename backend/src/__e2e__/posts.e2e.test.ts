import './config' // must be the first import
import startServer from '../__local__/server'
import { terminateDDB, logDebug } from '../__local__/utils'
import { GraphQLClient } from '../__local__/utils/graphql-client'
import { AmplifyAppSyncSimulator } from 'amplify-appsync-simulator'

jest.setTimeout(2000000)

let graphqlClient: GraphQLClient
let ddbSimulator: any
let ddbPath: string
let appSyncServer: AmplifyAppSyncSimulator

beforeAll(async () => {
  const server = await startServer()
  if (server) {
    ;({ graphqlClient, ddbSimulator, ddbPath, appSyncServer } = server)
  }
})

afterAll(async () => {
  if (appSyncServer) {
    await appSyncServer.stop()
  }
  await terminateDDB(ddbSimulator, ddbPath)
})

afterEach(async () => {
  try {
    const response = await graphqlClient.query(
      `
      query {
        listPosts {
          items {
            id
          }
        }
      }`,
      {},
    )
    expect(response.errors).toBeUndefined()
    const rows = response.data.listPosts.items || []
    const deletePromises = <any>[]
    logDebug('deleting posts...')
    rows.forEach((row: any) => {
      deletePromises.push(
        graphqlClient.query(
          `
          mutation delete {
            deletePost(input: {id: "${row.id}"}) { id }
          }`,
          {},
        ),
      )
    })
    await Promise.all(deletePromises)
  } catch (e) {
    console.error(e)
  }
})

/**
 * Test queries below
 */
test('Test createPost mutation', async (done) => {
  try {
    const response = await graphqlClient.query(
      `mutation {
          createPost(
            post: { 
              userId: "user0", 
              title: "Amazing thing",
              description: "So amazing",
              sourceUrl: "amazing-thing.com"
            }) {
              id
              title
              createdAt
              updatedAt
          }
      }`,
      {},
    )
    expect(response.errors).toBeUndefined()
    expect(response.data.createPost.id).toBeDefined()
    expect(response.data.createPost.title).toEqual('Amazing thing')
    expect(response.data.createPost.createdAt).toBeDefined()
    expect(response.data.createPost.updatedAt).toBeDefined()
  } catch (e) {
    console.error(e)
    // fail
    expect(e).toBeUndefined()
  }
  done()
})
