const path = require('path');

const rootDir = path.resolve(__dirname/*, '../../'*/);
const fromRoot = (...subPaths) => path.resolve(rootDir, ...subPaths);

module.exports = {
    rootDir: rootDir,
    // roots: [
    //     '<rootDir>/src',
    //     '<rootDir>/test',
    //     '<rootDir>/build'
    // ],
    setupTestFrameworkScriptFile: '<rootDir>/build/dashboard/ink2/tests/__setup.js',
    verbose: true,
    testEnvironment: 'node',
    // moduleNameMapper: {
    //     'template-ts-jest-webpack/(.*)': '$1'
    // },
    testMatch: [
        fromRoot('src/**/*.(test|spec).ts?(x)'),
        fromRoot('build/**/*.(test|spec).ts?(x)'),
        fromRoot('build/**/tests/**/!(__)*.ts?(x)'),
        fromRoot('test/**/!(__)*.ts?(x)')
    ],
    moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
    preset: 'ts-jest'
};
