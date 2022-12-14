using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MarketingHunter.Startup))]
namespace MarketingHunter
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
