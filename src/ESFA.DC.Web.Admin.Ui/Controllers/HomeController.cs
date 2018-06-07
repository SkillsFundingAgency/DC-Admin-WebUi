using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using ESFA.DC.Web.Admin.Ui.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ESFA.DC.Web.Admin.Ui.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly JobQueueApiSettings _jobQueueApiSettings;

        public HomeController(JobQueueApiSettings jobQueueApiSettings)
        {
            _jobQueueApiSettings = jobQueueApiSettings;
        }

        public IActionResult Index()
        {
            ViewBag.Url = _jobQueueApiSettings.BaseUrl;
            return View();
        }
    }
}
