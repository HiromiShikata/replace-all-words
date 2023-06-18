#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ReplaceAllWords_1 = require("../../../domain/usecases/ReplaceAllWords");
const FsFileRepository_1 = require("../../repositories/FsFileRepository");
const ChangeCaseStringConvertor_1 = require("../../repositories/ChangeCaseStringConvertor");
const program = new commander_1.Command();
program
    .argument('<targetDirectoryPath>', 'Path to the target directory')
    .argument('<beforeWord>', 'Word to be replaced')
    .argument('<afterWord>', 'Word to replace with')
    .name('Replace all words')
    .description('A CLI command to replace all occurrences of a word (oldWord) with another word (newWord) in TypeScript files within the specified target directory. The replacement is performed while preserving the original casing format of the words. For example, if the oldWord is in camelCase, the replaced word will also be in camelCase. Similarly, if the oldWord is in snake_case, the replaced word will be in snake_case.')
    .action(async (targetDirectoryPath, beforeWord, afterWord) => {
    const useCase = new ReplaceAllWords_1.ReplaceAllWords(new FsFileRepository_1.FsFileRepository(), new ChangeCaseStringConvertor_1.ChangeCaseStringConvertor());
    const res = await useCase.run(targetDirectoryPath, beforeWord, afterWord);
    console.log(JSON.stringify(res));
    console.log(`✨🚀 Done 🚀✨`);
});
if (process.argv) {
    program.parse(process.argv);
}
//# sourceMappingURL=index.js.map