namespace server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // public void ConfigureServices(IServiceCollection services)
        // {
        //     services.AddControllers();

        //     // Store API keys as configuration
        //     IConfiguration configuration = Configuration.GetSection("ApiKeys");
        //     if (configuration != null)
        //     {
        //         services.AddSingleton(configuration);
        //     }
        // }
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // Store API keys as configuration
            IConfiguration apiKeysConfig = Configuration.GetSection("ApiKeys");
            if (apiKeysConfig != null)
            {
                services.AddSingleton(apiKeysConfig);
            }
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
