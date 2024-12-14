using Amazon;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using Amazon.RDS.Util;
using MySqlConnector;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ReusefullCommonLibrary
{
    public static class DatabaseHelper
    {
        static string _dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "reusefull.cq0mnx0ystdx.us-east-2.rds.amazonaws.com";
        static string _dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "reusefull";
        static int _dbPort = int.Parse(Environment.GetEnvironmentVariable("DB_PORT") ?? "3306");
        static RegionEndpoint _dbRegion = RegionEndpoint.GetBySystemName(Environment.GetEnvironmentVariable("DB_REGION") ?? "us-east-2");
        static string _dbUser = "reusefullrds";

        public static async Task<MySqlDataReader> GetData(string sql)
        {
            string connectionString = GetConnectionString();

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();
                using (MySqlCommand command = new MySqlCommand(sql, connection))
                {
                    using (MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync())
                    {
                        return reader;
                    }
                }
            }
            return null;
        }

        public static string GetConnectionString()
        {
            string connectionString = string.Empty;
            string pwd = "";
#if DEBUG
            pwd = "";
            _dbUser = "";
            connectionString = $"Server={_dbHost};Database={_dbName};Port={_dbPort};User Id={_dbUser};Password={pwd};SSL Mode=Required;";
#endif
            string authToken = RDSAuthTokenGenerator.GenerateAuthToken(_dbRegion, _dbHost, _dbPort, _dbUser);

            connectionString = $"Server={_dbHost};Port={_dbPort};Database={_dbName};" +
                                      $"User={_dbUser};Password={authToken};SSL Mode=Required;";
            return connectionString;
        }
    }
}
