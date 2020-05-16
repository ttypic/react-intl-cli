const extractFromFile = require('../../src/utils/extract-from-file');

const fs = require('fs');
const readFileSpy = jest.spyOn(fs, 'readFile');

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
});

test('it provide empty output on file without messages', () => {
    readFileSpy.mockImplementation((filename, encoding, callback) => callback(undefined, ''));

    return extractFromFile('some-file.js').then(messages => expect(messages).toStrictEqual([]));
});

test('it extract messages', () => {
    const fileWithMessagesContent = `
        import React, { Component } from 'react';
        import { defineMessages } from 'react-intl';
        
        export const msgs = defineMessages({
          header: {
            id: 'foo.bar',
            defaultMessage: 'Hello World!'
          },
          content: {
            id: 'foo.foo',
            defaultMessage: 'Hi World!',
            description: 'Another message'
          }
        });
    `;

    readFileSpy.mockImplementation((filename, encoding, callback) => callback(undefined, fileWithMessagesContent));

    return extractFromFile('some-file.js').then(messages =>
        expect(messages).toEqual([
            {
                id: 'foo.bar',
                defaultMessage: 'Hello World!'
            },
            {
                id: 'foo.foo',
                defaultMessage: 'Hi World!',
                description: 'Another message'
            }
        ])
    );
});

test('it extract messages with macros', () => {
    const fileWithMessagesContent = `
        import React, { Component } from 'react';
        import defineMessages from 'define-messages.macro';
        
        defineMessages.setupPrefix('foo');
        
        export const msgs = defineMessages({
          header: 'Hello World!',
          content: {
            defaultMessage: 'Hi World!',
            description: 'Another message'
          }
        });
    `;

    readFileSpy.mockImplementation((filename, encoding, callback) => callback(undefined, fileWithMessagesContent));

    return extractFromFile('some-file.js').then(messages =>
        expect(messages).toEqual([
            {
                id: 'foo.header',
                defaultMessage: 'Hello World!'
            },
            {
                id: 'foo.content',
                defaultMessage: 'Hi World!',
                description: 'Another message'
            }
        ])
    );
});
