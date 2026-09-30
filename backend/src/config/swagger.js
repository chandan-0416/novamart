const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Platform REST API',
      version: '1.0.0',
      description: 'Production-ready E-Commerce Backend with Node.js, Express, and PostgreSQL (Raw SQL)',
      contact: {
        name: 'API Support',
        email: 'support@ecommerce.local'
      }
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
