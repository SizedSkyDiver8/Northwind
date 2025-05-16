namespace NorthwindServer.Models
{
    public class Category
    {
        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }


        //Returns a list of all categories
        public List<Category> GetAllCategories()
        {
            DBservices dBservices = new DBservices();
            return dBservices.GetCategories();
        }
    }
}
