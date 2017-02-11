'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('Backend for sending Bitbucket pipeine notifications to Facebook Messenger');
    }
});

server.start(err => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});
