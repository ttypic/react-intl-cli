const fs = require('fs');
const glob = require('fast-glob');

const extractFromFile = require('./utils/extract-from-file');
const { createProgressLogger, fetchExistingTranslations } = require('./utils/extract-helpers');

// Progress Logger
const task = createProgressLogger();

const extractFromFileAndMerge = async (filename, { appLocales, defaultLocale, localeMappings, oldLocaleMappings }) => {
    const messages = await extractFromFile(filename);

    for (const message of messages) {
        for (const locale of appLocales) {
            const oldLocaleMapping = oldLocaleMappings[locale][message.id];
            // Merge old translations into the babel extracted instances where react-intl is used
            const newMsg = locale === defaultLocale ? message.defaultMessage : '';
            localeMappings[locale][message.id] = oldLocaleMapping || newMsg;
        }
    }
};

const saveResults = ({ appLocales, outputPath, localeMappings }) => {
    try {
        // Make the directory if it doesn't exist, especially for first run
        fs.mkdirSync(`${outputPath}`, { recursive: true });
    } catch (error) {
        process.stderr.write(`There was an error creating output dir: ${outputPath}\n`);
        process.stderr.write(`${error}\n`);
    }

    let localeTaskDone;
    let translationFileName;

    for (const locale of appLocales) {
        translationFileName = `${outputPath}/${locale}.json`;
        localeTaskDone = task(
            `Writing translation messages for ${locale} to: ${translationFileName}`,
        );

        // Sort the translation JSON file so that git diffing is easier
        // Otherwise the translation messages will jump around every time we extract
        const messages = {};
        Object.keys(localeMappings[locale])
            .sort()
            .forEach(key => {
                messages[key] = localeMappings[locale][key];
            });

        // Write to file the JSON representation of the translation messages
        const prettified = `${JSON.stringify(messages, null, 2)}\n`;

        try {
            fs.writeFileSync(translationFileName, prettified);
            localeTaskDone();
        } catch (error) {
            localeTaskDone(
                `There was an error saving this translation file: ${translationFileName}\n${error}`,
            );
        }
    }
};

const extract = async ({ appLocales, defaultLocale, outputPath, input }) => {
    // Store existing translations into memory
    const { oldLocaleMappings, localeMappings } = fetchExistingTranslations({ appLocales, outputPath });

    const context = { appLocales, defaultLocale, localeMappings, oldLocaleMappings };

    const memoryTaskDone = task('Storing language files in memory');
    const files = await glob(input);

    memoryTaskDone();

    const extractTaskDone = task('Run extraction on all files');

    await Promise.all(
        files.map(fileName => extractFromFileAndMerge(fileName, context)),
    );

    extractTaskDone();

    saveResults({ appLocales, outputPath, localeMappings });
};

module.exports = extract;
