import {
  AmplifyAppSyncSimulatorConfig,
  AmplifyAppSyncSimulatorAuthenticationType,
  RESOLVER_KIND,
} from 'amplify-appsync-simulator'

export function defaultAppSyncConfig(
  schema: string,
): AmplifyAppSyncSimulatorConfig {
  return {
    appSync: {
      defaultAuthenticationType: {
        authenticationType: AmplifyAppSyncSimulatorAuthenticationType.API_KEY,
      },
      name: 'local',
      apiKey: 'fake-api-key',
      additionalAuthenticationProviders: [],
    },
    schema: {
      content: schema,
    },
    mappingTemplates: [],
    dataSources: [
      {
        type: 'AWS_LAMBDA',
        name: 'posts',
        invoke: () => {
          throw new Error(`posts datasource not found`)
        },
      },
    ],
    resolvers: [
      { fieldName: 'createPost', typeName: 'Mutation' },
      { fieldName: 'deletePost', typeName: 'Mutation' },
      { fieldName: 'listPosts', typeName: 'Query' },
    ].map((r) => {
      return {
        kind: RESOLVER_KIND.UNIT,
        typeName: r.typeName,
        fieldName: r.fieldName,
        dataSourceName: 'posts',
        requestMappingTemplate: '{"payload": $util.toJson($context)}',
        responseMappingTemplate: '$util.toJson($context.result)',
      }
    }),
  }
}
