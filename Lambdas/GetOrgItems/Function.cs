using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using System.Text.Json;
using Amazon.RDS.Util;
using Amazon;
using MySqlConnector;
namespace GetOrgItemTypes;

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

        Func<ILambdaContext, Task<string>> handler = FunctionHandler;
        await LambdaBootstrapBuilder.Create(handler, new DefaultLambdaJsonSerializer()).Build().RunAsync();
    }

    public static async Task<string> FunctionHandler(ILambdaContext context)
    {
        List<ItemType> types = new List<ItemType>();
        try
        {
            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                string sql = "select c.name as CharityName, item.name as ItemName, c.id as CharityId, item.id as ItemId from charity c join charity_item i on c.id = i.charity_id inner join item on item.id = i.item_id order by 1,2";
                using (MySqlCommand command = new MySqlCommand(sql, connection))
                {
                    using (MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            types.Add(new ItemType
                            {
                                CharityName = reader.GetString("CharityName"),
                                ItemName = reader.GetString("ItemName"),
                                CharityId = reader.GetInt32("CharityId"),
                                ItemId = reader.GetInt32("ItemId")
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
        return JsonSerializer.Serialize(types);
    }
}
public class ItemType
{
    public string CharityName { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public int CharityId { get; set; }
    public int ItemId { get; set; }
}