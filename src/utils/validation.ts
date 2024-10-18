import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
  
  export const bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    published_year: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
    isbn: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
  });
  