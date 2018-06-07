using Newtonsoft.Json;

namespace ESFA.DC.Web.Admin.Ui.Settings
{
    public class JobQueueApiSettings
    {
        [JsonRequired]
        public string BaseUrl { get; set; }
    }
}
