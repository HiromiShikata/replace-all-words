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
    const oldContent = 'This is an old content with the old word.';
    const newContent = 'This is a new content with the new word.';

    const { useCase, fileRepository, stringConvertor } =
      createUseCaseAndMockRepositories();

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
    expect(fileRepository.readFileSync).toBeCalledWith(
      'targetDirectory/oldFile1.txt',
      'utf-8',
    );
    expect(fileRepository.writeFileSync).toBeCalledWith(
      'targetDirectory/newFile1.txt',
      newContent,
      'utf-8',
    );

    expect(fileRepository.renameSync).toBeCalledTimes(files.length);
    expect(fileRepository.renameSync).toBeCalledWith(
      'targetDirectory/oldFile1.txt',
      'targetDirectory/newFile1.txt',
    );
    expect(fileRepository.renameSync).toBeCalledWith(
      'targetDirectory/oldFile2.txt',
      'targetDirectory/newFile2.txt',
    );
    expect(fileRepository.renameSync).toBeCalledWith(
      'targetDirectory/oldDir',
      'targetDirectory/newDir',
    );
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
