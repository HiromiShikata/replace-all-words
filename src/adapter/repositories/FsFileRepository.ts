import {FileRepository} from "../../domain/usecases/adapter-interfaces/FileRepository";
import * as fs from 'fs';

export class FsFileRepository implements FileRepository {
    readFileSync = (path: string): string  => fs.readFileSync(path, 'utf-8')

    readdirSync = (path: string): string[] =>fs.readdirSync(path);
    renameSync = (oldPath: string, newPath: string): void => fs.renameSync(oldPath, newPath);
}
