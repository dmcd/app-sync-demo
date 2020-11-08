import { existsSync } from 'fs-extra'
import * as path from 'path'

function loadFunction(fileName: string) {
  return require(path.resolve(fileName))
}

type InvokeOptions = {
  packageFolder: string
  handler: string
  fileName: string
  event: string
  context?: any
}

function invokeFunction(options: InvokeOptions) {
  return new Promise(async (resolve, reject) => {
    let returned = false

    const context = {
      done(error: any, result: any) {
        if (!returned) {
          returned = true
          if (error === null || typeof error === 'undefined') {
            context.succeed(result)
          } else {
            context.fail(error)
          }
        }
      },
      succeed(result: any) {
        returned = true
        resolve(result)
      },
      fail(error: any) {
        returned = true
        reject(Object.assign({}, error))
      },
      awsRequestId: 'LAMBDA_INVOKE',
      logStreamName: 'LAMBDA_INVOKE',
    }

    if (options.packageFolder) {
      const p = path.resolve(options.packageFolder)
      if (!existsSync(p)) {
        context.fail('packageFolder does not exist')
        return
      }
      process.chdir(p)
    } else {
      context.fail('packageFolder is not defined')
      return
    }

    if (!options.handler) {
      context.fail('handler is not defined')
      return
    }

    if (options.context) {
      Object.assign(context, options.context)
    }

    const callback = (error: any, object: any) => {
      context.done(error, object)
    }

    const lambda = loadFunction(options.fileName)

    const { event } = options
    try {
      if (!lambda[options.handler]) {
        context.fail(
          `handler ${
            options.handler
          } does not exist in the lambda function ${path.join(
            options.packageFolder,
            options.fileName,
          )}`,
        )
        return
      }
      const response = lambda[options.handler](event, context, callback)
      if (typeof response === 'object' && typeof response.then === 'function') {
        const result = await response
        if (result !== undefined) {
          context.done(null, result)
        } else {
          context.done(null, null)
        }
      } else if (response !== undefined) {
        context.done(null, null)
      }
    } catch (e) {
      context.done({ error: e.message, stack: e.stack }, null)
    }
  })
}

process.on('message', async (options) => {
  if (!process.send) process.exit(0)
  try {
    const result = await invokeFunction(JSON.parse(options))
    process.send(JSON.stringify({ result, error: null }))
  } catch (error) {
    process.send(JSON.stringify({ result: null, error }))
    process.exit(1)
  }
  process.exit(0)
})