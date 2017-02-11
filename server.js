'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('Backend for sending Bitbucket pipeline notifications to Facebook Messenger');
    }
});

server.start(err => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});
