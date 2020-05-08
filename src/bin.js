#!/usr/bin/env node

const extract = require('./extract');
const parseArgs = require('./utils/parse-args');

const { name, version } = require('../package.json');

const program = parseArgs({ name, version, argv: process.argv });

const config = {
    outputPath: program['output'],
    input: program['input'],
    appLocales: program['locales'],
    defaultLocale: program['defaultLocale']
};

extract(config).then(() => process.exit(0));
