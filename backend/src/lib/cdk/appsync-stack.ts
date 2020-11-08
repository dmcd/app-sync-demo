import { join } from 'path'
import * as cdk from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as ddb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda'
import { MappingTemplate } from '@aws-cdk/aws-appsync'

export class AppsyncStack extends cdk.Stack {
  postsHandler: lambda.Function

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'app-sync-demo-api',
      schema: appsync.Schema.fromAsset(
        join(process.cwd(), '../graphql/schema.graphql'),
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(60)),
          },
        },
      },
      xrayEnabled: true,
    })

    new cdk.CfnOutput(this, 'GraphQLURL', {
      value: api.graphqlUrl,
    })
    new cdk.CfnOutput(this, 'AppSyncAPIKey', {
      value: api.apiKey || '',
    })
    new cdk.CfnOutput(this, 'Stack Region', {
      value: this.region,
    })

    this.setupPostsApi(api)
  }

  setupPostsApi(api: appsync.GraphqlApi): void {
    this.postsHandler = new lambda.Function(this, 'postsHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'lambda-fns/posts/appsync-ds.handler',
      code: lambda.Code.fromAsset('backend.zip'),
      memorySize: 1024,
    })
    const postsDataSource = api.addLambdaDataSource(
      'postsDataSource',
      this.postsHandler,
    )

    const defaultRequestMappingTemplate = MappingTemplate.fromString(
      '{"version" : "2017-02-28","operation": "Invoke","payload": $util.toJson($context)}',
    )
    const defaultResponseMappingTemplate = MappingTemplate.fromString(
      '$util.toJson($context.result)',
    )

    const defaultResolverProps = {
      requestMappingTemplate: defaultRequestMappingTemplate,
      responseMappingTemplate: defaultResponseMappingTemplate,
    }

    postsDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'listPosts',
      ...defaultResolverProps,
    })

    postsDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createPost',
      ...defaultResolverProps,
    })

    postsDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deletePost',
      ...defaultResolverProps,
    })
  }

  setPrimaryTable(table: ddb.Table): void {
    table.grantFullAccess(this.postsHandler)
    this.postsHandler.addEnvironment('PRIMARY_TABLE', table.tableName)
  }
}
