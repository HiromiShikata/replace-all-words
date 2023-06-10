export interface FileRepository {

    readdirSync: (path: string) => string[];
    renameSync: (oldPath: string, newPath: string) => void;
    readFileSync: (path: string, encoding: string) => string;
}
