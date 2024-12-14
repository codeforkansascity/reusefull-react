// Ignore Spelling: Serializer
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using MySqlConnector;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GetItemTypes;

public class Function
{

    private static async Task Main(string[] args)
    {
        Func<ILambdaContext, Task<string>> handler = async (context) =>
        {
            return await FunctionHandler(context);
        };

        await LambdaBootstrapBuilder.Create(
            handler,
            new SourceGeneratorLambdaJsonSerializer<ItemTypeSerializer>()
        ).Build().RunAsync();
    }

    public static async Task<string> FunctionHandler(ILambdaContext context)
    {
        string connectionString = ReusefullCommonLibrary.DatabaseHelper.GetConnectionString();
        List<ItemType> types = new List<ItemType>();
        try
        {
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string sql = "SELECT id, name FROM item";
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
            Console.WriteLine($"connstring={connectionString} and error: {ex.Message}");
        }
        string serializedTypes = JsonSerializer.Serialize(types, ItemTypeSerializer.Default.ListItemType);
        //LambdaLogger.Log($"Reusefull Serialized types: {serializedTypes}");
        return serializedTypes;
    }
}
[JsonSerializable(typeof(APIGatewayProxyRequest))]
[JsonSerializable(typeof(APIGatewayProxyResponse))]
[JsonSerializable(typeof(ItemType))]
[JsonSerializable(typeof(List<ItemType>))]
public partial class ItemTypeSerializer : JsonSerializerContext
{
}

public class ItemType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}