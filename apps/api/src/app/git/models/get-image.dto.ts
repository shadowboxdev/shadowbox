import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { isNotNilOrEmpty, isString } from 'ramda-adjunct';

import { getFilename, getImgFormat } from '../utils';

export enum ImageFormat {
  PNG = 'png',
  JPG = 'jpg',
}

export interface IGetImageDto {
  path: string;
  format?: ImageFormat;
  filename?: string;
  height?: string | number;
  width?: string | number;
}

export class GetImageDto implements IGetImageDto {
  @ApiProperty()
  @IsString()
  public readonly path: string;

  @ApiProperty({
    enum: { PNG: ImageFormat.PNG, JPG: ImageFormat.JPG },
    enumName: 'ImageFormat',
  })
  @IsEnum(ImageFormat)
  public readonly format: ImageFormat;

  @ApiProperty()
  @IsString()
  public readonly filename: string;

  @ApiProperty()
  @IsNumber()
  public readonly height: number;

  @ApiProperty()
  @IsNumber()
  public readonly width: number;

  @ApiHideProperty()
  @IsBoolean()
  public readonly resize: boolean = false;

  constructor({ path, format, filename, height, width }: IGetImageDto) {
    if (!format) {
      format = getImgFormat(path);
    }

    if (!filename) {
      filename = getFilename(path);
    }

    if (isNotNilOrEmpty(width) && isString(width)) {
      this.width = parseInt(width, 10);
      this.resize = true;
    }

    if (isNotNilOrEmpty(height) && isString(height)) {
      this.height = parseInt(height, 10);
      this.resize = true;
    }

    this.path = path;
    this.format = format;
    this.filename = filename;
  }
}
