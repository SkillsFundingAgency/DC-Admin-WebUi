using Autofac;
using ESFA.DC.Web.Admin.Ui.Settings;
using Microsoft.Extensions.Configuration;

namespace ESFA.DC.Web.Admin.Ui.Ioc
{
    public static class ConfigurationRegistration
    {
        public static void SetupConfigurations(this ContainerBuilder builder, IConfiguration configuration)
        {
            builder
                .Register(c => configuration.GetSection(typeof(JobQueueApiSettings).Name).Get<JobQueueApiSettings>())
                .SingleInstance();
        }
    }
}