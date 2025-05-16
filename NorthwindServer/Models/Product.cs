namespace NorthwindServer.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public Supplier Supplier { get; set; }
        public Category Category { get; set;}
        public string Unit { get; set; }
        public decimal Price { get; set; }

        public Product()
        {
            Supplier = new Supplier { SupplierID = 0, SupplierName = "Default Supplier" };
            Category = new Category { CategoryID = 0, CategoryName = "Default Category" };
        }

        //Returns a list of all products
        public List<Product> AllProducts()
        {
            DBservices dBservices = new DBservices();
            return dBservices.AllProducts();
        }

        //Returns a product by its ID
        public Product GetProductInfo(int id)
        {
            DBservices dBservices = new DBservices();
            return dBservices.AllProductById(id);
        }

        //Returns a paged list of products filtered by name along with the total count
        public (List<Product>, int) ProductsByName(string name, int pageNumber, int pageSize)
        {
            DBservices dbs = new DBservices();
            return dbs.ListProductsByNamePaged(name, pageNumber, pageSize);
        }

        //Returns a paged list of products filtered by category along with the total count
        public (List<Product>, int) ProductsByCat(string category, int pageNumber, int pageSize)
        {
            DBservices db = new DBservices();
            return db.ProductsByCategory(category, pageNumber, pageSize);
        }

        //Returns whether a product name is valid
        public bool CheckValidName(string name)
        {
            DBservices dBservices = new DBservices();
            return dBservices.CheckExistName(name);
        }

        //Adds a new product
        public Boolean AddProduct(Product product)
        {
            DBservices dBservices = new DBservices();
            return dBservices.AddNewProd(product);
        }

        //Updates an existing product
        public Boolean EditProduct(Product product)
        {
            DBservices dBservices = new DBservices();
            return dBservices.EditProd(product);
        }

        //Deletes a product by its ID
        public int DeleteProduct(int id)
        {
            DBservices dBservices = new DBservices();
            return dBservices.DeleteProd(id);
        }
    }
}
