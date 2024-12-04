using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using MySql.Data.MySqlClient;
using Amazon.RDS.Util;
using Amazon;
using Newtonsoft.Json;
using System.Text;
namespace GetCharityTypes;

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
        List<CharityType> types = new List<CharityType>();
        try
        {
            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                string sql = "SELECT id, name FROM types";
                using (MySqlCommand command = new MySqlCommand(sql, connection))
                {
                    using (MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            types.Add(new CharityType
                            {
                                Id = reader.GetInt32("id"),
                                Type = reader.GetString("name")
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
        //string json = JsonConvert.SerializeObject(types);
        string json = ConvertToJson(types);
        return json;
    }
    public static string ConvertToJson(List<CharityType> charityTypes)
    {
        // Manually build JSON string
        var jsonParts = charityTypes.Select(charity =>
            $"{{\"Id\":{charity.Id},\"Type\":\"{charity.Type}\"}}");

        return $"[{string.Join(",", jsonParts)}]";
    }
    public string ConvertToJsonWithStringBuilder(List<CharityType> charityTypes)
    {
        var sb = new StringBuilder();
        sb.Append("[");

        for (int i = 0; i < charityTypes.Count; i++)
        {
            sb.Append($"{{\"Id\":{charityTypes[i].Id},\"Type\":\"{charityTypes[i].Type}\"}}");

            if (i < charityTypes.Count - 1)
            {
                sb.Append(",");
            }
        }

        sb.Append("]");
        return sb.ToString();
    }
}
public class CharityType
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
}
