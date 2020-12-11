import { Schema } from '@hapi/joi';
import * as Joi from '@hapi/joi';

export const guidSchema: Schema = Joi.string().guid({
  version: ['uuidv4', 'uuidv5'],
});
