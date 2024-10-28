const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const options = {
  info: {
    title: 'usdiary',
    description: 'usdiary API 명세서',
  },
  servers: [
    {
      "url": "http://localhost:3000",
      "description": "Local development server"
    },
    {
      "url": "https://api.usdiary.site",
      "description": "Production server"
    }
  ],
  schemes: ['http','https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};
const outputFile = './swagger/swagger-output.json';
const endpointsFiles = ['../app.js'];
swaggerAutogen(outputFile, endpointsFiles, options);
