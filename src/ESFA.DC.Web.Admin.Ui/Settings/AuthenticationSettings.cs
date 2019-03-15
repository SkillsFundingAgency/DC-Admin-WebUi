using Newtonsoft.Json;

namespace ESFA.DC.Web.Admin.Ui.Settings
{
    public class AuthenticationSettings
    {
        [JsonRequired]
        public string WtRealm { get; set; }

        [JsonRequired]
        public string MetadataAddress { get; set; }

        [JsonRequired]
        public bool Enabled { get; set; }
    }
}
