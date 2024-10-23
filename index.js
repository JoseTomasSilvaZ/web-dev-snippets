import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './routes/auth.js';
import { productsRouter } from './routes/products.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const swaggerSpecs = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Example API',
      version: '1.0.0',
      description: 'API docs',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  apis: ['./routes/*.js'], 
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(authRouter);
app.use(productsRouter)

app.listen(3000, () => {
  console.log('listening on port 3000');
});
