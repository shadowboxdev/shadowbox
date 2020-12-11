import { Request } from 'express';
import { match } from 'ramda';

type File = Express.Multer.File;
type CallbackFn<T> = (error: Error | null, response: T) => void;

export const editFileName = (req: Request, file: File, callback: CallbackFn<string>) => {
    callback(null, file.originalname);
}

export const imageFileFilter = (req: Request, file: File, callback: CallbackFn<boolean>) => {
    const imgExtRegExp = new RegExp(/\.(jpg|jpeg|png|gif)$/);

    if (!match(imgExtRegExp, file.originalname)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};