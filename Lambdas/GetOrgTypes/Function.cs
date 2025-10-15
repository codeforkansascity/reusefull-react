// Ignore Spelling: Serializer
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using MySqlConnector;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GetOrgTypesTypes;
 
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
        List<CharityToTypeType> types = new List<CharityToTypeType>();
        try
        {
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string sql = "select c.name as CharityName, types.name as TypeName, c.id as CharityId, types.id as TypeId from charity c join charity_item i on c.id = i.charity_id inner join types on types.id = i.item_id order by 1,2";
                using (MySqlCommand command = new MySqlCommand(sql, connection))
                {
                    using (MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            types.Add(new CharityToTypeType
                            {
                                CharityName = reader.GetString("CharityName"),
                                TypeName = reader.GetString("TypeName"),
                                CharityId = ReusefullCommonLibrary.DatabaseHelper.SafeGetInt32FromDB(reader, "CharityId"),
                                TypeId = ReusefullCommonLibrary.DatabaseHelper.SafeGetInt32FromDB(reader, "TypeId"),
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
        string serializedTypes = JsonSerializer.Serialize(types, CharityToTypeTypeSerializer.Default.ListCharityToItemType);
        //LambdaLogger.Log($"Reusefull Serialized types: {serializedTypes}");
        return serializedTypes;
    }
}


[JsonSerializable(typeof(APIGatewayProxyRequest))]
[JsonSerializable(typeof(APIGatewayProxyResponse))]
[JsonSerializable(typeof(CharityToTypeType))]
[JsonSerializable(typeof(List<CharityToTypeType>))]
public partial class CharityToTypeTypeSerializer : JsonSerializerContext
{
}
public class CharityToTypeType
{
    public string CharityName { get; set; } = string.Empty;
    public string TypeName { get; set; } = string.Empty;
    public int CharityId { get; set; }
    public int TypeId { get; set; }
}