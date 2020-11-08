module.exports = {
  roots: ['<rootDir>/src'],
  testRegex: '(src/(__tests__|__e2e__)/.*.test.ts)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.tests.json',
    },
  },
}
