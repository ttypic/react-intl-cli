const commander = require('commander');

const parseArgs = ({ name, version, argv }) => {
    const program = new commander.Command(name);

    program.version(version, '-v, --version');

    program.usage('<cli-command> [options]').action(command => {
        if (command !== 'extract') {
            commander.help();
        }
    });

    const extract = program
        .command('extract [glob-patterns...]')
        .option(
            '-o, --output <output-dir>',
            'the target location where the program will output a `{locale}.json` for each locale.',
            'translations'
        )
        .option('--ignore-pattern <glob-pattern>', 'input glob pattern', '**/node_modules/**')
        .option('-l, --locales <comma-separated-names>', 'comma-separated locales', val => val.split(','), ['en'])
        .option('-d, --default-locale <locale>', 'default locale', 'en');

    let globPatterns = ['**/*.[jt]s?(x)'];

    extract.action(patterns => {
        if (!!patterns.length) {
            globPatterns = patterns;
        }
    });

    program.parse(argv);

    return { ...extract.opts(), globPatterns };
};

module.exports = parseArgs;
