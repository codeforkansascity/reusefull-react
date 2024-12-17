// Ignore Spelling: Serializer
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using MySqlConnector;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GetCharityTypes;

public class Function
{
    private static async Task Main(string[] args)
    {
//#if DEBUG
//        var result = await FunctionHandler(null);
//        return;
//#endif
        Func<ILambdaContext, Task<string>> handler = async (context) =>
        {
            return await FunctionHandler(context);
        };

        await LambdaBootstrapBuilder.Create(
            handler,
            new SourceGeneratorLambdaJsonSerializer<CharityTypeSerializer>()
        ).Build().RunAsync();

    }

    public static async Task<string> FunctionHandler(ILambdaContext context)
    {
        string connectionString = ReusefullCommonLibrary.DatabaseHelper.GetConnectionString();
        List<CharityType> types = new List<CharityType>();
        try
        {
            using (MySqlConnection connection = new MySqlConnection(connectionString))
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
                                Id = ReusefullCommonLibrary.DatabaseHelper.SafeGetInt32FromDB(reader, "id"),
                                Type = reader.GetString("name")
                            });
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"connstring={connectionString} and error: {ex.Message}");
        }

        string serializedTypes = JsonSerializer.Serialize(types, CharityTypeSerializer.Default.ListCharityType);
        //LambdaLogger.Log($"Reusefull Serialized types: {serializedTypes}");
        return serializedTypes;
    }
}

[JsonSerializable(typeof(APIGatewayProxyRequest))]
[JsonSerializable(typeof(APIGatewayProxyResponse))]
[JsonSerializable(typeof(CharityType))]
[JsonSerializable(typeof(List<CharityType>))]
public partial class CharityTypeSerializer : JsonSerializerContext
{
}

public class CharityType
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
}