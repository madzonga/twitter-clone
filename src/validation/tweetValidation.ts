import Joi from 'joi';

export const tweetSchema = Joi.object({
  content: Joi.string().max(280).required()
});
