import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.dev' })

import startServer from '../server'
import { terminateDDB } from '../utils'

let ddbSimulator: any
let ddbPath: string

process.on('SIGINT', async () => {
  console.log('terminating dynamodb...')
  await terminateDDB(ddbSimulator, ddbPath, false)
  process.exit()
})

async function main() {
  const server = await startServer()
  if (server) {
    ;({ ddbSimulator, ddbPath } = server)
  }
}

main()
