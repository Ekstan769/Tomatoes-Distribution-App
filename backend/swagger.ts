import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Farm API Documentation',
    description: 'Tomatoes Farm API Documentation.',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your JWT token in the format: Bearer <token>'
    }
  }
};

const outputFile = './swagger.json';


const endpointsFiles = ['./src/server.ts']; 

// Initialize the generator and run it
swaggerAutogen()(outputFile, endpointsFiles, doc);
