import Joi from "joi";
import objectId from "./common";

export const validateChannel = {
  body: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid("public", "private").required(),
    appiontmentId: objectId.messages({
      "any.required": "appiontment Id is required.",
      "string.length": "appiontment Id id must be a valid mongoose id.",
    })
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};

export const validateMessage = {
  body: Joi.object({
    message: Joi.string().required(),
    channelId: objectId.messages({
      "any.required": "channel Id is required.",
      "string.length": "channel Id id must be a valid mongoose id.",
    })
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};

export const validateChannelId = {
  params: Joi.object({
    channelId: objectId.messages({
      "any.required": "channel Id is required.",
      "string.length": "channel Id id must be a valid mongoose id.",
    })
  }).messages({
    "object.unknown": "You have used an invalid key."
  })
};
