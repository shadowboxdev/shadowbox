import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage, } from 'multer';
import { resolve } from 'path';

import { AppConfigModule } from '../config';
import { FilesController } from './controllers/file.controller';
import { editFileName, imageFileFilter } from './utils';

@Module({
  imports: [
    MulterModule.register({
        storage: diskStorage({
            destination: resolve(__dirname, 'uploads'),
            filename: editFileName
        }),
        fileFilter: imageFileFilter
    }),
    AppConfigModule
  ],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}






