namespace NorthwindServer.Models
{
    public class Supplier
    {
        public int SupplierID { get; set; }
        public string SupplierName { get; set;}
        public string ContactName { get; set;}
        public string Address { get; set;}
        public string City { get; set;}
        public string PostalCode { get; set;}
        public string Country { get; set;}
        public string Phone { get; set;}

        //Returns a list of all suppliers
        public List<Supplier>GetAllSuppliers(){
            DBservices dbs = new DBservices();
            return dbs.GetAllSuppList();
        }


    }
}
