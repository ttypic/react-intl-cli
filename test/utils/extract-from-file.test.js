const extractFromFile = require('../../src/utils/extract-from-file');

const fs = require('fs');
const readFileSpy = jest.spyOn(fs, 'readFile');

beforeEach(() => {
    jest.clearAllMocks();
});

test('it provide empty output on file without messages', () => {
    readFileSpy.mockImplementation((filename, encoding, callback) => callback(undefined, ''));

    return extractFromFile('some-file.js').then(messages => expect(messages).toStrictEqual([]));
});

test('it extract messages', () => {
    process.env.NODE_ENV = 'development';

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
