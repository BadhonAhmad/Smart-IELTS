# Smart IELTS Backend

A robust Node.js backend application for the Smart IELTS platform, built with Express.js and comprehensive testing.

## Features

- 🚀 Express.js server with security middleware
- 🛡️ Security features (Helmet, CORS, Rate limiting)
- 📊 Health check endpoints
- 🧪 Comprehensive test suite (Jest + Supertest)
- 🔍 ESLint for code quality
- 📝 Request logging with Morgan
- ⚡ Hot reload with Nodemon
- 🗄️ Database configuration ready
- 🛠️ Utility functions and helpers

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Lint code
- `npm run lint:fix` - Lint and fix code

## API Endpoints

### Health & Info
- `GET /` - API information
- `GET /health` - Server health check
- `GET /api` - API version info
- `GET /api/health` - API health status

### Example Endpoints
- `GET /api/example` - Example endpoint

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Main application file
│   ├── controllers/        # Request handlers
│   │   └── index.js
│   ├── routes/             # Route definitions
│   │   └── index.js
│   ├── middleware/         # Custom middleware
│   │   └── index.js
│   └── utils/              # Utility functions
│       └── index.js
├── config/
│   └── database.js         # Database configuration
├── tests/                  # Test files
│   ├── setup.js
│   ├── app.test.js
│   ├── controllers.test.js
│   ├── middleware.test.js
│   └── utils.test.js
├── .env.example            # Environment template
├── .gitignore
├── .eslintrc.js
└── package.json
```

## Testing

The project includes comprehensive tests:

- **Integration Tests**: API endpoint testing
- **Unit Tests**: Controllers, middleware, and utilities
- **Test Coverage**: Coverage reports with Jest

Run tests:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Database Configuration

The project is ready for multiple database options:

### MongoDB (with Mongoose)
Uncomment the MongoDB section in `config/database.js` and install mongoose:

```bash
npm install mongoose
```

### PostgreSQL/MySQL
Configure connection details in `.env` and install appropriate driver:

```bash
# For PostgreSQL
npm install pg sequelize

# For MySQL
npm install mysql2 sequelize
```

### SQLite (Development)
For quick development setup:

```bash
npm install sqlite3 sequelize
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents abuse
- **Request Validation**: Input sanitization
- **Error Handling**: Secure error responses

## Development Guidelines

### Code Style
- Uses ESLint with Standard configuration
- 2-space indentation
- Single quotes for strings
- Semicolons required

### Environment Variables
- Keep sensitive data in `.env`
- Use `.env.example` for documentation
- Different configs for development/production

### Testing Best Practices
- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Mock external dependencies

## Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=3000
# Add your production database URL
# Add your JWT secret
# Add other production configs
```

### Docker (Optional)
Create a `Dockerfile` for containerization:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Run linting
6. Submit a pull request

## License

ISC License

## Support

For support, please contact the development team or create an issue in the repository.

## Project Structure

```
my-node-backend
├── src
│   ├── app.js               # Entry point of the application
│   ├── controllers          # Contains controller functions
│   ├── routes               # Contains route definitions
│   ├── middleware           # Contains middleware functions
│   └── utils                # Contains utility functions
├── config                   # Configuration files
│   └── database.js          # Database connection configuration
├── package.json             # NPM configuration file
└── README.md                # Project documentation
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd my-node-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the application:
   ```
   npm start
   ```

## Features

- Express framework for building APIs
- Modular structure for easy maintenance
- Middleware support for request processing
- Utility functions for common tasks

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.