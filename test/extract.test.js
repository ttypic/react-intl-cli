const extract = require('../src/extract');

const glob = require('fast-glob');
jest.mock('fast-glob');

const fs = require('fs');
const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

writeFileSyncSpy.mockImplementation(jest.fn());
mkdirSyncSpy.mockImplementation(jest.fn());
readFileSyncSpy.mockImplementation(() => "{}");

const extractFromFile = require('../src/utils/extract-from-file');
jest.mock('../src/utils/extract-from-file');

beforeEach(() => {
    jest.clearAllMocks();
});

test('it saves result for each locale', () => {
    const config = {
        outputPath: 'translations',
        input: '**/*.js',
        appLocales: ['en', 'cz'],
        defaultLocale: 'en'
    };

    glob.mockReturnValue(Promise.resolve(['some-file.js']));
    extractFromFile.mockReturnValue([]);

    return extract(config).then(() => {
        expect(mkdirSyncSpy).toHaveBeenNthCalledWith(1, 'translations', { recursive: true });
        expect(writeFileSyncSpy).toHaveBeenCalledWith('translations/en.json', expect.anything());
        expect(writeFileSyncSpy).toHaveBeenCalledWith('translations/cz.json', expect.anything());
    });

});

test('it merge messages with existing', () => {
    const config = {
        outputPath: 'translations',
        input: '**/*.js',
        appLocales: ['en', 'cz'],
        defaultLocale: 'en'
    };

    glob.mockReturnValue(Promise.resolve(['some-file.js']));

    extractFromFile.mockReturnValue([
        { id: "some_id_1" },
        { id: "some_id_3", defaultMessage: 'some_default' }
    ]);

    readFileSyncSpy.mockImplementation(() => '{"some_id_1": "some_text", "some_id_2": "some_other_text"}');

    const expectedEn = '{\n  "some_id_1": "some_text",\n  "some_id_3": "some_default"\n}\n';
    const expectedCz = '{\n  "some_id_1": "some_text",\n  "some_id_3": ""\n}\n';

    return extract(config).then(() => {
        expect(writeFileSyncSpy).toHaveBeenCalledWith('translations/en.json', expectedEn);
        expect(writeFileSyncSpy).toHaveBeenCalledWith('translations/cz.json', expectedCz);
    });
});

test('it extract message for default locale even if defaultMessage is not set', () => {
    const config = {
        outputPath: 'translations',
        input: '**/*.js',
        appLocales: ['en', 'cz'],
        defaultLocale: 'en'
    };

    glob.mockReturnValue(Promise.resolve(['some-file.js']));

    extractFromFile.mockReturnValue([
        { id: "some_id_1" },
        { id: "some_id_3", defaultMessage: 'some_default' }
    ]);

    readFileSyncSpy.mockImplementation(() => '{"some_id_2": "some_other_text"}');

    const expectedEn = '{\n  "some_id_1": "",\n  "some_id_3": "some_default"\n}\n';
    const expectedCz = '{\n  "some_id_1": "",\n  "some_id_3": ""\n}\n';

    return extract(config).then(() => {
        expect(writeFileSyncSpy).toHaveBeenCalledWith('translations/en.json', expectedEn);
        expect(writeFileSyncSpy).toHaveBeenCalledWith('translations/cz.json', expectedCz);
    });
});
