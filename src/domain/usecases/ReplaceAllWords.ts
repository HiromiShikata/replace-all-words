import { FileRepository } from './adapter-interfaces/FileRepository';
import { StringConvertor } from './adapter-interfaces/StringConvertor';
import * as path from 'path';
import * as crypto from 'crypto';

export class ReplaceAllWords {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly stringConvertor: StringConvertor,
  ) {}

  run = async (
    targetDirectoryPath: string,
    beforeWord: string,
    afterWord: string,
  ): Promise<void> => {
    const files = this.fileRepository.readdirSync(targetDirectoryPath);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const oldPath = path.join(targetDirectoryPath, file);
      const newPath = this.replaceWordInPath(oldPath, beforeWord, afterWord);

      if (oldPath !== newPath) {
        this.fileRepository.renameSync(oldPath, newPath);
        files[i] = path.basename(newPath);
      }

      if (this.fileRepository.lstatSync(newPath).isDirectory()) {
        await this.run(newPath, beforeWord, afterWord);
      }
    }

    // Next, change all file names.
    for (let file of files) {
      const oldPath = path.join(targetDirectoryPath, file);
      const newPath = this.replaceWordInPath(oldPath, beforeWord, afterWord);

      if (oldPath !== newPath) {
        this.fileRepository.renameSync(oldPath, newPath);
        file = path.basename(newPath);
      }
    }

    // Lastly, change all file contents.
    for (const file of files) {
      const filePath = path.join(targetDirectoryPath, file);

      if (this.fileRepository.statSync(filePath).isFile()) {
        const content = this.fileRepository.readFileSync(filePath, 'utf-8');
        const newContent = this.replaceWordInContent(
          content,
          beforeWord,
          afterWord,
        );

        if (content !== newContent) {
          this.fileRepository.writeFileSync(filePath, newContent, 'utf-8');
        }
      }
    }
  };

  replaceWordInPath = (
    path: string,
    beforeWord: string,
    afterWord: string,
  ): string => {
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    const newLastPart = this.convert(lastPart, beforeWord, afterWord);
    parts[parts.length - 1] = newLastPart;
    return parts.join('/');
  };

  replaceWordInContent = (
    content: string,
    beforeWord: string,
    afterWord: string,
  ): string => {
    return this.convert(content, beforeWord, afterWord);
  };
  convert = (str: string, beforeWord: string, afterWord: string): string => {
    const uniqueMarker = (word: string, index: number): string => {
      const hash = crypto
        .createHash('sha256')
        .update(word + index.toString())
        .digest('hex');
      return `__${hash}__`;
    };
    const cases: ((arg0: string) => string)[] = [
      (input: string) => this.stringConvertor.camelCase(input),
      (input: string) => this.stringConvertor.snakeCase(input),
      (input: string) => this.stringConvertor.pascalCase(input),
      (input: string) => this.stringConvertor.paramCase(input),
      (input: string) => this.stringConvertor.kebabCase(input),
      (input: string) => this.stringConvertor.screamSnakeCase(input),
    ];

    let result = str;
    cases.forEach((convertor, index: number) => {
      const before = convertor(beforeWord);
      const after = uniqueMarker(afterWord, index);
      result = result.replace(new RegExp(before, 'g'), after);
    });
    cases.forEach((convertor, index: number) => {
      const maker = uniqueMarker(afterWord, index);
      const after = convertor(afterWord);
      result = result.replace(new RegExp(maker, 'g'), after);
    });

    result = result.replace(new RegExp(beforeWord, 'g'), afterWord);

    return result;
  };
}
