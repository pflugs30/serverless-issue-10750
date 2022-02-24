/* eslint-disable new-cap */
import Sequelize from 'sequelize';

import getDbConnection from './connection';
import DeviceTypes from './deviceTypes';

let db;
export default async function getDbModel(conn) {
    console.debug('In getDbModel()');
    if (db) {
        console.log('returning cached db model');
        return db;
    }

    console.log('Defining sequelize db model.');
    let connection;
    if (conn) {
        console.log('Using given connection.');
        connection = conn;
    } else {
        connection = await getDbConnection();
    }

    console.log('Adding collections to db model.');
    db = {};
    db.DeviceTypes = DeviceTypes(connection, Sequelize);

    db.sequelize = connection;
    db.Sequelize = Sequelize;

    console.log('Configured new sequelize db model.');
    return db;
}
