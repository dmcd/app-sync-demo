import { AttributeValue } from '@aws-sdk/client-dynamodb'

type Item = {
  [key: string]: AttributeValue
}

export function stringItem(name: string, value: string): Item {
  return {
    [name]: {
      S: value,
    },
  }
}

export function optionalStringItem(name: string, value: string): Item | null {
  return value
    ? {
        [name]: {
          S: value,
        },
      }
    : null
}
