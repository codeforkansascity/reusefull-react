const mysql = require('mysql2/promise');
const { Signer } = require('@aws-sdk/rds-signer');

/**
 * Gets database connection configuration
 */
function getDbConfig() {
    const dbHost = process.env.DB_HOST || 'reusefull.cq0mnx0ystdx.us-east-2.rds.amazonaws.com';
    const dbName = process.env.DB_NAME || 'reusefull';
    const dbPort = parseInt(process.env.DB_PORT || '3306');
    const dbRegion = process.env.DB_REGION || 'us-east-2';
    const dbUser = 'reusefullrds';

    return { dbHost, dbName, dbPort, dbRegion, dbUser };
}

/**
 * Gets database connection string with IAM authentication
 */
async function getConnectionString() {
    const { dbHost, dbName, dbPort, dbRegion, dbUser } = getDbConfig();
    
    // Generate IAM auth token
    const signer = new Signer({
        hostname: dbHost,
        port: dbPort,
        region: dbRegion,
        username: dbUser
    });

    const authToken = await signer.getAuthToken();

    return {
        host: dbHost,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: authToken,
        ssl: { rejectUnauthorized: false },
        authPlugins: {
            mysql_clear_password: () => () => authToken
        }
    };
}

/**
 * Lambda handler function
 */
exports.handler = async (event, context) => {
    let connection;
    const types = [];

    try {
        // Get connection configuration
        const config = await getConnectionString();
        
        // Create connection
        connection = await mysql.createConnection(config);

        // Execute query
        const sql = 'SELECT id, name FROM item';
        const [rows] = await connection.execute(sql);

        // Map results to ItemType objects
        rows.forEach(row => {
            types.push({
                Id: row.id || 0,
                Name: row.name || ''
            });
        });

        return JSON.stringify(types);

    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    } finally {
        // Close connection
        if (connection) {
            await connection.end();
        }
    }
};
