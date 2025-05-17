# Northwind Orders Application

## Project Setup Instructions

This project is a complete full-stack CRUD application for managing products in the Northwind database. It combines a modern React frontend (built with Vite) with an ASP.NET Core 6 backend API, while the SQL Server database is hosted inside a Docker container.

---

### Prerequisites

Before setting up the project, make sure the following software is installed on your machine:

- .NET 6 SDK – to run the backend API
- Docker Desktop – required for running the MSSQL database container
- npm – used for managing and running the frontend

You will also need the Docker image containing the Northwind database, which can be downloaded from the link provided in the **Database Setup** section below.

---

### Database Setup

1. Download the MSSQL Docker image with the pre-loaded Northwind database from the following link:  
  https://drive.google.com/file/d/1GCGnRs4gWap5ue8vqjrmfh4Dz7d14_g-/view?usp=sharing

2. Run the container using the loaded image:
  docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Northwind!2024" -p 1433:1433 --name sql_northwind_tools -d northwind_snapshot

---

### Backend Setup

1. Navigate to the backend project directory:
   ```sh
   cd server/NorthwindServer
2. Build the backend project using the .NET CLI:
   dotnet build
3. Once the build is complete, run the API server:
   dotnet run

---

### Frontend Setup

1. Navigate to the `client` directory:
   ```sh
   cd fronted
   ```
2. Install project dependencies:
```
   npm install
   npm install @types/react-router-dom
```
   
