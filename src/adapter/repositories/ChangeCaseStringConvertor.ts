import { StringConvertor } from '../../domain/usecases/adapter-interfaces/StringConvertor';
import { camelCase, paramCase, pascalCase, snakeCase } from 'change-case-all';

export class ChangeCaseStringConvertor implements StringConvertor {
  camelCase = (str: string): string => {
    return camelCase(str);
  };

  snakeCase = (str: string): string => {
    return snakeCase(str);
  };

  pascalCase = (str: string): string => {
    return pascalCase(str);
  };

  kebabCase = (str: string): string => {
    return paramCase(str); // kebabCase is known as paramCase in change-case
  };

  screamSnakeCase = (str: string): string => {
    return snakeCase(str).toUpperCase();
  };

  convert = (str: string, beforeWord: string, afterWord: string): string => {
    if (str.includes(camelCase(beforeWord))) {
      return str.replace(camelCase(beforeWord), this.camelCase(afterWord));
    } else if (str.includes(snakeCase(beforeWord))) {
      return str.replace(snakeCase(beforeWord), this.snakeCase(afterWord));
    } else if (str.includes(pascalCase(beforeWord))) {
      return str.replace(pascalCase(beforeWord), this.pascalCase(afterWord));
    } else if (str.includes(paramCase(beforeWord))) {
      return str.replace(paramCase(beforeWord), this.kebabCase(afterWord));
    } else if (str.includes(this.screamSnakeCase(beforeWord))) {
      return str.replace(
        this.screamSnakeCase(beforeWord),
        this.screamSnakeCase(afterWord),
      );
    } else {
      return str;
    }
  };
}
