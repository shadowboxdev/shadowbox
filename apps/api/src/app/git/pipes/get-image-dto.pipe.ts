import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isNil } from 'ramda';

import { GetImageDto, IGetImageDto } from '../models';

@Injectable()
export class GetImageDtoPipe
  implements PipeTransform<IGetImageDto, GetImageDto> {
  public transform(
    value: IGetImageDto,
    metadata: ArgumentMetadata,
  ): GetImageDto {
    if (isNil(value)) throw new BadRequestException('Validation failed');

    return new GetImageDto(value);
  }
}
