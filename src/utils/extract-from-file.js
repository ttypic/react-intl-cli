const fs = require('fs');
const { transform } = require('@babel/core');

/**
 * Gets the value at `'metadata.react-intl.messages'` of object.
 * If the resolved value is undefined, empty list is returned in its place.
 *
 * @param   {Object} obj    The object to query.
 *
 * @return  {Array} Returns the resolved value.
 */
const getMessagesOrEmptyList = obj => {
    const messages = obj && obj.metadata && obj.metadata['react-intl'] && obj.metadata['react-intl'].messages;
    return messages || [];
};

const readFile = fileName =>
    new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (error, value) => (error ? reject(error) : resolve(value)));
    });

/**
 * Extract React-Intl messages from file
 *
 * @param   {String} filename    File to extract
 *
 * @return  {Array} Returns extracted messages
 */
const extractFromFile = async filename => {
    try {
        const code = await readFile(filename);

        const preCompiledConfig = { presets: [require('babel-preset-react-app')] };
        const reactIntlConfig = { plugins: [require('babel-plugin-react-intl')] };

        const { code: preCompiledCode } = await transform(code, { filename, ...preCompiledConfig });

        const output = await transform(preCompiledCode, { filename, ...reactIntlConfig });

        return getMessagesOrEmptyList(output);
    } catch (error) {
        process.stderr.write(`Error transforming file: ${filename}\n`);
        process.stderr.write(`${error}\n`);

        return [];
    }
};

module.exports = extractFromFile;
