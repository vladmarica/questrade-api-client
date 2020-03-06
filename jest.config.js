module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  roots: [
    '<rootDir>/test',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: './test/tsconfig.test.json'
    }
  }
}
