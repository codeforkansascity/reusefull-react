using Amazon;
using Amazon.RDS.Util;
using MySqlConnector;

namespace ReusefullCommonLibrary
{
    public static class DatabaseHelper
    {
        static string _dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "reusefull.cq0mnx0ystdx.us-east-2.rds.amazonaws.com";
        static string _dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "reusefull";
        static int _dbPort = int.Parse(Environment.GetEnvironmentVariable("DB_PORT") ?? "3306");
        static RegionEndpoint _dbRegion = RegionEndpoint.GetBySystemName(Environment.GetEnvironmentVariable("DB_REGION") ?? "us-east-2");
        static string _dbUser = "reusefullrds";

        public static string GetConnectionString()
        {
            string connectionString = string.Empty;
            string pwd = "";
#if DEBUG
            _dbUser = "reusefull";
            pwd = "";
            connectionString = $"Server={_dbHost};Database={_dbName};Port={_dbPort};User Id={_dbUser};Password={pwd};SSL Mode=Required;";
            return connectionString;
#endif

            string authToken = RDSAuthTokenGenerator.GenerateAuthToken(_dbRegion, _dbHost, _dbPort, _dbUser);

            connectionString = $"Server={_dbHost};Port={_dbPort};Database={_dbName};" +
                                      $"User={_dbUser};Password={authToken};SSL Mode=Required;";
            return connectionString;
        }
        public static Int32 SafeGetInt32FromDB(MySqlDataReader reader, string columnName)
        {
            return !reader.IsDBNull(reader.GetOrdinal(columnName)) ? reader.GetInt32(columnName) : 0;
        }
        public static bool SafeGetBooleanFromDB(MySqlDataReader reader, string columnName)
        {
            return !reader.IsDBNull(reader.GetOrdinal(columnName)) ? reader.GetBoolean(columnName) : false;
        }
        public static double SafeGetDoubleFromDB(MySqlDataReader reader, string columnName)
        {
            return !reader.IsDBNull(reader.GetOrdinal(columnName)) ? reader.GetDouble(columnName) : 0.0;
        }
    }
}
