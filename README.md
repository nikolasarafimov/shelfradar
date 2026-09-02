# ShelfRadar

ShelfRadar is a modern web application for finding products in nearby stores, comparing prices, checking current stock availability, and locating stores on an interactive map.

The platform provides a public product discovery experience without requiring an account, while authenticated store owners can manage their stores and inventory and administrators can manage the platform through dedicated dashboards.

---

## Overview

ShelfRadar connects product information, store locations, pricing, and inventory availability in one application.

Public users can search for products and compare offers across stores based on:

- Product name
- Brand
- Category
- Stock status
- City
- Price
- Distance
- Store location

Store owners can maintain their own store information and inventory, while administrators have access to platform-wide store management, catalog management, analytics, and activity tracking.

---

## Core Features

### Public Users

No authentication is required for public browsing.

Users can:

- Search for products across stores
- Browse all available offers
- Filter by brand
- Filter by category
- Filter by stock status
- Filter by city
- Sort products by price
- Sort products alphabetically
- Sort by most recently updated
- Search by geographic location
- Filter stores within a selected radius
- Sort nearby results by distance
- Compare prices between stores
- See stock quantity and availability
- View product details
- View store details
- View store addresses and working hours
- View store locations on an interactive map
- See distance from their current location

### Store Owners

Authenticated users with the `STORE_OWNER` role can:

- View all stores assigned to their account
- View an owner dashboard
- View individual store dashboards
- Update store profile information
- Update store location
- Manage inventory
- Add products to store inventory
- Update prices
- Update quantities
- Update stock status
- Remove inventory items
- Search and sort inventory
- View low-stock and out-of-stock alerts
- View recent inventory updates
- View store activity history

Store owners can only access stores assigned to their own account.

### Administrators

Authenticated users with the `ADMIN` role can:

- View a platform-wide dashboard
- View total stores
- View active, pending, and inactive stores
- View total products
- View total store owners
- View inventory statistics
- View total inventory units
- View inventory value
- View low-stock and out-of-stock statistics
- Search and filter stores
- View detailed store information
- Update store profiles
- Change store ownership
- Activate, deactivate, or approve stores
- Manage brands
- Manage categories
- Manage products
- View platform activity
- Search audit records
- Filter audit records
- View activity analytics
- View most active stores
- View recent platform activity

---

## Technology Stack

### Backend

- Java 21
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Security
- Spring OAuth2 Resource Server
- JWT authentication
- Spring Data JPA
- Hibernate
- Jakarta Validation
- Flyway
- PostgreSQL 16
- PostGIS
- Maven

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- React Leaflet
- Leaflet
- Vitest
- React Testing Library

### Infrastructure

- Docker
- Docker Compose
- Nginx
- PostgreSQL
- PostGIS

---

## Architecture

ShelfRadar follows a layered architecture.

```text
Client
  |
  v
React Frontend
  |
  | HTTP / JSON
  v
Spring Boot REST API
  |
  +-----------------------------+
  | Controllers                 |
  | Services                    |
  | Mappers                     |
  | Repositories                |
  | Security                    |
  | Validation                  |
  | Audit                       |
  +-----------------------------+
  |
  v
PostgreSQL + PostGIS
```

The application is separated into public, store-owner, and administrator functionality.

Role-based access control is enforced by Spring Security on the backend.

---

## Project Structure

```text
ShelfRadar/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/shelfradar/backend/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── exception/
│   │   │   │       ├── mapper/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │       ├── db/migration/
│   │   │       └── application.yml
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── test/
│   │   └── types/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── package.json
│
├── http/
├── docker-compose.yml
└── README.md
```

---

## Database

ShelfRadar uses PostgreSQL with the PostGIS extension.

The main domain includes:

### User

Represents authenticated platform users.

Roles:

```text
ADMIN
STORE_OWNER
```

### Product

Contains:

- Name
- Description
- Image URL
- Brand
- Category
- Creation timestamp

### Brand

Represents a product brand.

### Category

Represents a product category.

### Store

Contains:

- Name
- Address
- City
- Latitude
- Longitude
- Phone
- Working hours
- Status
- Owner
- Creation timestamp

Store statuses:

```text
PENDING
ACTIVE
INACTIVE
```

### Inventory

Connects products with stores and contains:

- Product
- Store
- Price
- Quantity
- Stock status
- Last update timestamp

Stock statuses:

```text
IN_STOCK
LOW_STOCK
OUT_OF_STOCK
```

Each store can contain a product only once in its inventory.

### Audit Log

Stores activity information for tracked administrative and store operations.

Audit information includes:

- Actor
- Actor role
- Action
- Entity type
- Entity ID
- Store snapshot information
- Product snapshot information
- Details
- Timestamp

---

## Database Migrations

Database schema management is handled by Flyway.

Migrations are located in:

```text
backend/src/main/resources/db/migration
```

The migrations create and evolve:

- PostgreSQL schema objects
- PostGIS support
- Users
- Brands
- Categories
- Products
- Stores
- Inventory
- Constraints
- Search indexes
- Geographic indexes
- Audit logs
- Sample data

Hibernate is configured with:

```yaml
ddl-auto: validate
```

This means Hibernate validates the database schema but does not create or modify it automatically.

Flyway remains the source of truth for schema evolution.

---

## Geographic Search

ShelfRadar uses PostGIS for location-based product discovery.

Store coordinates are stored using latitude and longitude and are also used for geographic calculations.

Nearby product search supports:

- User latitude
- User longitude
- Search radius
- Distance calculation
- Distance-based sorting

PostGIS operations include geographic distance calculations such as:

```text
ST_Distance
ST_DWithin
ST_MakePoint
ST_SetSRID
```

The backend returns calculated distance values in kilometers.

---

## Authentication

ShelfRadar uses stateless JWT authentication.

Authentication flow:

```text
Email + Password
      |
      v
Spring AuthenticationManager
      |
      v
JWT issued by backend
      |
      v
Frontend stores token in sessionStorage
      |
      v
Authorization: Bearer <token>
      |
      v
Spring Security validates JWT
```

JWTs are signed using:

```text
HS256
```

The token contains:

- Subject
- User ID
- Role
- Issuer
- Issued-at timestamp
- Expiration timestamp

Sessions are not stored on the backend.

---

## Authorization

ShelfRadar uses role-based access control.

Public routes:

```text
/api/health
/api/auth/login
/api/public/**
```

Store-owner routes:

```text
/api/store/**
```

Required role:

```text
STORE_OWNER
```

Administrator routes:

```text
/api/admin/**
```

Required role:

```text
ADMIN
```

Unauthorized requests return HTTP `401`.

Authenticated users without the required role receive HTTP `403`.

---

## Main API Endpoints

### Health

```http
GET /api/health
```

Checks:

- Application availability
- Database connectivity
- PostGIS availability

---

### Authentication

```http
POST /api/auth/login
GET  /api/auth/me
```

---

### Public Search

```http
GET /api/public/search
GET /api/public/filters
```

Search supports parameters such as:

```text
q
brandId
categoryId
status
city
page
size
sort
latitude
longitude
radiusKm
```

---

### Public Product Details

```http
GET /api/public/products/{productId}
```

Returns product information and offers from active stores.

---

### Public Store Details

```http
GET /api/public/stores/{storeId}
```

Returns store information and its public inventory.

Only active stores are publicly accessible.

---

### Store Owner

```http
GET /api/store/dashboard

GET /api/store/stores
GET /api/store/stores/{storeId}
PUT /api/store/stores/{storeId}

GET    /api/store/stores/{storeId}/inventory
POST   /api/store/stores/{storeId}/inventory
PUT    /api/store/stores/{storeId}/inventory/{inventoryId}
DELETE /api/store/stores/{storeId}/inventory/{inventoryId}

GET /api/store/stores/{storeId}/dashboard
GET /api/store/stores/{storeId}/activity

GET /api/store/catalog/products
```

---

### Administrator

```http
GET /api/admin/dashboard

GET   /api/admin/stores
GET   /api/admin/stores/filters
GET   /api/admin/stores/{storeId}
PUT   /api/admin/stores/{storeId}
PATCH /api/admin/stores/{storeId}/status

GET /api/admin/store-owners

GET /api/admin/analytics
GET /api/admin/audit
```

---

### Catalog Administration

Brands:

```http
GET    /api/admin/catalog/brands
GET    /api/admin/catalog/brands/{id}
POST   /api/admin/catalog/brands
PUT    /api/admin/catalog/brands/{id}
DELETE /api/admin/catalog/brands/{id}
```

Categories:

```http
GET    /api/admin/catalog/categories
GET    /api/admin/catalog/categories/{id}
POST   /api/admin/catalog/categories
PUT    /api/admin/catalog/categories/{id}
DELETE /api/admin/catalog/categories/{id}
```

Products:

```http
GET    /api/admin/catalog/products
GET    /api/admin/catalog/products/{id}
POST   /api/admin/catalog/products
PUT    /api/admin/catalog/products/{id}
DELETE /api/admin/catalog/products/{id}
```

---

## Validation

ShelfRadar validates requests at several levels.

Examples include:

- Required product names
- Required brands and categories
- Positive resource IDs
- Valid latitude range from `-90` to `90`
- Valid longitude range from `-180` to `180`
- Non-negative inventory quantities
- Non-negative prices
- Valid stock-state combinations
- Maximum field lengths
- Valid email addresses
- Valid pagination parameters

Inventory status consistency is also enforced.

Examples:

```text
quantity = 0
status = OUT_OF_STOCK
```

and:

```text
quantity > 0
status != OUT_OF_STOCK
```

Invalid requests return structured HTTP `400` responses.

---

## Error Handling

The backend provides centralized REST exception handling.

Typical HTTP responses include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
```

Application error responses follow a structure similar to:

```json
{
  "timestamp": "2026-01-01T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed.",
  "path": "/api/example",
  "fieldErrors": {
    "field": "Invalid value."
  }
}
```

---

## Frontend

The ShelfRadar frontend is implemented as a React single-page application.

The application includes dedicated experiences for:

- Public users
- Store owners
- Administrators

The interface uses a responsive dark design with cyan and sky accents.

The frontend supports desktop, tablet, and mobile layouts.

---

## Public Search Interface

The public search interface contains:

- Search bar
- Brand filtering
- Category filtering
- City filtering
- Stock filtering
- Location-based radius filtering
- Sorting
- Offer view
- Map view
- Pagination

Results display:

- Product
- Brand
- Category
- Store
- Price
- Quantity
- Stock status
- Address
- Distance when location is available
- Last update information

---

## Interactive Maps

Maps are implemented using:

- Leaflet
- React Leaflet
- OpenStreetMap tiles

ShelfRadar supports:

- Store markers
- User-location marker
- Automatic map bounds
- Multiple stores on search maps
- Individual store maps
- Stock-status visualization

---

## Running with Docker

The easiest way to run the complete application is with Docker Compose.

### Requirements

Install:

- Docker
- Docker Compose

From the project root:

```bash
docker compose up --build
```

Docker Compose starts:

```text
PostgreSQL + PostGIS
Spring Boot backend
React/Nginx frontend
```

Once the containers are running, open:

```text
http://localhost:3000
```

Backend API:

```text
http://localhost:8080
```

Health endpoint:

```text
http://localhost:8080/api/health
```

---

## Docker Services

The root `docker-compose.yml` defines three services.

### Database

```text
shelfradar-db
```

Uses:

```text
postgis/postgis:16-3.4
```

### Backend

```text
shelfradar-backend
```

Runs the Spring Boot application on:

```text
8080
```

### Frontend

```text
shelfradar-frontend
```

Uses Nginx and is exposed on:

```text
3000
```

Nginx also proxies:

```text
/api/*
```

to the backend container.

This allows the frontend to use the same `/api` base URL in production.

---

## Docker Data Persistence

PostgreSQL data is stored in the Docker volume:

```text
shelfradar_db_data
```

Running:

```bash
docker compose down
```

stops the application without deleting database data.

To completely remove the database volume:

```bash
docker compose down -v
```

Use the second command only when you intentionally want to reset the database.

---

## Running Locally Without Docker

The application can also be run locally for development.

### Database

A PostgreSQL 16 database with PostGIS must be available at:

```text
localhost:5432
```

Default development database configuration:

```text
Database: shelfradar
Username: shelfradar
Password: shelfradar
```

---

## Backend Development

Navigate to:

```bash
cd backend
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On Linux or macOS:

```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

## Frontend Development

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm ci
```

Start the Vite development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

During local development, Vite proxies requests beginning with:

```text
/api
```

to:

```text
http://localhost:8080
```

---

## Environment Configuration

Backend database configuration can be overridden using Spring environment variables.

Example:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
```

JWT configuration can be overridden with:

```text
SECURITY_JWT_ISSUER
SECURITY_JWT_EXPIRATION_MINUTES
SECURITY_JWT_SECRET
```

For Docker Compose, a custom JWT secret can be supplied through:

```text
JWT_SECRET
```

Example in PowerShell:

```powershell
$env:JWT_SECRET="replace-with-a-secure-secret-at-least-32-bytes-long"
docker compose up --build
```

For production deployments, always use a strong secret and never rely on the development fallback value.

---

## Backend Build

From the `backend` directory:

### Windows

```powershell
.\mvnw.cmd clean package
```

### Linux or macOS

```bash
./mvnw clean package
```

The generated application JAR is placed in:

```text
backend/target/
```

---

## Frontend Build

From the `frontend` directory:

```bash
npm ci
npm run build
```

The production frontend is generated in:

```text
frontend/dist/
```

---

## Testing

### Backend Tests

From the backend directory:

```powershell
.\mvnw.cmd clean test
```

or:

```bash
./mvnw clean test
```

### Frontend Tests

From the frontend directory:

```bash
npm test
```

### Frontend Linting

```bash
npm run lint
```

### Frontend Production Build Verification

```bash
npm run build
```

A complete pre-deployment verification should include:

```text
Backend tests
Frontend tests
Frontend lint
Frontend production build
Docker Compose build
Application smoke testing
```

---

## Security

ShelfRadar includes:

- BCrypt password hashing
- Stateless JWT authentication
- JWT expiration
- JWT issuer validation
- HS256 signature verification
- Backend role-based authorization
- Resource ownership validation
- Request validation
- Protected administrator endpoints
- Protected store-owner endpoints
- Centralized REST error handling
- Database constraints
- Unique inventory constraints

Authorization is enforced on the backend and does not rely solely on frontend route protection.

---

## Store Ownership Protection

A store owner cannot access another owner's store by changing a URL or resource ID.

Backend services verify ownership using the authenticated user's identity before allowing:

- Store access
- Store updates
- Inventory reads
- Inventory creation
- Inventory updates
- Inventory deletion
- Dashboard access
- Activity access

---

## Inventory Consistency

ShelfRadar maintains inventory consistency between quantity and stock status.

For example:

```text
Quantity = 0
```

requires:

```text
OUT_OF_STOCK
```

while a positive quantity cannot use:

```text
OUT_OF_STOCK
```

The application validates these rules before persisting changes, with additional database constraints used to protect data integrity.

---

## Audit and Analytics

ShelfRadar contains an audit subsystem for tracking important platform actions.

Tracked information can include:

- Actor
- Actor role
- Store
- Product
- Entity
- Action
- Change details
- Timestamp

Administrator analytics include:

- Activity during the last 24 hours
- Activity during the last 7 days
- Inventory changes
- Store changes
- Daily activity
- Most active stores
- Recent activity

Store owners can also view activity associated with stores that they own.

---

## Responsive Design

ShelfRadar is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

The interface uses:

- Responsive layouts
- Accessible controls
- Clear loading states
- Error states
- Empty states
- Stock-status indicators
- Dashboard metrics
- Mobile navigation
- Interactive maps
- Consistent application shells

---

## Development Workflow

A typical development workflow is:

```bash
git status
git add .
git commit -m "Describe the change"
```

The project's primary local branch may be named:

```text
master
```

Check the active branch with:

```bash
git branch
```

---

## Production Considerations

Before deploying ShelfRadar to a production environment:

- Replace all development credentials
- Configure a strong JWT secret
- Use secure database credentials
- Configure HTTPS
- Configure production DNS
- Restrict database exposure
- Configure database backups
- Review application logs
- Configure monitoring
- Validate CORS requirements if frontend and API are hosted separately
- Run all automated tests
- Run frontend linting
- Verify the production frontend build
- Verify Flyway migrations
- Perform end-to-end smoke testing

---

## Design Principles

ShelfRadar was developed around the following principles:

### Security

Authorization decisions are enforced by the backend.

### Data Integrity

Database constraints, validation, and transactional services protect application data.

### Separation of Concerns

Controllers, services, repositories, mappers, DTOs, entities, and security components have separate responsibilities.

### Responsive User Experience

The public interface and management dashboards are designed for desktop and mobile use.

### Reproducible Deployment

Docker Compose provides a consistent environment for the database, backend, and frontend.

### Database Versioning

Flyway manages database evolution instead of automatic Hibernate schema generation.

### Geographic Search

PostGIS provides scalable geographic queries instead of calculating all distances exclusively in application code.

---

## Application Flow

```text
Public User
    |
    +--> Search Products
    |       |
    |       +--> Filter / Sort
    |       +--> Compare Offers
    |       +--> View Map
    |       +--> Product Details
    |       +--> Store Details
    |
    v

Store Owner
    |
    +--> Login
    +--> Owner Dashboard
    +--> Select Store
    +--> Store Dashboard
    +--> Manage Inventory
    +--> Update Store
    +--> View Activity
    |
    v

Administrator
    |
    +--> Login
    +--> Admin Dashboard
    +--> Manage Stores
    +--> Manage Catalog
    +--> Review Analytics
    +--> Review Audit Activity
```

---

## Status

ShelfRadar currently includes the main end-to-end application architecture:

- Database schema and migrations
- PostgreSQL and PostGIS integration
- Authentication
- Role-based authorization
- Product catalog
- Store management
- Inventory management
- Public search
- Geographic search
- Product and store detail pages
- Store-owner dashboards
- Administrator dashboards
- Store administration
- Audit logging
- Analytics
- Responsive frontend
- Dockerized backend
- Dockerized frontend
- Docker Compose integration
- Automated frontend and backend testing infrastructure

---

## License

This project is currently intended for educational and portfolio use.

---

## ShelfRadar

**Find it nearby. Compare it clearly. Know before you go.**