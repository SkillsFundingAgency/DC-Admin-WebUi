using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using DC.Web.Ui.StartupConfiguration;
using ESFA.DC.Web.Admin.Ui.Ioc;
using ESFA.DC.Web.Admin.Ui.Settings;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ESFA.DC.Web.Admin.Ui
{
    public class Startup
    {
        private readonly IConfiguration _config;
        private readonly IHostingEnvironment _environment;
        private IContainer _applicationContainer;

        public Startup(IHostingEnvironment env)
        {
            _environment = env;
            var builder = new ConfigurationBuilder();

            builder.SetBasePath(Directory.GetCurrentDirectory());

            if (env.IsDevelopment())
            {
                builder.AddJsonFile($"appsettings.{Environment.UserName}.json");
            }
            else
            {
                builder.AddJsonFile("appsettings.json");
            }

            _config = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            var authSettings = _config.GetSection(typeof(AuthenticationSettings).Name).Get<AuthenticationSettings>();

            if (!authSettings.Enabled)
            {
                services.AddMvc(options =>
                {
                    options.Filters.Add(new AllowAnonymousFilter());
                });
            }
            else
            {
                services.AddMvc();
            }

            services.AddSession();

            // Custom services
            services.AddMvc().AddControllersAsServices();
            services.AddAndConfigureAuthentication(authSettings);
            return ConfigureAutofac(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();

                app.UseSession();
                app.UseAuthentication();
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        private IServiceProvider ConfigureAutofac(IServiceCollection services)
        {
            var containerBuilder = new ContainerBuilder();
            containerBuilder.SetupConfigurations(_config);

            containerBuilder.Populate(services);
            _applicationContainer = containerBuilder.Build();

            return new AutofacServiceProvider(_applicationContainer);
        }
    }
}
