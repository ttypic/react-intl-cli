const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

/**
 * Adds mark check symbol
 */
function addCheckMark(callback) {
    process.stdout.write(chalk.green(' ✓'));
    if (callback) callback();
}

/**
 * Adds an animated progress indicator
 *
 * @param  {string} message          The message to write next to the indicator
 * @param  {number} [amountOfDots=3] The amount of dots you want to animate
 */
function animateProgress(message, amountOfDots = 3) {
    let i = 0;
    return setInterval(() => {
        readline.cursorTo(process.stdout, 0);
        i = (i + 1) % (amountOfDots + 1);
        const dots = new Array(i + 1).join('.');
        process.stdout.write(message + dots);
    }, 500);
}

const newLine = () => process.stdout.write('\n');

const createProgressLogger  = () => {
    let progress;

    return message => {
        progress = animateProgress(message);
        process.stdout.write(message);

        return error => {
            if (error) {
                process.stderr.write(error);
            }
            clearTimeout(progress);
            return addCheckMark(() => newLine());
        };
    };
};

const fetchExistingTranslations = ({ appLocales, outputPath }) => {
    const prevLocaleMappings = {};

    // Loop to run once per locale
    for (const locale of appLocales) {
        prevLocaleMappings[locale] = {};
        // File to store translation messages into
        const translationFileName = `${outputPath}/${locale}.json`;
        try {
            // Parse the old translation message JSON files
            const messages = JSON.parse(fs.readFileSync(translationFileName, 'utf8'));
            const messageKeys = Object.keys(messages);
            for (const messageKey of messageKeys) {
                prevLocaleMappings[locale][messageKey] = messages[messageKey];
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                process.stderr.write(`There was an error loading this translation file: ${translationFileName}\n`);
                process.stderr.write(`${error}\n`);
            }
        }
    }

    return prevLocaleMappings;
};

module.exports = { fetchExistingTranslations, createProgressLogger };
