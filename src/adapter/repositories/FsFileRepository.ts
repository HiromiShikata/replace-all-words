import { FileRepository } from '../../domain/usecases/adapter-interfaces/FileRepository';
import * as fs from 'fs';

export class FsFileRepository implements FileRepository {
  lstatSync = (path: string) => fs.lstatSync(path);
  statSync = (path: string) => fs.statSync(path);
  readFileSync = (path: string): string => fs.readFileSync(path, 'utf-8');

  writeFileSync = (path: string, content: string) =>
    fs.writeFileSync(path, content, 'utf-8'); // use utf8 as default

  readdirSync = (path: string): string[] => fs.readdirSync(path);
  renameSync = (oldPath: string, newPath: string): void =>
    fs.renameSync(oldPath, newPath);
}
