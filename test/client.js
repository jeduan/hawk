'use strict';

// Load modules

const Code = require('code');
const Hawk = require('../lib');
const Lab = require('lab');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.test;
const expect = Code.expect;


describe('Client', () => {

    describe('header()', () => {

        it('returns a valid authorization header (sha1)', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const header = Hawk.client.header('http://example.net/somewhere/over/the/rainbow', 'POST', { credentials: credentials, ext: 'Bazinga!', timestamp: 1353809207, nonce: 'Ygvqdz', payload: 'something to write about' }).field;
            expect(header).to.equal('Hawk id="123456", ts="1353809207", nonce="Ygvqdz", hash="bsvY3IfUllw6V5rvk4tStEvpBhE=", ext="Bazinga!", mac="qbf1ZPG/r/e06F4ht+T77LXi5vw="');
            done();
        });

        it('returns a valid authorization header (sha256)', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', { credentials: credentials, ext: 'Bazinga!', timestamp: 1353809207, nonce: 'Ygvqdz', payload: 'something to write about', contentType: 'text/plain' }).field;
            expect(header).to.equal('Hawk id="123456", ts="1353809207", nonce="Ygvqdz", hash="2QfCt3GuY9HQnHWyWD3wX68ZOKbynqlfYmuO2ZBRqtY=", ext="Bazinga!", mac="q1CwFoSHzPZSkbIvl0oYlD+91rBUEvFk763nMjMndj8="');
            done();
        });

        it('returns a valid authorization header (no ext)', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', { credentials: credentials, timestamp: 1353809207, nonce: 'Ygvqdz', payload: 'something to write about', contentType: 'text/plain' }).field;
            expect(header).to.equal('Hawk id="123456", ts="1353809207", nonce="Ygvqdz", hash="2QfCt3GuY9HQnHWyWD3wX68ZOKbynqlfYmuO2ZBRqtY=", mac="HTgtd0jPI6E4izx8e4OHdO36q00xFCU0FolNq3RiCYs="');
            done();
        });

        it('returns a valid authorization header (null ext)', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', { credentials: credentials, timestamp: 1353809207, nonce: 'Ygvqdz', payload: 'something to write about', contentType: 'text/plain', ext: null }).field;
            expect(header).to.equal('Hawk id="123456", ts="1353809207", nonce="Ygvqdz", hash="2QfCt3GuY9HQnHWyWD3wX68ZOKbynqlfYmuO2ZBRqtY=", mac="HTgtd0jPI6E4izx8e4OHdO36q00xFCU0FolNq3RiCYs="');
            done();
        });

        it('returns a valid authorization header (empty payload)', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', { credentials: credentials, timestamp: 1353809207, nonce: 'Ygvqdz', payload: '', contentType: 'text/plain' }).field;
            expect(header).to.equal('Hawk id=\"123456\", ts=\"1353809207\", nonce=\"Ygvqdz\", hash=\"q/t+NNAkQZNlq/aAD6PlexImwQTxwgT2MahfTa9XRLA=\", mac=\"U5k16YEzn3UnBHKeBzsDXn067Gu3R4YaY6xOt9PYRZM=\"');
            done();
        });

        it('returns a valid authorization header (pre hashed payload)', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            const options = { credentials: credentials, timestamp: 1353809207, nonce: 'Ygvqdz', payload: 'something to write about', contentType: 'text/plain' };
            options.hash = Hawk.crypto.calculatePayloadHash(options.payload, credentials.algorithm, options.contentType);
            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', options).field;
            expect(header).to.equal('Hawk id="123456", ts="1353809207", nonce="Ygvqdz", hash="2QfCt3GuY9HQnHWyWD3wX68ZOKbynqlfYmuO2ZBRqtY=", mac="HTgtd0jPI6E4izx8e4OHdO36q00xFCU0FolNq3RiCYs="');
            done();
        });

        it('errors on missing uri', (done) => {

            const header = Hawk.client.header('', 'POST');
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Invalid argument type');
            done();
        });

        it('errors on invalid uri', (done) => {

            const header = Hawk.client.header(4, 'POST');
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Invalid argument type');
            done();
        });

        it('errors on missing method', (done) => {

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', '');
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Invalid argument type');
            done();
        });

        it('errors on invalid method', (done) => {

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 5);
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Invalid argument type');
            done();
        });

        it('errors on missing options', (done) => {

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST');
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Invalid argument type');
            done();
        });

        it('errors on invalid credentials (id)', (done) => {

            const credentials = {
                key: '2983d45yun89q',
                algorithm: 'sha256'
            };

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', { credentials: credentials, ext: 'Bazinga!', timestamp: 1353809207 });
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Invalid credential object');
            done();
        });

        it('errors on missing credentials', (done) => {

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', { ext: 'Bazinga!', timestamp: 1353809207 });
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Invalid credential object');
            done();
        });

        it('errors on invalid credentials', (done) => {

            const credentials = {
                id: '123456',
                algorithm: 'sha256'
            };

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', { credentials: credentials, ext: 'Bazinga!', timestamp: 1353809207 });
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Invalid credential object');
            done();
        });

        it('errors on invalid algorithm', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'hmac-sha-0'
            };

            const header = Hawk.client.header('https://example.net/somewhere/over/the/rainbow', 'POST', { credentials: credentials, payload: 'something, anything!', ext: 'Bazinga!', timestamp: 1353809207 });
            expect(header.field).to.equal('');
            expect(header.err).to.equal('Unknown algorithm');
            done();
        });
    });

    describe('authenticate()', () => {

        it('returns false on invalid header', (done) => {

            const res = {
                headers: {
                    'server-authorization': 'Hawk mac="abc", bad="xyz"'
                }
            };

            expect(Hawk.client.authenticate(res, {})).to.equal(false);
            done();
        });

        it('returns false on invalid mac', (done) => {

            const res = {
                headers: {
                    'content-type': 'text/plain',
                    'server-authorization': 'Hawk mac="_IJRsMl/4oL+nn+vKoeVZPdCHXB4yJkNnBbTbHFZUYE=", hash="f9cDF/TDm7TkYRLnGwRMfeDzT6LixQVLvrIKhh0vgmM=", ext="response-specific"'
                }
            };

            const artifacts = {
                method: 'POST',
                host: 'example.com',
                port: '8080',
                resource: '/resource/4?filter=a',
                ts: '1362336900',
                nonce: 'eb5S_L',
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                ext: 'some-app-data',
                app: undefined,
                dlg: undefined,
                mac: 'BlmSe8K+pbKIb6YsZCnt4E1GrYvY1AaYayNR82dGpIk=',
                id: '123456'
            };

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                user: 'steve'
            };

            expect(Hawk.client.authenticate(res, credentials, artifacts)).to.equal(false);
            done();
        });

        it('returns true on ignoring hash', (done) => {

            const res = {
                headers: {
                    'content-type': 'text/plain',
                    'server-authorization': 'Hawk mac="XIJRsMl/4oL+nn+vKoeVZPdCHXB4yJkNnBbTbHFZUYE=", hash="f9cDF/TDm7TkYRLnGwRMfeDzT6LixQVLvrIKhh0vgmM=", ext="response-specific"'
                }
            };

            const artifacts = {
                method: 'POST',
                host: 'example.com',
                port: '8080',
                resource: '/resource/4?filter=a',
                ts: '1362336900',
                nonce: 'eb5S_L',
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                ext: 'some-app-data',
                app: undefined,
                dlg: undefined,
                mac: 'BlmSe8K+pbKIb6YsZCnt4E1GrYvY1AaYayNR82dGpIk=',
                id: '123456'
            };

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                user: 'steve'
            };

            expect(Hawk.client.authenticate(res, credentials, artifacts)).to.equal(true);
            done();
        });

        it('fails on invalid WWW-Authenticate header format', (done) => {

            const header = 'Hawk ts="1362346425875", tsm="PhwayS28vtnn3qbv0mqRBYSXebN/zggEtucfeZ620Zo=", x="Stale timestamp"';
            expect(Hawk.client.authenticate({ headers: { 'www-authenticate': header } }, {})).to.equal(false);
            done();
        });

        it('fails on invalid WWW-Authenticate header format', (done) => {

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                user: 'steve'
            };

            const header = 'Hawk ts="1362346425875", tsm="hwayS28vtnn3qbv0mqRBYSXebN/zggEtucfeZ620Zo=", error="Stale timestamp"';
            expect(Hawk.client.authenticate({ headers: { 'www-authenticate': header } }, credentials)).to.equal(false);
            done();
        });

        it('skips tsm validation when missing ts', (done) => {

            const header = 'Hawk error="Stale timestamp"';
            expect(Hawk.client.authenticate({ headers: { 'www-authenticate': header } }, {})).to.equal(true);
            done();
        });
    });

    describe('message()', () => {

        it('generates authorization', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message('example.com', 80, 'I am the boodyman', { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.exist();
            expect(auth.ts).to.equal(1353809207);
            expect(auth.nonce).to.equal('abc123');
            done();
        });

        it('errors on invalid host', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message(5, 80, 'I am the boodyman', { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.not.exist();
            done();
        });

        it('errors on invalid port', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message('example.com', '80', 'I am the boodyman', { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.not.exist();
            done();
        });

        it('errors on missing host', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message('example.com', 0, 'I am the boodyman', { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.not.exist();
            done();
        });

        it('errors on null message', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message('example.com', 80, null, { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.not.exist();
            done();
        });

        it('errors on missing message', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message('example.com', 80, undefined, { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.not.exist();
            done();
        });

        it('errors on invalid message', (done) => {

            const credentials = {
                id: '123456',
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message('example.com', 80, 5, { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.not.exist();
            done();
        });

        it('errors on missing options', (done) => {

            const auth = Hawk.client.message('example.com', 80, 'I am the boodyman');
            expect(auth).to.not.exist();
            done();
        });

        it('errors on invalid credentials (id)', (done) => {

            const credentials = {
                key: '2983d45yun89q',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message('example.com', 80, 'I am the boodyman', { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.not.exist();
            done();
        });

        it('errors on invalid credentials (key)', (done) => {

            const credentials = {
                id: '123456',
                algorithm: 'sha1'
            };

            const auth = Hawk.client.message('example.com', 80, 'I am the boodyman', { credentials: credentials, timestamp: 1353809207, nonce: 'abc123' });
            expect(auth).to.not.exist();
            done();
        });
    });
});
