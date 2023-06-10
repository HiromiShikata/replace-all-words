import { ChangeCaseStringConvertor } from "./ChangeCaseStringConvertor";

describe('ChangeCaseStringConvertor', () => {
    let convertor: ChangeCaseStringConvertor;

    beforeEach(() => {
        convertor = new ChangeCaseStringConvertor();
    });

    test.each`
        method              | expected
        ${'camelCase'}      | ${'testString'}
        ${'snakeCase'}      | ${'test_string'}
        ${'pascalCase'}     | ${'TestString'}
        ${'kebabCase'}      | ${'test-string'}
        ${'screamSnakeCase'}| ${'TEST_STRING'}
    `('should convert to $method', ({method, expected}) => {
        if(method !== 'convert') {
            const result = convertor[method as keyof ChangeCaseStringConvertor]('Test String');
            expect(result).toBe(expected);
        }
    });

    test.each`
        beforeWord    | afterWord        | expected
        ${'testString'} | ${'convertedString'} | ${'Hello, thisIsA_convertedString'}
        ${'notPresent'} | ${'convertedString'} | ${'Hello, thisIsA_testString'}
    `('should convert a string', ({beforeWord, afterWord, expected}) => {
        const result = convertor.convert('Hello, thisIsA_testString', beforeWord, afterWord);
        expect(result).toBe(expected);
    });
});
