import { compose, last, split, tail } from 'ramda';
import { extname } from 'path';

import { ImageFormat } from './models';

export const getFilename = compose<string, string[], string>(
  last,
  split('/'),
);

export const getImgFormat = compose<string, string, ImageFormat>(tail as any, extname);
