module.exports = {
  roots: [
    '<rootDir>/tests'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  // Die Quellen importieren mit .js-Endung, damit der Build in Node laufen
  // kann. Fuer jest wird die Endung wieder abgeschnitten, sonst sucht der
  // Resolver eine .js-Datei neben der .ts-Datei.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
