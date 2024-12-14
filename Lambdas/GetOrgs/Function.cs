// Ignore Spelling: Serializer
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.RuntimeSupport;
using Amazon.Lambda.Serialization.SystemTextJson;
using MySqlConnector;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GetOrgs;
 
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
            new SourceGeneratorLambdaJsonSerializer<OrgDataSerializer>()
        ).Build().RunAsync();
    }

    public static async Task<string> FunctionHandler(ILambdaContext context)
    {
        string connectionString = ReusefullCommonLibrary.DatabaseHelper.GetConnectionString();
        List<OrgData> types = new List<OrgData>();
        try
        {
            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string sql = "select id, name, address, zip_code, phone, email, contact_name, mission, description, link_volunteer, link_website, link_wishlist, pickup, dropoff, resell, faith, good_items, new_items, logo_url, city, state, lat, lng from charity where approved=1 and paused=0";
                using (MySqlCommand command = new MySqlCommand(sql, connection))
                {
                    using (MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            types.Add(new OrgData
                            {
                                Id = reader.GetInt32("id"),
                                Name = reader.GetString("name"),
                                Address = reader.GetString("address"),
                                ZipCode = reader.GetString("zip_code"),
                                City = reader.GetString("city"),
                                ContactName = reader.GetString("contact_name"),
                                Description = reader.GetString("description"),
                                Dropoff = reader.GetBoolean("dropoff"),
                                Email = reader.GetString("email"), Faith = reader.GetBoolean("faith"),
                                GoodItems = reader.GetBoolean("good_items"),
                                Lat = reader.GetDouble("lat"),
                                LinkVolunteer = reader.GetString("link_volunteer"),
                                LinkWebsite = reader.GetString("link_website"),
                                LinkWishlist = reader.GetString("link_wishlist"), Lng = reader.GetDouble("lng"),
                                LogoUrl = reader.GetString("logo_url"),
                                Mission = reader.GetString("mission"),
                                NewItems = reader.GetBoolean("new_items"),
                                Phone = reader.GetString("phone"), Pickup = reader.GetBoolean("pickup"),
                                Resell = reader.GetBoolean("resell"),
                                State = reader.GetString("state")
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
        string serializedTypes = JsonSerializer.Serialize(types, OrgDataSerializer.Default.ListOrgData);
        //LambdaLogger.Log($"Reusefull Serialized types: {serializedTypes}");
        return serializedTypes;
    }
}

[JsonSerializable(typeof(APIGatewayProxyRequest))]
[JsonSerializable(typeof(APIGatewayProxyResponse))]
[JsonSerializable(typeof(OrgData))]
[JsonSerializable(typeof(List<OrgData>))]
public partial class OrgDataSerializer : JsonSerializerContext
{
}

public class OrgData
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string Mission { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LinkVolunteer { get; set; } = string.Empty;
    public string LinkWebsite { get; set; } = string.Empty;
    public string LinkWishlist { get; set; } = string.Empty;
    public bool Pickup { get; set; }
    public bool Dropoff { get; set; }
    public bool Resell { get; set; }
    public bool Faith { get; set; }
    public bool GoodItems { get; set; }
    public bool NewItems { get; set; }
    public string LogoUrl { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public double Lat { get; set; }
    public double Lng { get; set; }
}   
