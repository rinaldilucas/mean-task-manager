import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import createError from 'http-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConfig from './config/mongodb.config';
import './utils/auth-strategy';

// Routes
import categoryRoutes from './routes/category.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Load routes
categoryRoutes(app);
taskRoutes(app);
userRoutes(app);

// Configures the database
dotenv.config();
const args = process.argv;
let database;

if (args.includes('--prod=true')) {
    database = dbConfig.urlProd;
    console.log('Using production connection string.');
} else {
    database = dbConfig.url;
    console.log('Using local connection string.');
}

// Connects to the database
mongoose.Promise = global.Promise;
mongoose
    .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Successfully connected to MongoDB.');
    })
    .catch((error: any) => {
        console.log('Could not connect to MongoDB. Error: ' + error);
        process.exit();
    });

// Load express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Creates server
const server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

if (args.includes('--prod=true')) {
    app.use(express.static(path.join(__dirname, 'docs')));
    app.use('/', express.static(path.join(__dirname, 'docs')));
}

// 404 Handler
app.use((request: any, response: any, next: any) => next(createError(404, "This route don't exist.", { expose: false })));

// Error handler
app.use(function (error: any, request: any, response: any, next: any) {
    console.error(error.message);
    if (!error.statusCode) error.statusCode = 500;
    response.status(error.statusCode).send(error.message);
});
