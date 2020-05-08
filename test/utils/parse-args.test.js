const parseArgs = require('../../src/utils/parse-args');

const exitSpy = jest.spyOn(process, 'exit');

beforeEach(() => {
    jest.clearAllMocks();
});

test('it provide default options', () => {
    const program = parseArgs({
        argv: [
            'node',
            'react-intl-cli',
            'extract'
        ]
    });

    expect(program['output']).toBe('translations');
    expect(program['globPatterns']).toEqual(['**/*.js']);
    expect(program['ignorePattern']).toBe('**/node_modules/**');
    expect(program['locales']).toEqual(['en']);
    expect(program['defaultLocale']).toBe('en');
});

test('it exit with 0 on help', () => {
    exitSpy.mockImplementation(status => { throw Error(status) });

    const runHelp = () => parseArgs({
        argv: [
            'node',
            'react-intl-cli',
            'extract',
            '-h'
        ]
    });

    expect(runHelp).toThrowError();
    expect(exitSpy).toHaveBeenNthCalledWith(1, 0);
});

test('it exit with 1 on unknown props', () => {
    exitSpy.mockImplementation(status => { throw Error(status) });

    const runProgram = () => parseArgs({
        argv: [
            'node',
            'react-intl-cli',
            'extract',
            '--some-option'
        ]
    });

    expect(runProgram).toThrowError();
    expect(exitSpy).toHaveBeenNthCalledWith(1, 1);
});

test('it provide custom glob pattern', () => {
    const program = parseArgs({
        argv: [
            'node',
            'react-intl-cli',
            'extract',
            '**/*.jsx',
            '**/*.js'
        ]
    });

    expect(program['globPatterns']).toEqual(['**/*.jsx', '**/*.js']);
});
