'use strict';

const convict   = require('convict');
const parseArgs = require('minimist');

// Argument Parsing.
const argv = parseArgs(process.argv.slice(2));

// Convict from file.
const convictConf = convict({
    'cache': {
        'enabled': {
            doc: 'use a cache?',
            format: Boolean,
            default: true,
            arg: 'cache-enabled',
            env: 'CACHE_ENABLED'
        },
        'size': {
            doc: 'size of cache in bytes',
            format: Number,
            default: 67108864,
            arg: 'cache-size',
            env: 'CACHE_SIZE'
        }        
    },
    'port': {
            doc: 'Http Port to listen on',
            format: 'port',
            default: 8080,
            arg: 'port',
            env: 'PORT'
        },
    'db': {
        'type': {
            doc: 'The type of the database',
            format: ['postgres'],
            default: 'postgres',
            arg: 'db-type',
            env: 'DB_TYPE'
        },
        'host': {
            doc: 'The host of the database',
            format: String,
            default: 'localhost',
            arg: 'db-host',
            env: 'DB_HOST'
        },
        'port': {
            doc: 'The port of the database',
            format: 'port',
            default: 5432,
            arg: 'db-port',
            env: 'DB_PORT'
        },
        'name': {
            doc: 'The name of the database',
            format: String,
            default: 'postgres',
            arg: 'db-name',
            env: 'DB_NAME'
        },
        'user': {
            doc: 'The username of the database',
            format: String,
            default: 'postgres',
            arg: 'db-user',
            env: 'DB_USER'
        },
        'password': {
            doc: 'The password of the database',
            format: String,
            default: '123',
            arg: 'db-password',
            env: 'DB_PASSWORD'
        },
        'sync': {
            doc: 'Boolean option to control whether to sync the database',
            format: Boolean,
            default: false,
            arg: 'db-sync',
            env: 'DB_SYNC'
        },
        'forcesync': {
            doc: 'Boolean option to control whether to force sync(drop/re-create tables) the database',
            format: Boolean,
            default: false,
            arg: 'db-forcesync',
            env: 'DB_FORCESYNC'
        }
    },
  'logging': {
        'name': {
            doc: 'Service name for the logger',
            format: String,
            default: 'feeds',
            arg: 'logging-name',
            env: 'LOGGING_NAME'
        },
        'stdout': {
            'enable': {
                doc: 'Boolean option to control whether to log to stdout',
                format: Boolean,
                default: true,
                arg: 'logging-stdout-enable',
                env: 'LOGGING_STDOUT_ENABLE'
            },
            'level': {
                doc: 'Log level for stdout',
                format: String,
                default: 'debug',
                arg: 'logging-stdout-level',
                env: 'LOGGING_STDOUT_LEVEL'
            }
        },
        'file': {
            'enable': {
                doc: 'Boolean option to control whether to log to file',
                format: Boolean,
                default: false,
                arg: 'logging-file-enable',
                env: 'LOGGING_FILE_ENABLE'
            },
            'level': {
                doc: 'Log level for file',
                format: String,
                default: 'info',
                arg: 'logging-file-level',
                env: 'LOGGING_FILE_LEVEL'
            },
            'path': {
                doc: 'Log file path',
                format: String,
                default: 'feeds.log',
                arg: 'logging-file-path',
                env: 'LOGGING_FILE_PATH'
            }
        }
    },
})

if (argv['cfg']) {
    convictConf.loadFile(argv['cfg']);
}
convictConf.validate();

module.exports = convictConf;

