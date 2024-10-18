// helper function to check the validity of the email 
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
 const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// helper function to check the strength of the password 
// //  regex will do three things: 1- check the lenght of the password, 2 will check if it has at least one letter, 3- will check if it has at least one digit
// example of a valid password: "Password1"
 const isValidPassword = (password: string): boolean => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
};

export const isValidCredentials = (email: string, password: string): boolean => {
    return isValidEmail(email) && isValidPassword(password);
};


