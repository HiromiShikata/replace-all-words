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
      paramCase: jest.fn(),
    };

    replaceAllWords = new ReplaceAllWords(fileRepository, stringConvertor);
    jest.resetAllMocks();
  });

  test('run replaces all words in directories, files, and contents', async () => {
    const targetDirectoryPath = 'some/directory';
    const beforeWord = 'oldWord';
    const afterWord = 'newWord';
    const fileNames = ['oldFile', 'newFile'];
    const fileContent = 'This is some content with the oldWord in it.';

    (fileRepository.readdirSync as jest.Mock).mockReturnValue(fileNames);
    (fileRepository.lstatSync as jest.Mock).mockReturnValue({
      isDirectory: () => false,
    });
    (fileRepository.statSync as jest.Mock).mockReturnValue({
      isFile: () => true,
    });
    (fileRepository.readFileSync as jest.Mock).mockReturnValue(fileContent);
    (stringConvertor.camelCase as jest.Mock).mockImplementation(
      (word: string) => word,
    );

    await replaceAllWords.run(targetDirectoryPath, beforeWord, afterWord);

    expect(fileRepository.renameSync).toBeCalledTimes(fileNames.length);
    expect(fileRepository.writeFileSync).toBeCalledTimes(1);
  });

  describe('convert', () => {
    it.each`
      inputString                  | beforeWord | afterWord | expected
      ${'oldWord'}                 | ${'old'}   | ${'new'}  | ${'newWord'}
      ${'OldWord'}                 | ${'old'}   | ${'new'}  | ${'NewWord'}
      ${'old_word'}                | ${'old'}   | ${'new'}  | ${'new_word'}
      ${'OLD_WORD'}                | ${'old'}   | ${'new'}  | ${'NEW_WORD'}
      ${'old-word'}                | ${'old'}   | ${'new'}  | ${'new-word'}
      ${'MixedOldWord'}            | ${'old'}   | ${'new'}  | ${'MixedNewWord'}
      ${'Mixed_old_word'}          | ${'old'}   | ${'new'}  | ${'Mixed_new_word'}
      ${'MIXED_OLD_WORD'}          | ${'old'}   | ${'new'}  | ${'MIXED_NEW_WORD'}
      ${'Mixed-old-word'}          | ${'old'}   | ${'new'}  | ${'Mixed-new-word'}
      ${'oldWord oldWord'}         | ${'old'}   | ${'new'}  | ${'newWord newWord'}
      ${'OldWord OldWord'}         | ${'old'}   | ${'new'}  | ${'NewWord NewWord'}
      ${'old_word old_word'}       | ${'old'}   | ${'new'}  | ${'new_word new_word'}
      ${'OLD_WORD OLD_WORD'}       | ${'old'}   | ${'new'}  | ${'NEW_WORD NEW_WORD'}
      ${'old-word old-word'}       | ${'old'}   | ${'new'}  | ${'new-word new-word'}
      ${'MixedOldWord OldWord'}    | ${'old'}   | ${'new'}  | ${'MixedNewWord NewWord'}
      ${'Mixed_old_word old_word'} | ${'old'}   | ${'new'}  | ${'Mixed_new_word new_word'}
      ${'MIXED_OLD_WORD OLD_WORD'} | ${'old'}   | ${'new'}  | ${'MIXED_NEW_WORD NEW_WORD'}
      ${'Mixed-old-word old-word'} | ${'old'}   | ${'new'}  | ${'Mixed-new-word new-word'}
    `(
      'converts $inputString from $beforeWord to $afterWord, result should be $expected',
      ({
        inputString,
        beforeWord,
        afterWord,
        expected,
      }: {
        inputString: string;
        beforeWord: string;
        afterWord: string;
        expected: string;
      }) => {
        if (!stringConvertor) {
          throw new Error('stringConvertor is not defined');
        }

        (stringConvertor.camelCase as jest.Mock).mockImplementation(
          (word: string) => word,
        );
        (stringConvertor.snakeCase as jest.Mock).mockImplementation(
          (word: string) => word.toLowerCase(),
        );
        (stringConvertor.pascalCase as jest.Mock).mockImplementation(
          (word: string) => word[0].toUpperCase() + word.substr(1),
        );
        (stringConvertor.kebabCase as jest.Mock).mockImplementation(
          (word: string) => word.toLowerCase(),
        );
        (stringConvertor.screamSnakeCase as jest.Mock).mockImplementation(
          (word: string) => word.toUpperCase(),
        );

        const result = replaceAllWords.convert(
          inputString,
          beforeWord,
          afterWord,
        );

        expect(result).toEqual(expected);
      },
    );
    return {
      fileRepository,
      stringConvertor,
      useCase,
    };
  };
});
