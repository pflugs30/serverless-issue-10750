import * as AWS from 'aws-sdk';
import Sequelize from 'sequelize';

let connection;
export default async function getDbConnection() {
    console.debug('In getDbConnection()');
    if (connection) {
        console.log('returning cached connection');
        return connection;
    }

    // TODO: Remove this hack dependent on an environment variable
    let settings;
    if (process.env.ISLOCAL) {
        console.debug('Loading settings from environment variables');
        settings = {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            engine: 'mysql',
        };
    } else {
        console.log('Creating new connection.');
        const ssm = new AWS.SecretsManager({
            region: process.env.REGION,
        });
        console.log('Getting secret from AWS Secrets Manager...');
        const secretValue = await ssm.getSecretValue({ SecretId: process.env.SECRET }).promise();
        console.log('Got secret from AWS Secrets Manager.');

        const secrets = JSON.parse(secretValue.SecretString);
        settings = secrets;
    }

    console.log('Creating and caching Sequelize connection.');
    connection = new Sequelize({
        database: process.env.DB_NAME,
        username: settings.username,
        password: settings.password,
        host: settings.host,
        port: settings.port,
        dialect: settings.engine,
        dialectOptions: {
            connectTimeout: 60000,
            // requestTimeout: 20000, // Per https://stackoverflow.com/a/59441065/1459580
        },
        logging: console.log,
        operatorsAliases: '0',
        retry: {
            // For options, see https://github.com/mickhansen/retry-as-promised
            match: [
                // Retry only for errors of these types or matching these strings / Regex patterns
                Sequelize.ConnectionError,
                Sequelize.ConnectionRefusedError,
                Sequelize.ConnectionTimedOutError,
                Sequelize.HostNotFoundError,
                Sequelize.HostNotReachableError,
                Sequelize.InvalidConnectionError,
            ],
            backoffBase: 500, // Initial backoff duration in ms. Default: 100,
            backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
            timeout: 60000, // Sequelize will throw an error if a command receives no response or error within this amount of time in ms. Default: undefined
            max: 10, // Maximum amount of tries
        },
        pool: {
            max: 3,
            min: 0,
            acquire: 30000,
            idle: 3000,
        },
    });

    console.log('New connection created.');
    return connection;
}
