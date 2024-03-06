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

  test('run replaces all words in directories, files, and contents', async () => {
    const targetDirectoryPath = 'some/directory';
    const beforeWord = 'oldWord';
    const afterWord = 'newWord';
    const fileNames = ['oldWordFile', 'newWordFile'];
    const fileContent = 'This is some content with the oldWord in it.';
    const { fileRepository, stringConvertor, useCase } =
      createUseCaseAndMockRepositories();

    fileRepository.readdirSync.mockReturnValue(fileNames);
    fileRepository.lstatSync.mockReturnValue({ isDirectory: () => false });
    fileRepository.statSync.mockReturnValue({ isFile: () => true });
    fileRepository.readFileSync.mockReturnValue(fileContent);
    stringConvertor.camelCase.mockImplementation((word: string) => word);

    await useCase.run(targetDirectoryPath, beforeWord, afterWord);

    expect(fileRepository.renameSync.mock.calls).toEqual([
      ['some/directory/oldWordFile', 'some/directory/newWordFile'],
    ]);
    expect(fileRepository.writeFileSync.mock.calls).toEqual([
      [
        'some/directory/newWordFile',
        'This is some content with the newWord in it.',
        'utf-8',
      ],
      [
        'some/directory/newWordFile',
        'This is some content with the newWord in it.',
        'utf-8',
      ],
    ]);
  });

  describe('convert', () => {
    it.each`
      inputString                     | beforeWord | afterWord    | expected
      ${'oldWord'}                    | ${'old'}   | ${'new'}     | ${'newWord'}
      ${'OldWord'}                    | ${'old'}   | ${'new'}     | ${'NewWord'}
      ${'old_word'}                   | ${'old'}   | ${'new'}     | ${'new_word'}
      ${'OLD_WORD'}                   | ${'old'}   | ${'new'}     | ${'NEW_WORD'}
      ${'old-word'}                   | ${'old'}   | ${'new'}     | ${'new-word'}
      ${'MixedOldWord'}               | ${'old'}   | ${'new'}     | ${'MixedNewWord'}
      ${'Mixed_old_word'}             | ${'old'}   | ${'new'}     | ${'Mixed_new_word'}
      ${'MIXED_OLD_WORD'}             | ${'old'}   | ${'new'}     | ${'MIXED_NEW_WORD'}
      ${'Mixed-old-word'}             | ${'old'}   | ${'new'}     | ${'Mixed-new-word'}
      ${'oldWord oldWord'}            | ${'old'}   | ${'new'}     | ${'newWord newWord'}
      ${'OldWord OldWord'}            | ${'old'}   | ${'new'}     | ${'NewWord NewWord'}
      ${'old_word old_word'}          | ${'old'}   | ${'new'}     | ${'new_word new_word'}
      ${'OLD_WORD OLD_WORD'}          | ${'old'}   | ${'new'}     | ${'NEW_WORD NEW_WORD'}
      ${'old-word old-word'}          | ${'old'}   | ${'new'}     | ${'new-word new-word'}
      ${'MixedOldWord OldWord'}       | ${'old'}   | ${'new'}     | ${'MixedNewWord NewWord'}
      ${'Mixed_old_word old_word'}    | ${'old'}   | ${'new'}     | ${'Mixed_new_word new_word'}
      ${'MIXED_OLD_WORD OLD_WORD'}    | ${'old'}   | ${'new'}     | ${'MIXED_NEW_WORD NEW_WORD'}
      ${'Mixed-old-word old-word'}    | ${'old'}   | ${'new'}     | ${'Mixed-new-word new-word'}
      ${'Includes-old-word old-word'} | ${'old'}   | ${'old-new'} | ${'Includes-old-new-word old-new-word'}
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
        const { useCase } = createUseCaseAndMockRepositories();
        const result = useCase.convert(inputString, beforeWord, afterWord);

        expect(result).toEqual(expected);
      },
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

    jest.resetAllMocks();
    stringConvertor.camelCase.mockImplementation((word: string) => word);
    stringConvertor.snakeCase.mockImplementation((word: string) =>
      word.toLowerCase(),
    );
    stringConvertor.pascalCase.mockImplementation(
      (word: string) => word[0].toUpperCase() + word.substr(1),
    );
    stringConvertor.paramCase.mockImplementation((word: string) =>
      word.toLowerCase(),
    );
    stringConvertor.kebabCase.mockImplementation((word: string) =>
      word.toLowerCase(),
    );
    stringConvertor.screamSnakeCase.mockImplementation((word: string) =>
      word.toUpperCase(),
    );
    const useCase = new ReplaceAllWords(fileRepository, stringConvertor);
    return {
      fileRepository,
      stringConvertor,
      useCase,
    };
  };
});
