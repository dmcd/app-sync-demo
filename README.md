# AppSync Demo

A demo application using AWS AppSync, DynamoDB, and NextJS

It allows you to have full control of how your AWS resources are deployed and supports DynamoDB single table design unlike AWS Amplify (at the time of writing). 

## Backend

1. Install dependencies

```sh
cd backend
npm install
```

2. Copy DynamoDB simulator into your home directory
``` sh
rsync -ahp node_modules/amplify-dynamodb-simulator ~/.amplify/lib/amplify-dynamodb-simulator
```

3. Create a `.env.dev`
```
PRIMARY_TABLE=Primary
AWS_ACCESS_KEY_ID=fake
AWS_SECRET_ACCESS_KEY=fake
DYNAMODB_PATH=/tmp/app-sync-demo-dev-dynamodb
```

4. Start the backend (doesn't yet support hot reloading)

```sh
npm run dev
```

## Frontend

1. Install dependencies

```sh
cd frontend
npm install
```

2. Create a `.env.local`
```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://192.168.1.103:8900/graphql
NEXT_PUBLIC_AWS_REGION=us-fake-1
NEXT_PUBLIC_APPSYNC_AUTHENTICATION_TYPE=API_KEY
NEXT_PUBLIC_APPSYNC_API_KEY=fake-api-key
```

3. Start the app

```sh
npm run dev
```

## Testing

#### Backend
```sh
cd backend
npm run test
npm run e2e
```

## Deployment

The app currently uses an AppSync API key which will be exposed to the internet. This should be changed to use AWS Cognito before deploying a permanent environment.

See [.github/workflows/main.yml](.github/workflows/main.yml)
