// Ignore Spelling: Serializer
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using MySqlConnector;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GetOrgItemTypes;
 
public class Function
{
    private static async Task Main(string[] args)
    {
#if DEBUG
        var result = await FunctionHandler(null);
        return; 
#endif
        Func<ILambdaContext, Task<string>> handler = async (context) =>
        {
            return await FunctionHandler(context);
        };

        await LambdaBootstrapBuilder.Create(
            handler,
            new SourceGeneratorLambdaJsonSerializer<CharityToItemTypeSerializer>()
        ).Build().RunAsync();
    }

    public static async Task<string> FunctionHandler(ILambdaContext context)
    {
        string connectionString = ReusefullCommonLibrary.DatabaseHelper.GetConnectionString();
        List<CharityToItemType> types = new List<CharityToItemType>();
        try
        {
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string sql = "select c.name as CharityName, item.name as ItemName, c.id as CharityId, item.id as ItemId from charity c join charity_item i on c.id = i.charity_id inner join item on item.id = i.item_id order by 1,2";
                using (MySqlCommand command = new MySqlCommand(sql, connection))
                {
                    using (MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            types.Add(new CharityToItemType
                            {
                                CharityName = reader.GetString("CharityName"),
                                ItemName = reader.GetString("ItemName"),
                                CharityId = ReusefullCommonLibrary.DatabaseHelper.SafeGetInt32FromDB(reader, "CharityId"),
                                ItemId = ReusefullCommonLibrary.DatabaseHelper.SafeGetInt32FromDB(reader, "ItemId"),
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
        string serializedTypes = JsonSerializer.Serialize(types, CharityToItemTypeSerializer.Default.ListCharityToItemType);
        //LambdaLogger.Log($"Reusefull Serialized types: {serializedTypes}");
        return serializedTypes;
    }
}


[JsonSerializable(typeof(APIGatewayProxyRequest))]
[JsonSerializable(typeof(APIGatewayProxyResponse))]
[JsonSerializable(typeof(CharityToItemType))]
[JsonSerializable(typeof(List<CharityToItemType>))]
public partial class CharityToItemTypeSerializer : JsonSerializerContext
{
}
public class CharityToItemType
{
    public string CharityName { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public int CharityId { get; set; }
    public int ItemId { get; set; }
}