import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import DatabaseConfig from './config/mongodb.config';
import swaggerDocs from './swagger.json';

// Import routes
import authRoutes from '@routes/auth.routes';
import categoryRoutes from '@routes/category.routes';
import taskRoutes from '@routes/task.routes';
import userRoutes from '@routes/user.routes';

class App {
    public express: express.Application;

    public constructor () {
        this.express = express();

        this.middlewares();
        this.database();
        this.routes();
        dotenv.config();
    }

    private middlewares (): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());
        this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

        const args = process.argv;

        if (args.includes('--prod=true')) {
            this.express.use(express.static(path.join(__dirname, 'docs')));
            this.express.use('/', express.static(path.join(__dirname, 'docs')));
        }
    }

    private database (): void {
        const args = process.argv;
        let database;

        if (args.includes('--prod=true')) {
            database = DatabaseConfig.urlProd;
            console.log('Using production connection string.');
        } else {
            database = DatabaseConfig.url;
            console.log('Using local connection string.');
        }

        mongoose
            .connect(database, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            })
            .then(() => console.log('Successfully connected to MongoDB.'))
            .catch((error) => {
                console.log(`Could not connect to MongoDB. Error: ${error}`);
                process.exit();
            });
    }

    private routes (): void {
        this.express.use(authRoutes);
        this.express.use(taskRoutes);
        this.express.use(userRoutes);
        this.express.use(categoryRoutes);
    }
}

export default new App().express;
