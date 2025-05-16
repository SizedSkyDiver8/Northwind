using NorthwindServer.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace NorthwindServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : Controller
    {
        // Returns a list of customers with their order counts
        [HttpGet]
        [Route("GetCustomerOrderCount")]
        public List<Customer> Count()
        {
            Customer customer = new Customer();
            return customer.CountOrderPerCustomer();
        }

        //Returns the top 3 customers by order count
        [HttpGet]
        [Route("GetTop3CustomerOrderCount")]
        public List<Customer> TopThreeCustomers()
        {
            Customer customer = new Customer();
            return customer.CustomerTopThree();
        }
    }
}

