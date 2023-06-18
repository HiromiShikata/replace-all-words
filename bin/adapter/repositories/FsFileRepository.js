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
exports.FsFileRepository = void 0;
const fs = __importStar(require("fs"));
class FsFileRepository {
    constructor() {
        this.lstatSync = (path) => fs.lstatSync(path);
        this.statSync = (path) => fs.statSync(path);
        this.readFileSync = (path) => fs.readFileSync(path, 'utf-8');
        this.writeFileSync = (path, content) => fs.writeFileSync(path, content, 'utf-8'); // use utf8 as default
        this.readdirSync = (path) => fs.readdirSync(path);
        this.renameSync = (oldPath, newPath) => fs.renameSync(oldPath, newPath);
    }
}
exports.FsFileRepository = FsFileRepository;
//# sourceMappingURL=FsFileRepository.js.map