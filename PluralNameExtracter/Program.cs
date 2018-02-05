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
            var password = "#";
            var conn = new CrmServiceClient($@"Url={loginUri}; Username={userName}; Password={password}; authtype=Office365");
            var orgService = conn.OrganizationWebProxyClient != null ? conn.OrganizationWebProxyClient : (IOrganizationService)conn.OrganizationServiceProxy;

            RetrieveAllEntitiesRequest request = new RetrieveAllEntitiesRequest()
            {
                EntityFilters = EntityFilters.Entity,
                RetrieveAsIfPublished = true
            };

            RetrieveAllEntitiesResponse response = (RetrieveAllEntitiesResponse)orgService.Execute(request);

            var pluralList = new List<KeyValuePair<string, string>>();
            foreach (var data in response.EntityMetadata)
                pluralList.Add(new KeyValuePair<string, string>(data.SchemaName, data.CollectionSchemaName));

            File.WriteAllText("JSON.json", JsonConvert.SerializeObject(pluralList));
        }
    }
}
