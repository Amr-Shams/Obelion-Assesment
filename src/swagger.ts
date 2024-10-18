import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management System API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            isAdmin: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Book: {
          type: 'object',
          required: ['title', 'author', 'published_year', 'isbn', 'quantity'],
          properties: {
            id: {
              type: 'integer',
            },
            title: {
              type: 'string',
            },
            author: {
              type: 'string',
            },
            published_year: {
              type: 'integer',
            },
            isbn: {
              type: 'string',
            },
            quantity: {
              type: 'integer',
            },
          },
        },
        Register: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
          },
        },
        Borrow: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            userId: {
              type: 'integer',
            },
            bookId: {
              type: 'integer',
            },
            borrowDate: {
              type: 'string',
              format: 'date-time',
            },
            returnDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
        Report: {
          type: 'object',
          properties: {
            bookId: {
              type: 'integer',
            },
            title: {
              type: 'string',
            },
            author: {
              type: 'string',
            },
            borrowCount: {
              type: 'integer',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export default (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};