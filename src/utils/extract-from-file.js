const fs = require('fs');
const { transform } = require('@babel/core');

const babel = {
    presets: [
        require('babel-preset-react-app')
    ],
    plugins: [
        require('babel-plugin-react-intl')
    ]
};

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
    return messages || []
};

const readFile = fileName =>
    new Promise((resolve, reject) => {
        fs.readFile(
            fileName,
            'utf8',
            (error, value) => (error ? reject(error) : resolve(value)),
        );
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

        const output = await transform(code, { filename, ...babel });

        return getMessagesOrEmptyList(output);

    } catch (error) {
        process.stderr.write(`Error transforming file: ${filename}\n`);
        process.stderr.write(`${error}\n`);

        return [];
    }
};

module.exports = extractFromFile;
