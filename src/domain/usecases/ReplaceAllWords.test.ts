import {FileRepository} from "./adapter-interfaces/FileRepository";
import {StringConvertor} from "./adapter-interfaces/StringConvertor";

export class ReplaceAllWords {
    constructor(
        private readonly fileRepository: FileRepository,
        private readonly stringConvertor:StringConvertor,
    ) {
    }
    run = async (
        targetDirectoryPath: string,
        beforeWord: string,
        afterWord: string,
    ): Promise<void> => {

    }
}
