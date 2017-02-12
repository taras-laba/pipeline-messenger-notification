'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || '';

const receivedMessage = event => {
    console.log('message data: ', event);
};

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('Backend for sending Bitbucket pipeline notifications to Facebook Messenger');
    }
});

server.route({
    method: 'GET',
    path: '/webhook',
    handler: (request, reply) => {
        if (request.query['hub.mode'] === 'subscribe'
            && request.query['hub.verify_token'] === VERIFY_TOKEN) {
            reply(request.query['hub.challenge']).code(200);
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
    handler: (request, reply) => {
        const data = request.body;

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

server.start(err => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});
