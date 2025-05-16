using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NorthwindServer.Models;

namespace NorthwindServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : Controller
    {
        // Returns a list of all categories
        [HttpGet]
            [Route("GetAllCategories")]
            public List<Category> GetAllCategoryList()
            {
            Category category = new Category();
                return category.GetAllCategories();
            }
    }
}

