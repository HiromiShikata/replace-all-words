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

    // First, change all directory names.
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const oldPath = path.join(targetDirectoryPath, file);
      const newPath = this.replaceWordInPath(oldPath, beforeWord, afterWord);

      if (oldPath !== newPath) {
        this.fileRepository.renameSync(oldPath, newPath);
        file = path.basename(newPath);
      }

      if (fs.lstatSync(newPath).isDirectory()) {
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

      if (fs.lstatSync(filePath).isFile()) {
        const content = this.fileRepository.readFileSync(filePath, 'utf-8');
        const newContent = this.replaceWordInContent(
          content,
          beforeWord,
          afterWord,
        );

        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf-8');
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
    const newLastPart = this.stringConvertor.convert(
      lastPart,
      beforeWord,
      afterWord,
    );
    parts[parts.length - 1] = newLastPart;
    return parts.join('/');
  };

  replaceWordInContent = (
    content: string,
    beforeWord: string,
    afterWord: string,
  ): string => {
    return this.stringConvertor.convert(content, beforeWord, afterWord);
  };
}
