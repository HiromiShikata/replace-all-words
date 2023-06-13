import { FileRepository } from './adapter-interfaces/FileRepository';
import { StringConvertor } from './adapter-interfaces/StringConvertor';
import * as path from 'path';
import { paramCase } from 'change-case-all';

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

    // First, change all directory names.
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
    if (str.includes(this.stringConvertor.camelCase(beforeWord))) {
      return str.replace(
        this.stringConvertor.camelCase(beforeWord),
        this.stringConvertor.camelCase(afterWord),
      );
    } else if (str.includes(this.stringConvertor.snakeCase(beforeWord))) {
      return str.replace(
        this.stringConvertor.snakeCase(beforeWord),
        this.stringConvertor.snakeCase(afterWord),
      );
    } else if (str.includes(this.stringConvertor.pascalCase(beforeWord))) {
      return str.replace(
        this.stringConvertor.pascalCase(beforeWord),
        this.stringConvertor.pascalCase(afterWord),
      );
    } else if (str.includes(paramCase(beforeWord))) {
      return str.replace(
        paramCase(beforeWord),
        this.stringConvertor.kebabCase(afterWord),
      );
    } else if (str.includes(this.stringConvertor.screamSnakeCase(beforeWord))) {
      return str.replace(
        this.stringConvertor.screamSnakeCase(beforeWord),
        this.stringConvertor.screamSnakeCase(afterWord),
      );
    } else {
      return str;
    }
  };
}
