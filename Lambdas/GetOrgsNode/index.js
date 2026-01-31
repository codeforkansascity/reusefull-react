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
    const orgs = [];

    try {
        // Get connection configuration
        const config = await getConnectionString();

        // Create connection
        connection = await mysql.createConnection(config);

        // Execute query - Get all charity/organization data
        const sql = `SELECT 
            id as Id,
            name as Name,
            address as Address,
            zipcode as ZipCode,
            phone as Phone,
            email as Email,
            contactname as ContactName,
            mission as Mission,
            description as Description,
            linkvolunteer as LinkVolunteer,
            linkwebsite as LinkWebsite,
            linkwishlist as LinkWishlist,
            pickup as Pickup,
            dropoff as Dropoff,
            resell as Resell,
            faith as Faith,
            gooditems as GoodItems,
            newitems as NewItems,
            logourl as LogoUrl,
            city as City,
            state as State,
            lat as Lat,
            lng as Lng
        FROM charity where approved=1 and paused=0
        ORDER BY name`;
        
        const [rows] = await connection.execute(sql);

        // Map results to organization objects
        rows.forEach(row => {
            orgs.push({
                Id: row.Id || 0,
                Name: row.Name || '',
                Address: row.Address || '',
                ZipCode: row.ZipCode || '',
                Phone: row.Phone || '',
                Email: row.Email || '',
                ContactName: row.ContactName || '',
                Mission: row.Mission || '',
                Description: row.Description || '',
                LinkVolunteer: row.LinkVolunteer || '',
                LinkWebsite: row.LinkWebsite || '',
                LinkWishlist: row.LinkWishlist || '',
                Pickup: row.Pickup || false,
                Dropoff: row.Dropoff || false,
                Resell: row.Resell || false,
                Faith: row.Faith || false,
                GoodItems: row.GoodItems || false,
                NewItems: row.NewItems || false,
                LogoUrl: row.LogoUrl || '',
                City: row.City || '',
                State: row.State || '',
                Lat: row.Lat || 0,
                Lng: row.Lng || 0
            });
        });

        return JSON.stringify(orgs);

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
