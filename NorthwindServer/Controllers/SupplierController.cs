using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NorthwindServer.Models;
using System.Xml.Linq;

namespace NorthwindServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : Controller
    {
        //Returns a list of all suppliers
        [HttpGet]
        [Route("GetAllSuppliers")]
        public List<Supplier> GetAllSuplliersList()
        {
            Supplier suplliers = new Supplier();
            return suplliers.GetAllSuppliers();
        }
    }
}
