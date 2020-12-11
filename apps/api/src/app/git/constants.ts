import { ResizeOptions, fit } from 'sharp';
import * as color from 'color';

export const API_ROOT_PATH: string = 'git';

export const DefaultResizeOptions: ResizeOptions = {
  fit: fit.contain,
  background: color.rgb(255, 255, 255).fade(0),
};
