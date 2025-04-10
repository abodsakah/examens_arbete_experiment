# WebShop Backend API

This is an optimized Express.js backend for a web shop application built with TypeScript. It is designed to provide a solid foundation for frontend performance testing experiments.

## Features

- Product catalog with filtering, sorting, and search capabilities
- Order placement and tracking system
- Simulated order tracking updates
- Performance benchmarking endpoints
- Optimized for speed and efficiency

## Tech Stack

- Express.js
- TypeScript
- MySQL
- Winston for logging
- Helmet for security
- Compression for response optimization
- Rate limiting for API protection

## Installation

### Automatic Setup

1. Ensure you have Node.js (v14+) and MySQL installed.

2. Clone the repository and navigate to the backend directory:

```bash
cd backend
```

3. Run the setup script:

```bash
./setup.sh
```

4. Update the `.env` file with your database credentials if needed.

5. Start the server:

```bash
npm start
```

### Manual Setup

If you prefer a manual setup, follow these steps:

1. Install dependencies:

```bash
npm install
```

2. Configure your environment variables:

```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials.

4. Set up the database:

```bash
npm run setup-db
```

5. Build the TypeScript code:

```bash
npm run build
```

6. Start the server:

```bash
npm start
```

For development with hot reloading:

```bash
npm run dev
```

## Database Setup

The application will automatically create the required tables and seed them with sample data when it starts. Make sure your MySQL server is running and the credentials in the `.env` file are correct.

## Testing the API

A Postman collection is included for easier API testing. You can import the `WebShop_API.postman_collection.json` file into Postman to quickly test all available endpoints.

## API Endpoints

### Products

- `GET /api/v1/products` - Get all products (with filtering & pagination)
- `GET /api/v1/products/:id` - Get product by ID
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/categories` - Get all product categories
- `GET /api/v1/products/search?q=keyword` - Search products

### Performance Test Endpoints

- `GET /api/v1/products/:id/recommendations?size=large` - Get product recommendations
- `GET /api/v1/products/:id/high-res-images` - Get high-resolution product images
- `GET /api/v1/products/:id/detailed-report` - Get detailed product report

### Orders

- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders/:id` - Get order by ID
- `GET /api/v1/orders/:id/tracking` - Get order tracking information
- `GET /api/v1/orders/tracking/:trackingNumber` - Get order by tracking number

### Benchmarking

- `POST /api/v1/benchmark` - Submit performance benchmark data
- `GET /api/v1/benchmark` - Get all benchmark data
- `GET /api/v1/benchmark/stats` - Get aggregated benchmark statistics

## Performance Optimizations

This backend implements several performance optimizations:

1. Response compression
2. Connection pooling for database queries
3. Caching headers for static assets
4. Rate limiting to prevent abuse
5. Efficient error handling
6. Optimized database queries
7. Stateless API design

## Testing the Frontend with this Backend

This backend is designed to help test frontend performance. It includes several features that can be used to challenge frontend performance:

1. The product recommendations endpoint can return varying amounts of data
2. The detailed report endpoint returns complex nested data structures
3. The high-resolution images endpoint simulates multiple image qualities
4. The order tracking simulation creates real-time updates

## License

MIT