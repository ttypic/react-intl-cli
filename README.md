# React-Intl CLI for your React App

[![test](https://img.shields.io/github/workflow/status/ttypic/react-intl-cli/Test?label=tests&style=flat-square)](https://github.com/ttypic/react-intl-cli/actions)
[![coverage-status](https://img.shields.io/codecov/c/github/ttypic/react-intl-cli.svg?style=flat-square)](https://codecov.io/gh/ttypic/react-intl-cli)
[![npm](https://img.shields.io/npm/v/react-intl-cli.svg?style=flat-square)](https://www.npmjs.com/package/react-intl-cli)
[![npm-downloads](https://img.shields.io/npm/dt/react-intl-cli.svg?style=flat-square)](https://www.npmjs.com/package/react-intl-cli)
[![npm-downloads](https://img.shields.io/npm/dw/react-intl-cli.svg?style=flat-square)](https://www.npmjs.com/package/react-intl-cli)

`react-intl-cli` - command line tools for manipulating 
[react-intl](https://formatjs.io/docs/react-intl/) message catalogues. 

## Installation

You can install `react-intl-cli` globally or locally.

### Global Installation

Using npm:

```shell script
npm install --global react-intl-cli
```

Using yarn:

```shell script
yarn global add react-intl-cli
```

### Local Installation

Install package using npm or yarn:

```shell script
npm install --save-dev react-intl-cli
```

Add script to your `package.json` file:

```json
{
  "scripts": {
    "extract-translations": "react-intl-cli extract"
  }
}
```

## Usage

For now `react-intl-cli` provides the only `extarct` command.

### Extract command

Extracts messages from source files and creates a message catalog for each language.

If you install `react-intl-cli` globally you could run it in your command line:

```shell script
react-intl-cli extract
```

or with custom options:

```shell script
react-intl-cli extract [option] [glob-patterns...]
```

to show available options run help:

```shell script
react-intl-cli extract -h
```

If you install locally just run:

```shell script
npm run extract-translations
``` 

## License

This package is licensed under MIT license.
