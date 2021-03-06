﻿using System.Threading.Tasks;
using ESFA.DC.Web.Admin.Ui.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.WsFederation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace DC.Web.Ui.StartupConfiguration
{
    public static class AuthenticationStartup
    {
        public static void AddAndConfigureAuthentication(this IServiceCollection services, AuthenticationSettings authSettings)
        {
            services.AddAuthentication(sharedOptions =>
                {
                    sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    sharedOptions.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    sharedOptions.DefaultChallengeScheme = WsFederationDefaults.AuthenticationScheme;
                    sharedOptions.DefaultSignOutScheme = WsFederationDefaults.AuthenticationScheme;
                })
                .AddWsFederation(options =>
                {
                    options.Wtrealm = authSettings.WtRealm;
                    options.MetadataAddress = authSettings.MetadataAddress;

                    options.Events.OnSecurityTokenValidated = OnTokenValidated;
                    options.CallbackPath = "/Home";
                })
                .AddCookie(options =>
                {
                    options.ReturnUrlParameter = "/Home";
                    options.AccessDeniedPath = new PathString("/");
                });
        }

        private static Task OnTokenValidated(SecurityTokenValidatedContext context)
        {
            return Task.CompletedTask;
        }
    }
}