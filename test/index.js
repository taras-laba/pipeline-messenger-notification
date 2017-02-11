'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it } = lab;
const { expect } = require('code');

describe('index', () => {
    it('passes', done => {
        expect(1 + 1).to.be.equal(2);
        done();
    });
});
