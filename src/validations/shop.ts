import Joi from "joi";
import objectId from "./common";

export const validateShop = {
  body: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};

export const validateShopId = {
  params: Joi.object({
    shopId: objectId.messages({
      "any.required": "Shop id is required.",
      "string.length": "Shop id must be a valid mongoose id.",
    })
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};
