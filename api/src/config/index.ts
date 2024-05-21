// Add dotenv for environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    jwt: {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER
    },
    port: process.env.PORT || 3000,
    prefix: process.env.API_PREFIX || 'api',
    databaseUri: process.env.MONGODB_URI
};

export default config;
