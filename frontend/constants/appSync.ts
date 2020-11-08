import { AuthOptions, AUTH_TYPE } from 'aws-appsync-auth-link'

export type AppSyncConfig = {
  url: string
  region: string
  auth: AuthOptions
}

const config: AppSyncConfig = {
  url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '',
  region: process.env.NEXT_PUBLIC_AWS_REGION || '',
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY || '',
    // jwtToken: async () => token, // Required when you use Cognito UserPools OR OpenID Connect. token object is obtained previously
  },
}

export default config
