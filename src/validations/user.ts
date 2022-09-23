import Joi from "joi";
import objectId from "./common";

export const validateSignup = {
  body: Joi.object({
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(16),
    phone: Joi.string().required(),
    role: Joi.string().valid("customer", "vendor").required()
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};

export const validateLogin = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};

export const validateProfile = {
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string()
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};

export const validateUser = {
  query: Joi.object({
    type: Joi.string().valid("activate", "deactivate").required(),
  }),
  params: Joi.object({
    userId: objectId.messages({
      "any.required": "Shop id is required.",
      "string.length": "Shop id must be a valid mongoose id.",
    })
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};
