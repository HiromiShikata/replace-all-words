# replace-all-words

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/HiromiShikata/replace-all-words/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/HiromiShikata/replace-all-words/tree/main)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Usage

```
Usage: Replace all words [options] <targetDirectoryPath> <beforeWord> <afterWord>

A CLI command to replace all occurrences of a word (oldWord) with another word (newWord) in
TypeScript files within the specified target directory. The replacement is performed while
preserving the original casing format of the words. For example, if the oldWord is in camelCase,
the replaced word will also be in camelCase. Similarly, if the oldWord is in snake_case, the
replaced word will be in snake_case.

Arguments:
  targetDirectoryPath  Path to the target directory
  beforeWord           Word to be replaced
  afterWord            Word to replace with

Options:

```

## Example

```
npx replace-all-words ./src/ oldWord newWord
```
