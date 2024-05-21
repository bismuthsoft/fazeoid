import { Error } from 'mongoose';

export const processErrors = (error: Error.ValidationError): string => {
    if (!error) return '';
    const keys = Object.keys(error.errors);
    let response = '';
    for (let i = 0; i < keys.length; i++) {
        if (i > 0) response += ". ";
        response += error.errors[keys[i]].message;
    }
    return response;
};
