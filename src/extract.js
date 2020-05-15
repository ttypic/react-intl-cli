const fs = require('fs');
const glob = require('fast-glob');

const extractFromFile = require('./utils/extract-from-file');
const { createProgressLogger, fetchExistingTranslations } = require('./utils/extract-helpers');

// Progress Logger
const task = createProgressLogger();

/**
 * Save locale messages to `outputPath`. Create `outputPath` folder if it doesn't exist
 *
 * @param   {String[]} appLocales       List of locales
 * @param   {String} outputPath         Output path
 * @param   {Object} localeMappings     Locale to messages dictionary
 */
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
        localeTaskDone = task(`Writing translation messages for ${locale} to: ${translationFileName}`);

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
            localeTaskDone(`There was an error saving this translation file: ${translationFileName}\n${error}`);
        }
    }
};

const calculateNextMessageText = ({ message, oldLocaleMappings, locale, defaultLocale }) => {
    const oldLocaleMapping = oldLocaleMappings[locale][message.id];
    const defaultMessage = message.defaultMessage || '';
    // Merge old translations into the babel extracted instances where react-intl is used
    const messageText = locale === defaultLocale ? defaultMessage : '';

    return oldLocaleMapping || messageText;
};

/**
 * Extract messages from specified files
 *
 * @param   {String[]} files              List of filenames to extract messages from
 * @param   {Object} prevLocaleMappings   Previous locale to messages dictionary
 * @param   {String[]} appLocales         List of locales
 * @param   {String} defaultLocale        Default locale
 *
 * @return  {Promise<Object>}   next locale to messages dictionary
 */
const extractMessages = async ({ files, prevLocaleMappings, appLocales, defaultLocale }) => {
    const localeToMessages = {};

    appLocales.forEach(locale => (localeToMessages[locale] = {}));

    await Promise.all(
        files.map(async filename => {
            const messages = await extractFromFile(filename);

            for (const message of messages) {
                for (const locale of appLocales) {
                    localeToMessages[locale][message.id] = calculateNextMessageText({
                        oldLocaleMappings: prevLocaleMappings,
                        message,
                        locale,
                        defaultLocale
                    });
                }
            }
        })
    );

    return localeToMessages;
};

/**
 * Extract messages from files matched specified `globPatterns`
 *
 * @param   {String[]} appLocales       List of app locales
 * @param   {String} defaultLocale      Default locale
 * @param   {String} outputPath         Output path where messages will be saved
 * @param   {String} ignorePattern      Optional ignore pattern
 * @param   {String[]} globPatterns     List of glob patterns
 */
const extract = async ({ appLocales, defaultLocale, outputPath, ignorePattern, globPatterns }) => {
    // Store existing translations into memory
    const prevLocaleMappings = fetchExistingTranslations({ appLocales, outputPath });

    const memoryTaskDone = task('Storing language files in memory');

    const ignorePatterns = ignorePattern ? [ignorePattern] : [];
    const files = await glob(globPatterns, { ignore: ignorePatterns });

    memoryTaskDone();

    const extractTaskDone = task('Run extraction on all files');

    const nextLocaleMappings = await extractMessages({ files, prevLocaleMappings, appLocales, defaultLocale });

    extractTaskDone();

    saveResults({ appLocales, outputPath, localeMappings: nextLocaleMappings });
};

module.exports = extract;
