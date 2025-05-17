# 📦 Northwind Products Application

## ⚙️ Project Setup Instructions

This project is a complete full-stack application for managing products in the Northwind database. It combines a modern React frontend (built with Vite) with an ASP.NET Core 6 backend API, while the SQL Server database is hosted inside a Docker container.

---

### 🧰 Prerequisites

Before setting up the project, make sure the following software is installed on your machine:

- .NET 6 SDK – to run the backend API
- Docker Desktop – required for running the MSSQL database container
- npm – used for managing and running the frontend

You will also need the Docker image containing the Northwind database, which can be downloaded from the link provided in the **Database Setup** section below.

---

### 🗄️ Database Setup

1. Download the MSSQL Docker image with the pre-loaded Northwind database from the following link:  
  https://drive.google.com/file/d/1GCGnRs4gWap5ue8vqjrmfh4Dz7d14_g-/view?usp=sharing

2. Run the container using the loaded image:
```
  docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Northwind!2024" -p 1433:1433 --name sql_northwind_tools -d northwind_snapshot
```
---

### 🔧 Backend Setup

1. Navigate to the backend project directory:
   ```sh
   cd NorthwindServer
2. Build the backend project using the .NET CLI:
    ```
   dotnet build
   ```
3. Once the build is complete, run the API server:
    ```
   dotnet run
    ```
IF step 3 doesnt work tun this command:
    ```
   dotnet dev-certs https --trust
    ```
---

### 🖥️ Frontend Setup

1. Navigate to the `client` directory:
   ```sh
   cd frontend
   ```
2. Install project dependencies:
   ```
   npm install
   ```

## 🧠 Project Notes

- The backend connects to a SQL Server database hosted in a Docker container, pre-seeded with Northwind data.
- All database interactions are conducted through **stored procedures** using ADO.NET.
- Database credentials for local testing:
  - **Username**: `sa`
  - **Password**: `Northwind!2024`

- The application supports **real-time validation** for product name uniqueness during both creation and updates.
- Components such as the top customer display and product table each handle their own data logic and API communication.
- Application state is split cleanly across routes and components, following single-responsibility principles.
- Logging is handled by **Serilog**, which writes structured logs to timestamped files on the server.
- **Dark Mode** support is baked into the design via CSS variables and toggle-based switching.

---

## 🧩 Core Features Implemented

- ✅ Product Management with full CRUD support
- ✅ Editable product forms with auto-fill
- ✅ Live validation on the product name field
- ✅ Product deletion with modal confirmation
- ✅ Paginated product list (connected to backend)
- ✅ Autocomplete filtering by product name or category
- ✅ Responsive layout optimized for both desktop and mobile
- ✅ Real-time top 3 customers display via aggregated SQL query

---

## ✨ Enhanced Functionality (Bonus Additions)

- 🌗 **Dark Mode Theme**  
  Built-in toggle that switches themes using CSS custom properties.

- 📤 **CSV Export Capability**  
  One-click download of the current product list in CSV format, including all key fields.

- 💾 **Form Draft Persistence**  
  While adding a new product, any in-progress input is saved to localStorage until submitted or cleared.

- 🛑 **Referential Integrity Checks**  
  If a product is part of any existing order, deletion is blocked to preserve database integrity.  
  A clear error message is shown, and backend validation ensures this rule is enforced.

- ⚠️ **Custom Error Modal**  
  A unified modal is used to gracefully present any connection, API, or validation errors to the user.

---

---

## 🤖 Use of AI Tools

AI tools were used to enhance the development workflow while ensuring all logic was clearly understood and manually refined.

- **ChatGPT-4**  
  Helped with React architecture, component breakdown, styling improvements (including dark mode), backend logging with Serilog, and validation logic.

- **Gemini (by Google)**  
  Used for generating alternative UI behaviors, debugging suggestions, and refining logic during both frontend and backend development.

All AI-generated outputs were treated as suggestions — each piece of code was reviewed, tested, and customized to meet the project requirements and coding standards.

---

## 🎨 Icon Attribution

Icons used in this project are provided by [Icons8] (https://icons8.com/icons)

