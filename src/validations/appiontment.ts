import Joi from "joi";
import objectId from "./common";

export const validateBooking = {
  body: Joi.object({
    shopId: objectId.messages({
      "any.required": "shop Id is required.",
      "string.length": "shop Id id must be a valid mongoose id.",
    }),
    day: Joi.string().required(),
    time: Joi.string().required(),
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};

export const validateId = {
  params: Joi.object({
    customerId: objectId.messages({
      "any.required": "customer Id is required.",
      "string.length": "customer Id id must be a valid mongoose id.",
    })
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};

export const validateUpdate = {
  params: Joi.object({
    appiontmentId: objectId.messages({
      "any.required": "appiontment Id is required.",
      "string.length": "appiontment Id id must be a valid mongoose id.",
    })
  }),
  query: Joi.object({
    status: Joi.string().valid("accepted", "declined").required()
  }),
  body: Joi.object({
    reason: Joi.string()
  })
    .messages({
      "object.unknown": "You have used an invalid key."
    })
};
