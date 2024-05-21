# Hacking JWT - Toptal

Sample Express REST API with JWT authentication/authorization.

## MongoDB Setup

### Local Setup

Start by checking the MongoDB version you are using:

```bash
mongo --version
```

You might receive a similar response to this:

```bash
MongoDB shell version v5.0.2
Build Info: {
    "version": "5.0.2",
    "gitVersion": "6d9ec525e78465dcecadcff99cce953d380fedc8",
    "modules": [],
    "allocator": "system",
    "environment": {
        "distarch": "x86_64",
        "target_arch": "x86_64"
    }
}
```

If no version present, you can install it from [here](https://www.mongodb.com/docs/manual/installation/);

### Cloud Setup

A MongoDB cluster hosted on the cloud can also be used, which can be obtained (for free as a Shared Cluster) in [MongoDB Cloud](https://www.mongodb.com/cloud).

## Basic Project

### Creating the Project

Starting with an empty folder, initialize the Node project:

```bash
npm init -y
```

The following dependencies will be used:

```bash
npm install typescript ts-node-dev @types/bcrypt @types/express @types/mongoose --save-dev
npm install mongoose bcrypt body-parser dotenv express mongoose
```

A `tsconfig` file is required for TypeScript:

```bash
npx tsc --init
```

### Configuring the Project

Create a new configuration file `src/config/index.ts`. This file will contain all the necessary information coming from the environment:

```typescript
// Add dotenv for environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    // JWT important variables
    // Secret is the secret for the signatures
    // Audience and issuer are for validation purposes
    jwt: {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER
    },
    // API information such as port and prefix
    port: process.env.PORT || 3000,
    prefix: process.env.API_PREFIX || 'api',
    // Database connection URI for Mongo
    databaseUri: process.env.MONGODB_URI
};

export default config;
```

Note that the following environment variables should be set either as environment or a `.env` file:

-   `JWT_SECRET`
-   `JWT_AUDIENCE`
-   `JWT_ISSUER`
-   `PORT`
-   `API_PREFIX`
-   `MONGODB_URI`

### Project Entrypoint

Create a new file `src/index.ts` with the entrypoint of the API:

```typescript
import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { json } from 'body-parser';

import config from './config';

const app = express();
app.use(json());

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
```

Update the `package.json` file to include the following configuration:

```json
"main": "index.js",
"scripts": {
    "start": "ts-node-dev src/index.ts"
},
```

### Error Handling

In order to use asynchronous handlers and have proper error handling, given Express doesn't catch the promise rejections, we need some wrapper code for this.

We create a new file `src/middleware/asyncHandler.ts` with the following content. This handler is meant to wrap function handlers and propagate promise errors into the error handler we'll add next.

```typescript
import { NextFunction, Request, Response } from 'express';

/**
 * Async handler to wrap the API routes, this allows for async error handling.
 * @param fn Function to call for the API endpoint
 * @returns Promise with a catch statement
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => void) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
```

Now that we have an async handler in place, we can create the error handler file `src/middleware/errorHandler.ts`. For this handler we use custom exceptions to properly define errors in our code. We'll define the custom error next.

```typescript
import { Request, Response, NextFunction } from 'express';
import { CustomError, IResponseError } from '../exceptions/customError';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    // Log the error to console, this could be configured to be done only in a production environment
    console.error(err);
    // If the error is a known, custom error, handle it that way
    // Otherwise return a generic 500 error
    if (!(err instanceof CustomError)) {
        res.status(500).send(
            JSON.stringify({
                message: 'Server error, please try again later'
            })
        );
    } else {
        const customError = err as CustomError;
        let response = {
            message: customError.message
        } as IResponseError;
        // Check if more info to return
        if (customError.additionalInfo) {
            response.additionalInfo = customError.additionalInfo;
        }
        res.status(customError.status).type('json').send(JSON.stringify(response));
    }
}
```

Lastly, we need to create our custom error and custom error response interface in `src/exceptions/customError.ts`. Note that the custom error extends from `Error` and defines an response error interface too.

```typescript
export class CustomError extends Error {
    message!: string;
    status!: number;
    additionalInfo!: any;

    constructor(message: string, status: number = 500, additionalInfo: any = undefined) {
        super(message);
        this.message = message;
        this.status = status;
        this.additionalInfo = additionalInfo;
    }
}

export interface IResponseError {
    message: string;
    additionalInfo?: string;
}
```

With all this set in place, we can add this middleware to our API. Within `src/index.ts` we can add:

```typescript
// ... imports
import { errorHandler } from './middleware/errorHandler';
// ... more imports

// Add error handling, must be the last middleware to be called
// This will make sure the errors will always be handled properly
app.use(errorHandler);

mongoose
    .connect(...
```

#### Custom Errors

Apart from creating the `CustomError` we'd like to have more granular errors, in order to simplify the API code and have an easier way to unify messages.

We will be creating four other custom errors, but one can add as many as you want. Some of those errors will be mainly used later on when we add authentication and authorization.

-   `src/exceptions/clientError.ts`: Handles status code `400` errors.

    ```typescript
    import { CustomError } from './customError';

    export class ClientError extends CustomError {
        constructor(message: string) {
            super(message, 400);
        }
    }
    ```

-   `src/exceptions/forbiddenError.ts`: Handles status code `403` errors.

    ```typescript
    import { CustomError } from './customError';

    export class ForbiddenError extends CustomError {
        constructor(message: string) {
            super(message, 403);
        }
    }
    ```

-   `src/exceptions/notFoundError.ts`: Handles status code `404` errors.

    ```typescript
    import { CustomError } from './customError';

    export class NotFoundError extends CustomError {
        constructor(message: string) {
            super(message, 404);
        }
    }
    ```

-   `src/exceptions/unauthorizedError.ts`: Handles status code `401` errors.

    ```typescript
    import { CustomError } from './customError';

    export class UnauthorizedError extends CustomError {
        constructor(message: string) {
            super(message, 401);
        }
    }
    ```

### Models

This project will have a basic CRUD for users, so we need to define a user model in `src/models/user.ts`:

```typescript
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ROLES } from '../utils/constants';

export interface IUser {
    username: string;
    password: string;
    role: string;
}

interface userModelInterface extends mongoose.Model<UserDoc> {
    build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
    username: string;
    password: string;
    role: string;
    isPasswordCorrect(providedPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: [8, 'Username too short'],
            maxLength: [40, 'Username too long'],
            validate: {
                // Make sure there is no duplicate user with that username
                validator: async function (v: string): Promise<boolean> {
                    let doc: any = await User.findOne({ username: v });
                    // @ts-ignore
                    if (doc) return this._id.toString() === doc._id.toString();
                    else return Boolean(!doc);
                },
                message: 'Username already in use.'
            }
        },
        // Passwords are hashed with bcrypt, see below
        password: {
            type: String,
            required: true,
            minLength: [8, 'Password too short'],
            maxLength: [120, 'Password too long']
        },
        // Role will be saved for authorization
        role: {
            type: String,
            required: true,
            enum: [ROLES.USER, ROLES.ADMIN],
            default: ROLES.USER
        }
    },
    // Created at and updated at timestamps
    { timestamps: true }
);

// Hash the password prior to saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare passwords, instance method for the user
userSchema.method('isPasswordCorrect', async function (providedPassword: string): Promise<boolean> {
    return await bcrypt.compare(providedPassword, this.password);
});

// Static method to build a user
userSchema.statics.build = (attr: IUser) => {
    return new User(attr);
};

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
    }
});

const User = mongoose.model<UserDoc, userModelInterface>('User', userSchema);

export { User };
```

The User model contains roles for the user (which will be used for authorization later). We need to create our constants file with our role names. The file is `src/utils/constants.ts` and contains:

```typescript
export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
};
```

### Routes

The last piece missing of our implementation is the routes. We need the routes to redirect to each of the handlers. For this we create a `src/routes/index.ts` file with the following content:

```typescript
import { Router } from 'express';
import user from './user';

const routes = Router();

routes.use('/users', user);

export default routes;
```

And we need to include these routes in the `src/index.ts` file:

```typescript
// ... imports
import routes from './routes/index';
// ... more imports
const app = express();
app.use(json());

// Add the routes with the base prefix
// Must come before the error handler
app.use('/' + config.prefix, routes);

app.use(errorHandler);
```

We also need to create a `src/routes/user.ts` file with each of the `/users` route prefix. These routes make use of the `asyncHandler` we created earlier.

```typescript
import { Router } from 'express';
import UserController from '../controllers/UserController';

// Middleware
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Get all users
router.get('/', [], asyncHandler(UserController.listAll));

// Get one user
router.get('/:id([0-9a-z]{24})', [], asyncHandler(UserController.getOneById));

// Create a new user
router.post('/', [], asyncHandler(UserController.newUser));

// Edit one user
router.patch('/:id([0-9a-z]{24})', [], asyncHandler(UserController.editUser));

// Delete one user
router.delete('/:id([0-9a-z]{24})', [], asyncHandler(UserController.deleteUser));

export default router;
```

One of the last things to configure is the `src/controllers/UserController.ts`, which contains the logic for our user endpoints:

```typescript
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../exceptions/clientError';
import { NotFoundError } from '../exceptions/notFoundError';
import { User, IUser } from '../models/user';
import { ROLES } from '../utils/constants';
import { processErrors } from '../utils/errorProcessing';

class UserController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Execute the query
        const users = await User.find().select(['_id', 'username', 'role']);

        // Send the users object
        res.status(200).type('json').send(users);
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id: string = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const user = await User.findById(id).select(['_id', 'username', 'role']);
        if (!user) throw new NotFoundError(`User with ID ${id} not found`);

        res.status(200).type('json').send(user?.toJSON());
    };

    static newUser = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        let { username, password } = req.body;
        let user;

        try {
            user = User.build({ username, password } as IUser);

            // Save the user
            await user.save();
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send 201 response
        res.status(201).type('json').send(user.toJSON());
    };

    static editUser = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;
        // Get values from the body
        const { username, role } = req.body;

        // Mongoose automatically casts the id to ObjectID
        const user = await User.findById(id).select(['_id', 'username', 'role']);
        if (!user) throw new NotFoundError(`User with ID ${id} not found`);

        // Edit the properties
        if (username) user.username = username;
        if (role) user.role = role;

        // Save and catch all validation errors
        try {
            await user.save();
        } catch (e) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.status(204).type('json').send(user.toJSON());
    };

    static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const user = await User.findById(id).select(['_id', 'username', 'role']);
        if (!user) throw new NotFoundError(`User with ID ${id} not found`);

        await user.delete();

        // After all send a 204 (no content, but accepted) response
        res.status(204).type('json').send();
    };
}

export default UserController;
```

In order to properly return errors from Mongoose's validations, we can use a custom error processor, that takes properly formats the errors. This file is `src/utils/errorProcessing.ts`:

```typescript
import { Error } from 'mongoose';

export const processErrors = (error: Error.ValidationError): string => {
    if (!error) return '';
    const keys = Object.keys(error.errors);
    let response = '';
    for (let i = 0; i < keys.length; i++) {
        if (i > 0) response += '. ';
        response += error.errors[keys[i]].message;
    }
    return response;
};
```

This configuration exposes the following endpoints:

-   `/PREFIX/users GET`: Get all users
-   `/PREFIX/users POST`: Create a new user
-   `/PREFIX/users/{ID} DELETE`: Delete a specific user
-   `/PREFIX/users/{ID} PATCH`: Update a specific user
-   `/PREFIX/users/{ID} GET`: Get a specific user

## JWT Configuration

Having a basic implementation of the API, we need to implement authentication and authorization to have proper security. For this, we'll have JSON Web Tokens (JWT) for both purposes. The API will emit a JWT when the user logs in and will require it for authorization.

### JWT Secrets

For this set up we will be using `HS256` as the algorithm for JWT. We need a secret in order to sign the payload. For this we will use the `Node` CLI to generate a secret:

```javascript
require('crypto').randomBytes(128).toString('hex');
```

Using the `crypto` package, we can generate a random string and get it's hexadecimal version. This will be our JWT secret.

**Note**: The secret can be changed at any time. The only effect it will have is basically "logging out" all users. This is because the signatures will be verified with the new secret and won't match.

### Authentication Endpoints

For our basic authentication and authorization we need an endpoint for users to log in and change their password. To achieve this, we create a `src/controllers/AuthController.ts`, which will contain those handlers:

```typescript
import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { User } from '../models/user';
import config from '../config';
import { ClientError } from '../exceptions/clientError';
import { UnauthorizedError } from '../exceptions/unauthorizedError';
import { NotFoundError } from '../exceptions/notFoundError';
import { processErrors } from '../utils/errorProcessing';
import { Error } from 'mongoose';

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction) => {
        // Check if username and password are set
        let { username, password } = req.body;
        if (!(username && password)) throw new ClientError('Username and password are required');

        // Get user from database
        const user = await User.findOne({ username: username }).exec();

        // Check if encrypted password match
        if (!user || !(await user.isPasswordCorrect(password))) {
            throw new UnauthorizedError("Username and password don't match");
        }

        // Sing JWT, valid for 1 hour
        const token = sign({ userId: user._id.toString(), username: user.username, role: user.role }, config.jwt.secret!, {
            expiresIn: '1h',
            notBefore: '0', // Cannot use before now, can be configured to be deferred
            algorithm: 'HS256',
            audience: config.jwt.audience,
            issuer: config.jwt.issuer
        });

        // Send the jwt in the response
        res.type('json').send({ token: token });
    };

    static changePassword = async (req: Request, res: Response, next: NextFunction) => {
        // Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        // Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) throw new ClientError("Passwords don't match");

        // Get user from the database
        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError(`User with ID ${id} not found`);
        } else if (!(await user.isPasswordCorrect(oldPassword))) {
            throw new UnauthorizedError("Old password doesn't match");
        }

        // Store new pasword
        user.password = newPassword;

        try {
            // Just save, validation will happen when saving
            await user.save();
        } catch (e) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.status(204).send();
    };
}
export default AuthController;
```

The `login` handler will emit a token if the username and password match. The `changePassword` handler will change a user's password.

To include these handlers in our routes, we need to create a `src/routes/auth.ts` file:

```typescript
import { Router } from 'express';
import AuthController from '../controllers/AuthController';

// Middleware
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
// Login route
router.post('/login', asyncHandler(AuthController.login));

// Change my password
router.post('/change-password', [], asyncHandler(AuthController.changePassword));

export default router;
```

And then import this in our `src/routes/index.ts`:

```typescript
import { Router } from 'express';
import auth from './auth';
import user from './user';

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);

export default routes;
```

This configuration exposes the following endpoints:

-   `/PREFIX/auth/login POST`: Log in a user
-   `/PREFIX/auth/change-password POST`: Changes password for a user

### Authorization Middleware

We also need a way to verify the tokens and authorize users to access the resources. We use middlewares for this. We will create a middleware that verifies the tokens are correct and other that verifies the user has enough permissions.

The first middleware is `src/middleware/checkJwt.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import config from '../config';

// Custom request interface to include the token in the requests
export interface CustomRequest extends Request {
    token: JwtPayload;
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Get the jwt token from the head
    const token = <string>req.headers['authorization'];
    let jwtPayload;

    // Try to validate the token and get data
    try {
        jwtPayload = <any>verify(token?.split(' ')[1], config.jwt.secret!, {
            complete: true,
            audience: config.jwt.audience,
            issuer: config.jwt.issuer,
            algorithms: ['HS256'],
            clockTolerance: 0,
            ignoreExpiration: false,
            ignoreNotBefore: false
        });
        (req as CustomRequest).token = jwtPayload;
    } catch (error) {
        res.status(401)
            .type('json')
            .send(JSON.stringify({ message: 'Missing or invalid token' }));
        return;
    }

    // Call the next middleware or controller
    next();
};
```

Note that the token information is added to the request, which is then forwarded. The error handler won't work here because this middleware occurs before the error handler is included.

Then we create the `src/middleware/checkRole.ts` middleware:

```typescript
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { CustomRequest } from './checkJwt';

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Find the user within the database
        const user = await User.findById((req as CustomRequest).token.payload.userId);

        if (!user) {
            res.status(404)
                .type('json')
                .send(JSON.stringify({ message: 'User not found' }));
            return;
        }

        // Check if array of authorized roles includes the user's role
        if (roles.indexOf(user.role) > -1) next();
        else {
            res.status(403)
                .type('json')
                .send(JSON.stringify({ message: 'Not enough permissions' }));
            return;
        }
    };
};
```

Note that it uses the internal role stored in the database to avoid trusting the JWT in case the user had a change of role in between the token was emitted and now used.

Lastly, we need to update our routes files (`src/routes/auth.ts` and `src/routes/user.ts`) to use these middlewares:

-   `src/routes/auth.ts`

    ```typescript
    import { Router } from 'express';
    import AuthController from '../controllers/AuthController';
    import { checkJwt } from '../middleware/checkJwt';

    // Middleware
    import { asyncHandler } from '../middleware/asyncHandler';

    const router = Router();
    // Login route
    router.post('/login', asyncHandler(AuthController.login));

    // Change my password
    router.post('/change-password', [checkJwt], asyncHandler(AuthController.changePassword));

    export default router;
    ```

-   `src/routes/user.ts`

    ```typescript
    import { Router } from 'express';
    import UserController from '../controllers/UserController';

    // Middleware
    import { asyncHandler } from '../middleware/asyncHandler';
    import { checkJwt } from '../middleware/checkJwt';
    import { checkRole } from '../middleware/checkRole';

    const router = Router();

    // Get all users
    router.get('/', [checkJwt, checkRole(['USER', 'ADMIN'])], asyncHandler(UserController.listAll));

    // Get one user
    router.get('/:id([0-9a-z]{24})', [checkJwt, checkRole(['USER', 'ADMIN'])], asyncHandler(UserController.getOneById));

    // Create a new user
    router.post('/', [], asyncHandler(UserController.newUser));

    // Edit one user
    router.patch('/:id([0-9a-z]{24})', [checkJwt, checkRole(['USER', 'ADMIN'])], asyncHandler(UserController.editUser));

    // Delete one user
    router.delete('/:id([0-9a-z]{24})', [checkJwt, checkRole(['ADMIN'])], asyncHandler(UserController.deleteUser));

    export default router;
    ```

In these cases, endpoints that require authentication need to include the `checkJwt` middleware. Authorization is added when the `checkRole` middleware is included and roles with enough permissions are accessed.

### Better Authorization for Handlers

The last thing we need to update are the handlers, so that we add extra validations to have more control on the behavior of our endpoints and the data each user can access and/or modify.

We update the `src/controllers/UserController.ts` file to look like this:

```typescript
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ClientError } from '../exceptions/clientError';
import { ForbiddenError } from '../exceptions/forbiddenError';
import { NotFoundError } from '../exceptions/notFoundError';
import { CustomRequest } from '../middleware/checkJwt';
import { User, IUser } from '../models/user';
import { ROLES } from '../utils/constants';
import { processErrors } from '../utils/errorProcessing';

class UserController {
    static listAll = async (req: Request, res: Response, next: NextFunction) => {
        // Define the query to execute based on the role
        let query;
        if ((req as CustomRequest).token.payload.role === ROLES.USER) {
            query = User.find({role: ROLES.USER})
        } else {
            query = User.find()
        }

        // Execute the query
        const users = await query.select(['_id', 'username', 'role']);

        // Send the users object
        res.status(200).type('json').send(users);
    };

    static getOneById = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id: string = req.params.id;

        // Validate permissions
        if ((req as CustomRequest).token.payload.role === ROLES.USER && req.params.id !== (req as CustomRequest).token.payload.userId) {
            throw new ForbiddenError('Not enough permissions');
        }

        // Mongoose automatically casts the id to ObjectID
        const user = await User.findById(id).select(['_id', 'username', 'role']);
        if (!user) throw new NotFoundError(`User with ID ${id} not found`);

        res.status(200).type('json').send(user?.toJSON());
    };

    static newUser = async (req: Request, res: Response, next: NextFunction) => {
        // Get parameters from the body
        let { username, password } = req.body;
        let user;

        try {
            user = User.build({ username, password } as IUser);

            // Save the user
            await user.save();
        } catch (e: any) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        // If all ok, send 201 response
        res.status(201).type('json').send(user.toJSON());
    };

    static editUser = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Validate permissions
        if ((req as CustomRequest).token.payload.role === ROLES.USER && req.params.id !== (req as CustomRequest).token.payload.userId) {
            throw new ForbiddenError('Not enough permissions');
        }

        // Get values from the body
        const { username, role } = req.body;

        // Verify you cannot make yourself an admin if you are a user
        if ((req as CustomRequest).token.payload.role === ROLES.USER && role === ROLES.ADMIN) {
            throw new ForbiddenError('Not enough permissions');
        }

        // Mongoose automatically casts the id to ObjectID
        const user = await User.findById(id).select(['_id', 'username', 'role']);
        if (!user) throw new NotFoundError(`User with ID ${id} not found`);

        // Edit the properties
        if (username) user.username = username;
        if (role) user.role = role;

        // Save and catch all validation errors
        try {
            await user.save();
        } catch (e) {
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.status(204).type('json').send(user.toJSON());
    };

    static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Mongoose automatically casts the id to ObjectID
        const user = await User.findById(id).select(['_id', 'username', 'role']);
        if (!user) throw new NotFoundError(`User with ID ${id} not found`);

        await user.delete();

        // After all send a 204 (no content, but accepted) response
        res.status(204).type('json').send();
    };
}

export default UserController;
```