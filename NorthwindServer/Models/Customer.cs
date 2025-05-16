namespace NorthwindServer.Models
{
    public class Customer
    {
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string ContactName { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string PostalCode { get; set; }

        public string Country { get; set; }
        public int OrderCount { get; set; }


        //Returns a list of customers with their order counts 
        public List<Customer> CountOrderPerCustomer()
        {
            DBservices dbs = new DBservices();
            return dbs.CountPerCustomer();
        }

        //Returns the top 3 customers by order count
        public List<Customer> CustomerTopThree()
        {
            DBservices dbs = new DBservices();
            return dbs.TopThreeCustomers();
        }
    }
}
