export interface FileRepository {
  readdirSync: (path: string) => string[];
  renameSync: (oldPath: string, newPath: string) => void;
  lstatSync: (path: string) => { isDirectory: () => boolean };
  statSync: (path: string) => { isFile: () => boolean };
  readFileSync: (path: string, encoding: string) => string;
  writeFileSync: (path: string, content: string, encoding: string) => void;
}
