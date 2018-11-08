const path = require('path');

const rootDir = path.resolve(__dirname/*, '../../'*/);
const fromRoot = (...subPaths) => path.resolve(rootDir, ...subPaths);

module.exports = {
    rootDir: rootDir,
    roots: [
        '<rootDir>/src',
        '<rootDir>/test',
        '<rootDir>/build'
    ],
    verbose: true,
    testMatch: [
        fromRoot('src/**/*.(test|spec).ts'),
        fromRoot('build/**/*.(test|spec).ts'),
        fromRoot('build/**/tests/**/!(__)*.ts'),
        fromRoot('test/**/!(__)*.ts')
    ],
    moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
    preset: 'ts-jest'
};
