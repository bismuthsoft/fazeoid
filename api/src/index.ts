import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { json } from 'body-parser';
import routes from './routes/index';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import config from './config';

const app = express();
app.use(json());

// Add the routes with the base prefix
app.use('/' + config.prefix, routes);

// Add error handling
app.use(errorHandler);

mongoose
    .connect(
        config.databaseUri!,
        // Pass the options as ConnectOptions to avoid TS errors
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions
    )
    .then((res) => {
        console.log('Connected to Database - Initial Connection');
        // Listen only if DB connection works
        app.listen(config.port, () => {
            console.log(`server is listening on port ${config.port}`);
        });
    })
    .catch((err) => {
        console.log(`Initial Database connection error occured -`, err);
    });
