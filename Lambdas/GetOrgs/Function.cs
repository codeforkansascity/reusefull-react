using Amazon;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using Amazon.RDS.Util;
using MySqlConnector;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GetOrgs;

public class Function
{
    static string _dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "reusefull.cq0mnx0ystdx.us-east-2.rds.amazonaws.com";
    static string _dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "reusefull";
    static int _dbPort = int.Parse(Environment.GetEnvironmentVariable("DB_PORT") ?? "3306");
    static RegionEndpoint _dbRegion = RegionEndpoint.GetBySystemName(Environment.GetEnvironmentVariable("DB_REGION") ?? "us-east-2");
    static string _dbUser = "reusefullrds";
    private static string _connectionString = string.Empty;

    private static async Task Main(string[] args)
    {
#if DEBUG
        _dbUser = "";
        string pwd = "";
        _connectionString = $"Server={_dbHost};Database={_dbName};Port={_dbPort};User Id={_dbUser};Password={pwd};SSL Mode=Required;";
        var result = await FunctionHandler(null);
        return;
#endif
        string authToken = RDSAuthTokenGenerator.GenerateAuthToken(_dbRegion, _dbHost, _dbPort, _dbUser);

        _connectionString = $"Server={_dbHost};Port={_dbPort};Database={_dbName};" +
                                  $"User={_dbUser};Password={authToken};SSL Mode=Required;";

        Func<ILambdaContext, Task<string>> handler = async (context) =>
        {
            return await FunctionHandler(context);
        };

        await LambdaBootstrapBuilder.Create(
            handler,
            new SourceGeneratorLambdaJsonSerializer<CustomSerializer>()
        ).Build().RunAsync();
    }

    public static async Task<string> FunctionHandler(ILambdaContext context)
    {
        List<ItemType> types = new List<ItemType>();
        try
        {
            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                string sql = "select id, name, address, zip_code, phone, email, contact_name, mission, description, link_volunteer, link_website, link_wishlist, pickup, dropoff, resell, faith, good_items, new_items, logo_url, city, state, lat, lng from charity where approved=1 and paused=0";
                using (MySqlCommand command = new MySqlCommand(sql, connection))
                {
                    using (MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            types.Add(new ItemType
                            {
                                Id = reader.GetInt32("id"),
                                Name = reader.GetString("name")
                            });
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"connstring={_connectionString} and error: {ex.Message}");
        }
        string serializedTypes = JsonSerializer.Serialize(types, CustomSerializer.Default.ListItemType);
        //LambdaLogger.Log($"Reusefull Serialized types: {serializedTypes}");
        return serializedTypes;
    }
}

[JsonSerializable(typeof(APIGatewayProxyRequest))]
[JsonSerializable(typeof(APIGatewayProxyResponse))]
[JsonSerializable(typeof(ItemType))]
[JsonSerializable(typeof(List<ItemType>))]
public partial class CustomSerializer : JsonSerializerContext
{
}

public class ItemType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}