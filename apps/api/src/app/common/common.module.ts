import { Module } from '@nestjs/common';

import { JoiValidationPipe } from './pipes/guid-validation.pipe';

@Module({
  imports: [],
  controllers: [],
  providers: [JoiValidationPipe],
  exports: [JoiValidationPipe],
})
export class CommonModule {}
