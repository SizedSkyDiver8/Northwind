namespace NorthwindServer.Models
{
    public class PagedProductResult
    {
        public List<Product> Products { get; set; }
        public int TotalCount { get; set; }
    }
}
