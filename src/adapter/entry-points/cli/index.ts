#!/usr/bin/env node
import { Command } from 'commander';
import { ReplaceAllWords } from '../../../domain/usecases/ReplaceAllWords';
import { FsFileRepository } from '../../repositories/FsFileRepository';
import { ChangeCaseStringConvertor } from '../../repositories/ChangeCaseStringConvertor';

const program = new Command();
program
  .argument('<targetDirectoryPath>', 'Path to the target directory')
  .argument('<beforeWord>', 'Word to be replaced')
  .argument('<afterWord>', 'Word to replace with')
  .name('Replace all words')
  .description(
    'A CLI command to replace all occurrences of a word (oldWord) with another word (newWord) in TypeScript files within the specified target directory. The replacement is performed while preserving the original casing format of the words. For example, if the oldWord is in camelCase, the replaced word will also be in camelCase. Similarly, if the oldWord is in snake_case, the replaced word will be in snake_case.',
  )
  .action(
    async (
      targetDirectoryPath: string,
      beforeWord: string,
      afterWord: string,
    ) => {
      const useCase = new ReplaceAllWords(
        new FsFileRepository(),
        new ChangeCaseStringConvertor(),
      );
      const res = await useCase.run(targetDirectoryPath, beforeWord, afterWord);
      console.log(JSON.stringify(res));
      console.log(`✨🚀 Done 🚀✨`);
    },
  );
if (process.argv) {
  program.parse(process.argv);
}
