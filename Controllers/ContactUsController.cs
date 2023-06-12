using MarketingHunter.Helper;
using System.Configuration;
using System.Web.Mvc;

namespace MarketingHunter.Controllers
{
    public class ContactUsController : Controller
    {
        // GET: ContactUs
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ContactUs(string name, string email, string mobile, string message)
        {
            SendEmailDTO res = Helper.Helper.SendEmail(email, ConfigurationManager.AppSettings["toEmail"], ConfigurationManager.AppSettings["ccEmail"], "", "Contact Us", message, "");

            return Json(res);
        }
    }  
}