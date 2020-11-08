import * as path from 'path'
import * as fs from 'fs-extra'
import { fork } from 'child_process'

export type FunctionDetails = {
  packageFolder: string
  fileName: string
  handler: string
}

export function getFunctionDetails(functionName: string): FunctionDetails {
  const lambdaFolder = path.join('build/lambda-fns', functionName)
  const fileName = 'appsync-ds.js'
  const filePath = path.join(lambdaFolder, fileName)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Can not find lambda function: ${filePath}`)
  }

  return {
    packageFolder: lambdaFolder,
    fileName: fileName,
    handler: 'handler',
  }
}

export function invoke(options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const lambdaFn = fork('build/__local__/utils/lambda/execute.js', [], {
        execArgv: [],
        env: options.environment || {},
      })
      lambdaFn.on('message', (msg: string) => {
        const result = JSON.parse(msg)
        if (result.error) {
          reject(result.error)
        }
        resolve(result.result)
      })
      lambdaFn.send(JSON.stringify(options))
    } catch (e) {
      reject(e)
    }
  })
}
