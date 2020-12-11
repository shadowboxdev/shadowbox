import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { Sharp } from 'sharp';

import { GetImageDto } from '../models';
import { DefaultResizeOptions } from '../constants';

@Injectable()
export class ImageService {
  public resize(imageStream: NodeJS.ReadableStream, dto: GetImageDto): Sharp {
    const { format, width, height } = dto;

    let transform = sharp();

    if (format) transform = transform.toFormat(format);

    if (width || height) {
      transform = transform.resize(width, height, DefaultResizeOptions);
    }

    return imageStream.pipe(transform);
  }
}
