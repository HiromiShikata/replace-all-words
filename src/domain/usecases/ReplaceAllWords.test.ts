import { ReplaceAllWords } from './ReplaceAllWords';
import { FileRepository } from './adapter-interfaces/FileRepository';
import { StringConvertor } from './adapter-interfaces/StringConvertor';
type Mocked<T> = jest.Mocked<T> & jest.MockedObject<T>;

describe('ReplaceAllWords', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('run replaces all words in directories, files, and contents', async () => {
    const files = ['oldFile1.txt', 'oldFile2.txt', 'oldDir'];
    const oldContent = `This is an old content with the old word.`;

    const { useCase, fileRepository } = createUseCaseAndMockRepositories();

    fileRepository.readdirSync.mockReturnValue(files);
    fileRepository.lstatSync.mockImplementation((dirPath) => ({
      isDirectory: () => dirPath === 'oldDir',
    }));
    fileRepository.statSync.mockReturnValue({
      isFile: () => true,
    });
    fileRepository.readFileSync.mockReturnValue(oldContent);

    await useCase.run('targetDirectory', 'old', 'new');

    expect(fileRepository.readdirSync).toBeCalledWith('targetDirectory');
    expect(fileRepository.lstatSync).toBeCalledTimes(files.length);
    expect(fileRepository.readFileSync.mock.calls).toEqual([
      ['targetDirectory/newFile1.txt', 'utf-8'],
      ['targetDirectory/newFile2.txt', 'utf-8'],
      ['targetDirectory/newDir', 'utf-8'],
    ]);
    expect(fileRepository.writeFileSync.mock.calls).toEqual([
      [
        'targetDirectory/newFile1.txt',
        'This is an new content with the new word.',
        'utf-8',
      ],
      [
        'targetDirectory/newFile2.txt',
        'This is an new content with the new word.',
        'utf-8',
      ],
      [
        'targetDirectory/newDir',
        'This is an new content with the new word.',
        'utf-8',
      ],
    ]);

    expect(fileRepository.renameSync.mock.calls).toEqual([
      ['targetDirectory/oldFile1.txt', 'targetDirectory/newFile1.txt'],
      ['targetDirectory/oldFile2.txt', 'targetDirectory/newFile2.txt'],
      ['targetDirectory/oldDir', 'targetDirectory/newDir'],
    ]);
  });

  const createUseCaseAndMockRepositories = () => {
    const fileRepository: Mocked<FileRepository> = {
      readdirSync: jest.fn(),
      renameSync: jest.fn(),
      lstatSync: jest.fn(),
      statSync: jest.fn(),
      readFileSync: jest.fn(),
      writeFileSync: jest.fn(),
    };

    const stringConvertor: Mocked<StringConvertor> = {
      camelCase: jest.fn(),
      snakeCase: jest.fn(),
      pascalCase: jest.fn(),
      kebabCase: jest.fn(),
      paramCase: jest.fn(),
      screamSnakeCase: jest.fn(),
    };

    const useCase: ReplaceAllWords = new ReplaceAllWords(
      fileRepository,
      stringConvertor,
    );
    return {
      fileRepository,
      stringConvertor,
      useCase,
    };
  };
});
