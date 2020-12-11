import { Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express';
import { resolve } from 'path';
import { append, reduce } from 'ramda';

import { File } from '../models';

/**
 * @TODO add database and save file name linked with user;
 * need to set up permissions and stuff with auth module first.
 */
@Controller('files')
export class FilesController {
    @Get(':imgpath')
    public getImage(@Param('imgpath') path, @Res() res: Response): void {
        return res.sendFile(path, { root: resolve(__dirname, 'uploads') });
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    public async uploadFile(@UploadedFile() file: File): Promise<string> {
        return `uploads/${file.originalname}`;
    }

    @Post('upload/multiple')
    @UseInterceptors(FilesInterceptor('files', 20))
    public uploadFiles(@UploadedFiles() files: File[]): string[] {
        return reduce<File, string[]>((acc, file) => acc = append(`uploads/${file.originalname}`, acc), [], files)
    }
}
