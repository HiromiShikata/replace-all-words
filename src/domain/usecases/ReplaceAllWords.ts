import { FileRepository } from './adapter-interfaces/FileRepository';
import { StringConvertor } from './adapter-interfaces/StringConvertor';
import * as path from 'path';

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
    let result = str;

    if (result.includes(this.stringConvertor.camelCase(beforeWord))) {
      result = result.replace(
        new RegExp(this.stringConvertor.camelCase(beforeWord), 'g'),
        this.stringConvertor.camelCase(afterWord),
      );
    }

    if (result.includes(this.stringConvertor.snakeCase(beforeWord))) {
      result = result.replace(
        new RegExp(this.stringConvertor.snakeCase(beforeWord), 'g'),
        this.stringConvertor.snakeCase(afterWord),
      );
    }

    if (result.includes(this.stringConvertor.pascalCase(beforeWord))) {
      result = result.replace(
        new RegExp(this.stringConvertor.pascalCase(beforeWord), 'g'),
        this.stringConvertor.pascalCase(afterWord),
      );
    }

    if (result.includes(this.stringConvertor.paramCase(beforeWord))) {
      result = result.replace(
        new RegExp(this.stringConvertor.paramCase(beforeWord), 'g'),
        this.stringConvertor.kebabCase(afterWord),
      );
    }

    if (result.includes(this.stringConvertor.screamSnakeCase(beforeWord))) {
      result = result.replace(
        new RegExp(this.stringConvertor.screamSnakeCase(beforeWord), 'g'),
        this.stringConvertor.screamSnakeCase(afterWord),
      );
    }

    return result;
  };
}
