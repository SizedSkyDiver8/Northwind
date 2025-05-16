namespace NorthwindServer
{
    using System.Data.SqlClient;
    using System.Data;
    using System.Text;
    using NorthwindServer.Models;
    using System.Globalization;
    using System.Xml.Linq;
    using Microsoft.Extensions.Configuration;
    using System.Collections.Generic;


    /// <summary>
    /// DBServices is a class created by me to provides some DataBase Services
    /// </summary>
    public class DBservices
    {

        public DBservices()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("DefaultConnection");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        //---------------------------------------------------------------------------------
        // Create the SqlCommand using a stored procedure
        //--------------------------------------------------------------------------------
        private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, Dictionary<string, object> paramDic)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);

                }


            return cmd;
        }


        /////////////////////////////////////////////////////////////////
        ///////////////////////// Product /////////////////////////////////
        ////////////////////////////////////////////////////////////////


        //--------------------------------------------------------------------------------------------------
        // This method Returns a list of products
        //--------------------------------------------------------------------------------------------------
        public List<Product> AllProducts()
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            cmd = CreateCommandWithStoredProcedure("GetAllProductsWithDetails", con, null);
            List<Product> productsList = new List<Product>();
            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                while (dataReader.Read())
                {
                    Product product = new Product();
                    product.Category = new Category();
                    product.Supplier = new Supplier();

                    product.ProductID = Convert.ToInt32(dataReader["ProductID"]);
                    product.ProductName = dataReader["ProductName"].ToString();
                    product.Category.CategoryID = Convert.ToInt32(dataReader["CategoryID"]);
                    product.Category.CategoryName = dataReader["CategoryName"].ToString();
                    product.Supplier.SupplierID = Convert.ToInt32(dataReader["SupplierID"]);
                    product.Supplier.SupplierName = dataReader["SupplierName"].ToString();
                    product.Price = Convert.ToDecimal(dataReader["UnitPrice"]);
                    product.Unit = dataReader["Unit"].ToString();
                    productsList.Add(product);
                }
                return productsList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        //--------------------------------------------------------------------------------------------------
        // This method Returns a list of products by name
        //--------------------------------------------------------------------------------------------------

        public (List<Product>, int) ListProductsByNamePaged(string name, int pageNumber, int pageSize)
        {
            SqlConnection con = connect("DefaultConnection");
            Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@name", name },
        { "@PageNumber", pageNumber },
        { "@PageSize", pageSize }
    };
            SqlCommand cmd = CreateCommandWithStoredProcedure("GetProductsByNamePrefix", con, paramDic);
            List<Product> productsList = new List<Product>();
            int totalCount = 0;

            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Product product = new Product
                    {
                        ProductID = Convert.ToInt32(reader["ProductID"]),
                        ProductName = reader["ProductName"].ToString(),
                        Unit = reader["Unit"].ToString(),
                        Price = Convert.ToDecimal(reader["Price"]),
                        Supplier = new Supplier
                        {
                            SupplierID = Convert.ToInt32(reader["SupplierID"]),
                            SupplierName = reader["SupplierName"].ToString()
                        },
                        Category = new Category
                        {
                            CategoryID = Convert.ToInt32(reader["CategoryID"]),
                            CategoryName = reader["CategoryName"].ToString()
                        }
                    };
                    productsList.Add(product);
                }

                if (reader.NextResult() && reader.Read())
                {
                    totalCount = Convert.ToInt32(reader["TotalCount"]);
                }
            }

            return (productsList, totalCount);
        }


        //--------------------------------------------------------------------------------------------------
        // This method Returns a list of products by category
        //--------------------------------------------------------------------------------------------------

        public (List<Product>, int) ProductsByCategory(string category, int pageNumber, int pageSize)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw ex;
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>
            {
                { "@category", category },
                { "@pageNumber", pageNumber },
                { "@pageSize", pageSize }
             };
            cmd = CreateCommandWithStoredProcedure("GetProductsByCategoryPrefix", con, paramDic);

            try
            {
                SqlDataReader reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Product> productsList = new List<Product>();
                int totalCount = 0;

                while (reader.Read())
                {
                    Product product = new Product
                    {
                        ProductID = Convert.ToInt32(reader["ProductID"]),
                        ProductName = reader["ProductName"].ToString(),
                        Price = Convert.ToDecimal(reader["Price"]),
                        Unit = reader["Unit"].ToString(),
                        Category = new Category
                        {
                            CategoryID = Convert.ToInt32(reader["CategoryID"]),
                            CategoryName = reader["CategoryName"].ToString()
                        },
                        Supplier = new Supplier
                        {
                            SupplierID = Convert.ToInt32(reader["SupplierID"]),
                            SupplierName = reader["SupplierName"].ToString()
                        }
                    };
                    productsList.Add(product);
                }
                if (reader.NextResult() && reader.Read())
                {
                    totalCount = Convert.ToInt32(reader["TotalCount"]);
                }
                return (productsList, totalCount);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }


        //--------------------------------------------------------------------------------------------------
        // This method adds new product 
        //--------------------------------------------------------------------------------------------------
        public Boolean AddNewProd(Product product)
        {

            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@name", product.ProductName);
            paramDic.Add("@supplier", product.Supplier.SupplierID);
            paramDic.Add("@category", product.Category.CategoryID);
            paramDic.Add("@unit", product.Unit);
            paramDic.Add("@price", product.Price);


            cmd = CreateCommandWithStoredProcedure("AddNewProduct", con, paramDic);

            try
            {
                SqlParameter returnParam = new SqlParameter
                {
                    Direction = ParameterDirection.ReturnValue
                };
                cmd.Parameters.Add(returnParam);
                cmd.ExecuteNonQuery();
                int result = Convert.ToInt32(returnParam.Value);
                if (result == 0)
                {
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        //--------------------------------------------------------------------------------------------------
        // This method checks if the name of product exists in the db 
        //--------------------------------------------------------------------------------------------------
        public Boolean CheckExistName(string name)
        {

            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@name", name);
            cmd = CreateCommandWithStoredProcedure("CheckValidateName", con, paramDic);

            try
            {
                SqlParameter returnParam = new SqlParameter
                {
                    Direction = ParameterDirection.ReturnValue
                };
                cmd.Parameters.Add(returnParam);
                cmd.ExecuteNonQuery();
                int result = Convert.ToInt32(returnParam.Value);
                if (result == 0)
                {
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        //--------------------------------------------------------------------------------------------------
        // This method edits product 
        //--------------------------------------------------------------------------------------------------
        public Boolean EditProd(Product product)
        {

            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@id", product.ProductID);
            paramDic.Add("@name", product.ProductName);
            paramDic.Add("@supplier", product.Supplier.SupplierID);
            paramDic.Add("@category", product.Category.CategoryID);
            paramDic.Add("@unit", product.Unit);
            paramDic.Add("@price", product.Price);


            cmd = CreateCommandWithStoredProcedure("EditProduct", con, paramDic);

            try
            {
                SqlParameter returnParam = new SqlParameter
                {
                    Direction = ParameterDirection.ReturnValue
                };
                cmd.Parameters.Add(returnParam);
                cmd.ExecuteNonQuery();
                int result = Convert.ToInt32(returnParam.Value);
                if (result == 0)
                {
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        //--------------------------------------------------------------------------------------------------
        // This method deletes product by id 
        // 0-not exists in db
        // -1 in order
        // 1 delete successful 
        //--------------------------------------------------------------------------------------------------
        public int DeleteProd(int id)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw ex;
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@id", id);
            cmd = CreateCommandWithStoredProcedure("DeleteProd", con, paramDic);

            try
            {
                SqlParameter returnParam = new SqlParameter
                {
                    Direction = ParameterDirection.ReturnValue
                };
                cmd.Parameters.Add(returnParam);
                cmd.ExecuteNonQuery();

                int result = Convert.ToInt32(returnParam.Value);
                return result; // Can be 1, 0, or -1
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }


        //--------------------------------------------------------------------------------------------------
        // This method brings amount of products by the number of page to the table  
        //--------------------------------------------------------------------------------------------------
        public PagedProductResult GetPagedProducts(int pageNumber, int pageSize)
        {
            List<Product> productsList = new List<Product>();
            int totalCount = 0;

            SqlConnection conn = connect("DefaultConnection");

            using (SqlCommand cmd = new SqlCommand("GetPagedProducts", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PageNumber", pageNumber);
                cmd.Parameters.AddWithValue("@PageSize", pageSize);

                SqlDataReader dataReader = cmd.ExecuteReader();
                while (dataReader.Read())
                {
                    Product product = new Product();
                    product.ProductID = Convert.ToInt32(dataReader["ProductID"]);
                    product.ProductName = dataReader["ProductName"].ToString();
                    product.Unit = dataReader["Unit"].ToString();
                    product.Price = Convert.ToDecimal(dataReader["Price"]);
                    product.Category.CategoryName = dataReader["CategoryName"].ToString();
                    product.Supplier.SupplierName = dataReader["SupplierName"].ToString();
                    productsList.Add(product);
                }

                // Move to second result set for total count
                if (dataReader.NextResult() && dataReader.Read())
                {
                    totalCount = Convert.ToInt32(dataReader[0]);
                }

                dataReader.Close();
            }

            conn.Close();

            return new PagedProductResult
            {
                Products = productsList,
                TotalCount = totalCount
            };
        }

        //--------------------------------------------------------------------------------------------------
        // This method bring product by id 
        //--------------------------------------------------------------------------------------------------
        public Product AllProductById(int id)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = connect("DefaultConnection");
                Dictionary<string, object> paramDic = new Dictionary<string, object>
        {
            { "@id", id }
        };

                cmd = CreateCommandWithStoredProcedure("GetProductById", con, paramDic);

                using (SqlDataReader dataReader = cmd.ExecuteReader())
                {
                    if (dataReader.Read())
                    {
                        Product product = new Product();
                        product.ProductID = Convert.ToInt32(dataReader["ProductID"]);
                        product.ProductName = dataReader["ProductName"].ToString();
                        product.Unit = dataReader["Unit"].ToString();
                        product.Price = Convert.ToDecimal(dataReader["Price"]);
                        product.Category.CategoryName = dataReader["CategoryName"].ToString();
                        product.Category.CategoryID = Convert.ToInt32(dataReader["CategoryID"]);
                        product.Supplier.SupplierName = dataReader["SupplierName"].ToString();
                        product.Supplier.SupplierID = Convert.ToInt32(dataReader["SupplierID"]);
                        return product;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }



        /////////////////////////////////////////////////////////////////
        ///////////////////////// Customer //////////////////////////////
        ////////////////////////////////////////////////////////////////


        //--------------------------------------------------------------------------------------------------
        // This method Returns a list of customer and their count of products
        //--------------------------------------------------------------------------------------------------
        public List<Customer> CountPerCustomer()
        {
            SqlConnection con = connect("DefaultConnection");
            SqlCommand cmd = CreateCommandWithStoredProcedure("GetCustomerOrderCounts", con, null);

            List<Customer> customers = new List<Customer>();

            try
            {
                SqlDataReader reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                while (reader.Read())
                {
                    Customer customer = new Customer();
                    customer.CustomerID = Convert.ToInt32(reader["CustomerID"]);
                    customer.CustomerName = reader["CustomerName"].ToString();
                    customer.OrderCount = Convert.ToInt32(reader["OrderCount"]);
                    customers.Add(customer);
                }
                return customers;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        //--------------------------------------------------------------------------------------------------
        // This method Returns a list of top 3 customers with max order count
        //--------------------------------------------------------------------------------------------------
        public List<Customer> TopThreeCustomers()
        {
            SqlConnection con = connect("DefaultConnection");
            SqlCommand cmd = CreateCommandWithStoredProcedure("GetTop3CustomersByOrders", con, null);

            List<Customer> customers = new List<Customer>();

            try
            {
                SqlDataReader reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                while (reader.Read())
                {
                    Customer customer = new Customer();
                    customer.CustomerID = Convert.ToInt32(reader["CustomerID"]);
                    customer.CustomerName = reader["CustomerName"].ToString();
                    customer.OrderCount = Convert.ToInt32(reader["OrderCount"]);
                    customers.Add(customer);
                }
                return customers;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                con?.Close();
            }
        }

        /////////////////////////////////////////////////////////////////
        ///////////////////////// Supplier //////////////////////////////
        ////////////////////////////////////////////////////////////////

        //--------------------------------------------------------------------------------------------------
        // This method Returns a list of suppliers
        //--------------------------------------------------------------------------------------------------

        public List<Supplier> GetAllSuppList()
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw (ex);
            }

            cmd = CreateCommandWithStoredProcedure("GetAllSuppliers", con, null);

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Supplier> suppliersList = new List<Supplier>();

                while (dataReader.Read())
                {
                    Supplier supplier = new Supplier();
                    supplier.SupplierID = Convert.ToInt32(dataReader["SupplierID"]);
                    supplier.SupplierName = dataReader["SupplierName"].ToString();
                    supplier.ContactName = dataReader["ContactName"].ToString();
                    supplier.Address = dataReader["Address"].ToString();
                    supplier.City = dataReader["City"].ToString();
                    supplier.PostalCode = dataReader["PostalCode"].ToString();
                    supplier.Country = dataReader["Country"].ToString();
                    supplier.Phone = dataReader["Phone"].ToString();

                    suppliersList.Add(supplier);
                }
                return suppliersList;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        /////////////////////////////////////////////////////////////////
        ///////////////////////// Category //////////////////////////////
        ////////////////////////////////////////////////////////////////

        //--------------------------------------------------------------------------------------------------
        // This method Returns a list of categories
        //--------------------------------------------------------------------------------------------------

        public List<Category> GetCategories()
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DefaultConnection");
            }
            catch (Exception ex)
            {
                throw (ex);
            }

            cmd = CreateCommandWithStoredProcedure("GetAllCategories", con, null);

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Category> categoryList = new List<Category>();

                while (dataReader.Read())
                {
                    Category category = new Category();
                    category.CategoryID = Convert.ToInt32(dataReader["CategoryID"]);
                    category.CategoryName = dataReader["CategoryName"].ToString();
                    category.Description = dataReader["Description"].ToString();
                    categoryList.Add(category);
                }
                return categoryList;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
    }
}