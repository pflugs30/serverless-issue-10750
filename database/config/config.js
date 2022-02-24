module.exports = {
    dev: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: '127.0.0.1',
        port: 3307,
        dialect: 'mysql',
        dialectOptions: {
            multipleStatements: true,
        },
        migrationStorage: 'json',
        migrationStoragePath: 'database/sequelize-meta-dev.json',
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: '127.0.0.1',
        port: 3307,
        dialect: 'mysql',
        dialectOptions: {
            multipleStatements: true,
        },
        migrationStorage: 'json',
        migrationStoragePath: 'database/sequelize-meta-test.json',
    },
    testldc: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: '127.0.0.1',
        port: 3307,
        dialect: 'mysql',
        dialectOptions: {
            multipleStatements: true,
        },
        migrationStorage: 'json',
        migrationStoragePath: 'database/sequelize-meta-testldc.json',
    },
    prod: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: '127.0.0.1',
        port: 3307,
        dialect: 'mysql',
        dialectOptions: {
            multipleStatements: true,
        },
        migrationStorage: 'json',
        migrationStoragePath: 'database/sequelize-meta-prod.json',
    },
};
