﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ESFA.DC.Web.Admin.Ui.Controllers
{
    public class FailedJobsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}