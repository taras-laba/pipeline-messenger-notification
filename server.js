'use strict';

const Hapi = require('hapi');
const request = require('request');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || '';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || '';

const receivedMessage = event => {
    console.log('message data: ', event);
};

const sendMessage = (userId, text) => {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: {
                id: userId
            },
            message: {
                text
            }
        }
    }, (err, res, body) => {
        if (err) {
            console.log(err);
        } else {
            console.log('successfully sent message');
        }
    });
};

server.route({
    method: 'GET',
    path: '/',
    handler: (req, reply) => {
        reply('Backend for sending Bitbucket pipeline notifications to Facebook Messenger');
    }
});

server.route({
    method: 'GET',
    path: '/webhook',
    handler: (req, reply) => {
        if (req.query['hub.mode'] === 'subscribe'
            && req.query['hub.verify_token'] === VERIFY_TOKEN) {
            reply(req.query['hub.challenge']).code(200);
            console.log('validating webhook');
        } else {
            reply().code(403);
            console.error('failed validation; make sure validation tokens match');
        }
    }
});

server.route({
    method: 'POST',
    path: '/webhook',
    handler: (req, reply) => {
        const data = req.payload;

        if (data.object === 'page') {
            data.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    if (event.message) {
                        receivedMessage(event);
                    } else {
                        console.log('webhook received unknown event ', event);
                    }
                });
            });

            reply().code(200);
        }
    }
});

server.route({
    method: 'POST',
    path: '/pipeline/webhook/{id}',
    handler: (req, reply) => {
        const eventKey = req.headers['X-Event-Key'];
        if (eventKey && eventKey === 'repo:commit_status_updated') {
            const data = req.payload;
            const id = req.params.id;
            sendMessage(id, data.commit_status.state);
        }

        reply().code(200);
    }
});

server.start(err => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});
