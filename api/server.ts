import createError from 'http-errors';
import app from './app';

// Creates server
app.listen(process.env.SERVER_PORT, () => {
    const host = process.env.SERVER_HOST;
    const port = process.env.SERVER_PORT;
    console.log('App listening at http://%s:%s.', host, port);
});

// 404 Handler
app.use((request, response, next) => next(createError(404, "This route don't exist.", { expose: false })));

// Error handler
app.use((error, request, response: any) => {
    console.error((error as any).message);
    if (!error.statusCode) error.statusCode = 500;
    response.status(error.statusCode).send((error as any).message);
});
