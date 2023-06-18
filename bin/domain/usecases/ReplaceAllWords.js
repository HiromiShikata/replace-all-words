"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceAllWords = void 0;
const path = __importStar(require("path"));
const change_case_all_1 = require("change-case-all");
class ReplaceAllWords {
    constructor(fileRepository, stringConvertor) {
        this.fileRepository = fileRepository;
        this.stringConvertor = stringConvertor;
        this.run = async (targetDirectoryPath, beforeWord, afterWord) => {
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
                    const newContent = this.replaceWordInContent(content, beforeWord, afterWord);
                    if (content !== newContent) {
                        this.fileRepository.writeFileSync(filePath, newContent, 'utf-8');
                    }
                }
            }
        };
        this.replaceWordInPath = (path, beforeWord, afterWord) => {
            const parts = path.split('/');
            const lastPart = parts[parts.length - 1];
            const newLastPart = this.convert(lastPart, beforeWord, afterWord);
            parts[parts.length - 1] = newLastPart;
            return parts.join('/');
        };
        this.replaceWordInContent = (content, beforeWord, afterWord) => {
            return this.convert(content, beforeWord, afterWord);
        };
        this.convert = (str, beforeWord, afterWord) => {
            let result = str;
            if (result.includes(this.stringConvertor.camelCase(beforeWord))) {
                result = result.replace(new RegExp(this.stringConvertor.camelCase(beforeWord), 'g'), this.stringConvertor.camelCase(afterWord));
            }
            if (result.includes(this.stringConvertor.snakeCase(beforeWord))) {
                result = result.replace(new RegExp(this.stringConvertor.snakeCase(beforeWord), 'g'), this.stringConvertor.snakeCase(afterWord));
            }
            if (result.includes(this.stringConvertor.pascalCase(beforeWord))) {
                result = result.replace(new RegExp(this.stringConvertor.pascalCase(beforeWord), 'g'), this.stringConvertor.pascalCase(afterWord));
            }
            if (result.includes((0, change_case_all_1.paramCase)(beforeWord))) {
                result = result.replace(new RegExp((0, change_case_all_1.paramCase)(beforeWord), 'g'), this.stringConvertor.kebabCase(afterWord));
            }
            if (result.includes(this.stringConvertor.screamSnakeCase(beforeWord))) {
                result = result.replace(new RegExp(this.stringConvertor.screamSnakeCase(beforeWord), 'g'), this.stringConvertor.screamSnakeCase(afterWord));
            }
            return result;
        };
    }
}
exports.ReplaceAllWords = ReplaceAllWords;
//# sourceMappingURL=ReplaceAllWords.js.map