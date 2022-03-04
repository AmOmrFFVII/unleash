import joi from 'joi';

export const constraintNumberTypeSchema = joi.number();

export const constraintStringTypeSchema = joi.array().items(joi.string());

export const constraintDateTypeSchema = joi.date();
