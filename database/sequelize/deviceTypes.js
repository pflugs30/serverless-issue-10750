const DeviceTypes = (connection, Sequelize) => {
    return connection.define('deviceTypes', {
        name: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false,
            field: 'name',
        },
    }, {
        schema: 'platform',
        timestamps: false,
        tableName: 'device_types',
    });
};

export default DeviceTypes;
