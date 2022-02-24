import getDbConnection from '../database/sequelize/connection';
import getDbModel from '../database/sequelize/db';

class DeviceTypesResolver {
    constructor(getConnectionCallback) {
        this.env = process.env.STAGE || 'dev';
        this.region = process.env.REGION || 'us-east-1';

        this.getConnectionCallback = getConnectionCallback || getDbConnection;
    }

    async process(event, context) {
        try {
            console.log(`Event: ${JSON.stringify(event, 3)}`);
            console.log(`Context: ${JSON.stringify(context, 3)}`);
            context.callbackWaitsForEmptyEventLoop = false;

            const db = await getDbModel(await this.getConnectionCallback());
            const { DeviceTypes, Sequelize } = db;
            const { Op } = Sequelize;

            let predicate = null;
            let field;
            if (Array.isArray(event)) {
                console.log('Received batch event ', JSON.stringify(event, 3));
                field = event[0].field;
            } else {
                console.log('Received event ', JSON.stringify(event, 3));
                field = event.field;
            }

            switch (field) {
            case 'getDeviceType': {
                const deviceType = await DeviceTypes.findByPk(event.arguments.name);
                return deviceType;
            }
            case 'allDeviceTypes': {
                const deviceTypes = await DeviceTypes.findAll();
                return deviceTypes;
            }
            case 'addDeviceType': {
                const inputType = { ...event.arguments.input };
                const deviceType = DeviceTypes.create(inputType);
                return deviceType;
            }
            case 'updateDeviceType': {
                const inputType = event.arguments.input;
                const existingType = await DeviceTypes.findByPk(inputType.name);
                if (!existingType) {
                    const errorMessage = `DeviceType not found: ${inputType.name}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }

                if (!Object.keys(inputType).length) {
                    console.debug('Nothing to update.  Returning existing entity.');
                    return existingType;
                }

                const updatedDeviceType = await existingType.update(inputType);
                return updatedDeviceType;
            }
            case 'deleteDeviceType': {
                const inputType = event.arguments.input;
                const existingType = await DeviceTypes.findByPk(inputType.name);
                if (!existingType) {
                    const errorMessage = `DeviceType not found: ${inputType.name}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }

                await DeviceTypes.destroy({ where: { name: inputType.name } });
                return existingType;
            }
            case 'searchDeviceTypes': {
                const inputType = event.arguments.input;
                predicate = null;
                if (inputType) {
                    const clauses = [];
                    Object.keys(inputType).forEach(key => {
                        const clause = {};
                        clause[key] = {
                            [Op.like]: `%${inputType[key]}%`,
                        };

                        clauses.push(clause);
                    });

                    predicate = {
                        where: {
                            [Op.and]: clauses,
                        },
                    };
                }

                const deviceTypes = await DeviceTypes.findAll(predicate);
                return deviceTypes;
            }
            default:
                throw new Error(`Unknown field, unable to resolve '${event.field}'`);
            }
        } catch (err) {
            console.error(`Error: ${err}`);
            throw err;
        }
    }
}

async function handler(event, context) {
    const lambda = new DeviceTypesResolver(getDbConnection);
    return lambda.process(event, context);
}

export { DeviceTypesResolver, handler };
