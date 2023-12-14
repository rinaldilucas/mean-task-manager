import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';

import categoryRoutes from '@api/routes/category.routes';
import taskRoutes from '@api/routes/task.routes';
import userRoutes from '@api/routes/user.routes';
import swaggerDocs from '@root/swagger.json';

class Server {
  express: express.Application;

  constructor() {
    dotenv.config();
    this.express = express();

    this.middlewares();
    this.database();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(compression());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cors());
    this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  private database(): void {
    const args = process.argv;
    let database = process.env.MONGODB_HOST as string;

    if (args.includes('--prod=true')) {
      console.log('Using production connection string.');
    } else {
      console.log('Using local connection string.');
    }

    mongoose
      .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => console.log('Successfully connected to MongoDB.'))
      .catch((error) => {
        console.log(`Could not connect to MongoDB. Error: ${error}`);
        process.exit();
      });
  }

  private routes(): void {
    this.express.use(categoryRoutes);
    this.express.use(taskRoutes);
    this.express.use(userRoutes);
  }
}

const server = new Server().express;

// Redirect to the API documentation
server.get('/', (_request: Request, response: Response) => {
  response.redirect('/api-docs');
});

// Creates server
server.listen(process.env.SERVER_PORT, () => {
  const host = process.env.SERVER_HOST;
  const port = process.env.SERVER_PORT;
  console.log('App listening at %s:%s.', host, port);
});

// 404 Handler
server.use((_request: Request, _response: Response, next: NextFunction) => {
  next(
    createError(404, "This route don't exist.", {
      expose: false,
    }),
  );
});

// Error handler
server.use((error, _request: Request, response: Response) => {
  console.error((error as any).message);
  if (!error.statusCode) error.statusCode = 500;

  response.status(error.statusCode).send((error as any).message);
});
