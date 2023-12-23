# replace-all-words 🔄

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/HiromiShikata/replace-all-words/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/HiromiShikata/replace-all-words/tree/main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Welcome to replace-all-words, your trusty command-line tool for seamless word replacements across your entire project, irrespective of the programming language used! Whether you're refactoring or renaming files, this tool significantly cuts down your time spent on manual replacements. 🚀

## Usage 🛠️

Here's how you can use replace-all-words:

```
Usage: Replace all words [options] <targetDirectoryPath> <beforeWord> <afterWord>

Arguments:
  targetDirectoryPath  Path to the target directory where replacements are to be made
  beforeWord           Word to be replaced throughout the target directory
  afterWord            Word to replace the beforeWord with

Options:

```

replace-all-words finds and replaces all occurrences of a word (`beforeWord`) with another word (`afterWord`) in the files within the specified target directory. The unique thing is that it preserves the original casing format of the words. So, if your `beforeWord` is in camelCase, the replaced `afterWord` will also be in camelCase. Similarly, if the `beforeWord` is in snake_case, the replaced `afterWord` will be in snake_case. 🐍

This comes in super handy while:

1. **Refactoring your code:** When you need to change a variable or function name across multiple files, use replace-all-words to do it in a snap!

2. **Renaming files:** If your project's naming conventions have changed, replace-all-words helps you adapt quickly and consistently.

## Example 📖

Here's a quick example to illustrate its usage:

```
npx replace-all-words ./src/ oldWord newWord
```

In the above command, `replace-all-words` will traverse through all the files in the `./src/` directory, replacing every instance of `oldWord` with `newWord`, while preserving the casing style. 💼

We hope replace-all-words makes your coding life a bit easier! Feel free to contribute and make it even better. 🙌

Happy coding! 💻🎉
