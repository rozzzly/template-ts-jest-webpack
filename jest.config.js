const path = require('path');

const rootDir = path.resolve(__dirname/*, '../../'*/);
const fromRoot = (...subPaths) => path.resolve(rootDir, ...subPaths);

module.exports = {
    rootDir: rootDir,
    roots: [ 
        '<rootDir>/src',
        '<rootDir>/test'
    ],
    verbose: true,
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: [
        fromRoot('src/**/*.(test|spec).ts'),
        fromRoot('test/**/!(__)*.ts')
    ],
    moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
    globals: {
        'ts-jest': {
            skipBabel: true,
            tsConfigFile: fromRoot('tsconfig.json')
        }
    }
};