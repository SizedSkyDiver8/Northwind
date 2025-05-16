using NorthwindServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace NorthwindServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        //Returns all products
        [HttpGet]
        [Route("GetAllProducts")]
        public List<Product> Products()
        {
            Product product = new Product();
            return product.AllProducts();
        }

        //Returns a product by its ID
        [HttpGet]
        [Route("GetProductByID/{id}")]
        public Product GetProductById(int id)
        {
            Product product = new Product();
            return product.GetProductInfo(id);
        }

        //Returns paged products filtered by name along with total count
        [HttpGet]
        [Route("GetProductsByName")]
        public IActionResult ProductsByNamePaged([FromQuery] string name, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            Product p = new Product();
            var (products, totalCount) = p.ProductsByName(name, pageNumber, pageSize);
            return Ok(new { products, totalCount });
        }

        //Returns paged products filtered by category prefix along with total count
        [HttpGet]
        [Route("GetProductsByCategory")]
        public IActionResult ProductsByCategoryPrefix([FromQuery] string category, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            Product p = new Product();
            var (products, totalCount) = p.ProductsByCat(category, pageNumber, pageSize);

            return Ok(new
            {
                Products = products,
                TotalCount = totalCount
            });
        }

        //Returns a paged list of all products
        [HttpGet]
        [Route("GetPagedProducts")]
        public IActionResult GetPagedProducts(int pageNumber = 1, int pageSize = 10)
        {
            DBservices db = new DBservices();
            PagedProductResult result = db.GetPagedProducts(pageNumber, pageSize);
            return Ok(result);
        }

        //Returns whether a product name already exists
        [HttpGet]
        [Route("CheckNameExists/{name}")]
        public bool CheckName(string name)
        {
            Product product= new Product();
            return product.CheckValidName(name);
        }

        //Adds a new product
        [HttpPost]
        [Route("AddNewProduct")]
        public bool AddNewProduct([FromBody] Product product)
        {
            return product.AddProduct(product);

        }


        //Updates an existing product
        [HttpPut]
        [Route("EditProduct")]
        public bool EditProductById([FromBody] Product product)
        {
            return product.EditProduct(product);
        }

        //Deletes a product by its ID
        [HttpDelete]
        [Route("DeleteProductById/{id}")]
        public ContentResult DeleteProduct(int id)
        {
            Product product = new Product();
            int result = product.DeleteProduct(id);
            return Content(result.ToString());
        }

    }

}
