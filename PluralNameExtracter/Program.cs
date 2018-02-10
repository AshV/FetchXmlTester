using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Tooling.Connector;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PluralNameExtracter
{
    class Program
    {
        static void Main(string[] args)
        {
            var loginUri = "https://18jan18.crm.dynamics.com";
            var userName = "18jan18@18jan18.onmicrosoft.com";
            var password = "Trial#Env1";
            var conn = new CrmServiceClient($@"Url={loginUri}; Username={userName}; Password={password}; authtype=Office365");
            var orgService = conn.OrganizationWebProxyClient != null ? conn.OrganizationWebProxyClient : (IOrganizationService)conn.OrganizationServiceProxy;

            RetrieveAllEntitiesRequest request = new RetrieveAllEntitiesRequest()
            {
                EntityFilters = EntityFilters.Entity,
                RetrieveAsIfPublished = true
            };

            RetrieveAllEntitiesResponse response = (RetrieveAllEntitiesResponse)orgService.Execute(request);

            var pluralList = new List<KeyValuePair<string, string>>();
            var plurals = "var plurals={";
            foreach (var data in response.EntityMetadata)
                if (!string.IsNullOrEmpty(data.CollectionSchemaName))
                    plurals += $"\"{data.SchemaName}\":\"{data.CollectionSchemaName}\",";
            // pluralList.Add(new KeyValuePair<string, string>(data.SchemaName, data.CollectionSchemaName));

            // File.WriteAllText("plurals.js", JsonConvert.SerializeObject(pluralList));
            File.WriteAllText("plurals.js", plurals + "}");
        }
    }
}
