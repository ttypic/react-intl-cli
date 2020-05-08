# React-Intl CLI for your React App

`react-intl-cli` - command line tools for manipulating 
[react-intl](https://formatjs.io/docs/react-intl/) message catalogues. 

## Installation

You could install `react-intl-cli` global or local.

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

Using npm:

```shell script
npm install -D react-intl-cli
```

Using yarn:

```shell script
yarn add -D react-intl-cli
```

and add script to your `package.json` file:

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
