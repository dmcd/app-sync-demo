import { App } from '../lib/cdk/app'

test('Stacks', () => {
  const app = new App()
  app.deploy('test')
  const assembly = app.synth()
  expect(assembly.getStackByName('test-Dynamodb')).toBeDefined()
  expect(assembly.getStackByName('test-Appsync')).toBeDefined()
})
