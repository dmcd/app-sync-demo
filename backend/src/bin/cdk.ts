#!/usr/bin/env node
import 'source-map-support/register'
import { App } from '../lib/cdk/app'

const app = new App()
const envName = app.node.tryGetContext('envName')
app.deploy(envName)
