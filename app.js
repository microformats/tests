'use strict';
// This file create a small node server so 
// you view the files over http://localhost:3009/
// enter in commandline - $ node app
// Glenn Jones


var Hapi            = require('@hapi/hapi'),
    Inert           = require('@hapi/inert'),
    Good            = require('@hapi/good'),
    Blipp           = require('blipp'),
    Pack            = require('./package');
    
    
var routes = [{
	method: 'GET',
	path: '/{path*}',
	handler: {
		directory: {
			path: './tests',
			listing: true,
			index: false
		}
	}
},{
	method: 'GET',
	path: '/css/{path*}',
	handler: {
		directory: {
			path: './css',
			listing: true,
			index: true
		}
	}
},{
	method: 'GET',
	path: '/javascript/{path*}',
	handler: {
		directory: {
			path: './javascript',
			listing: true,
			index: true
		}
	}
}];    
    


// Create a server with a host and port
var server = Hapi.server({ 
    host: (process.env.PORT)? '0.0.0.0' : 'localhost', 
    port: parseInt(process.env.PORT, 10) || 3008
});


var goodOptions = {
    ops: { interval: 1000 },
    reporters: {
        console: [
            { module: '@hapi/good-squeeze', name: 'Squeeze', args: [{ log: '*', response: '*' }] },
            { module: '@hapi/good-console' },
            'stdout'
        ]
    }
};



// Register plug-ins and start
var init = async function () {
    await server.register([
        Inert,
        Blipp,
        { plugin: Good, options: goodOptions }
    ]);

    // hapi server settings
    server.route(routes);

    await server.start();
    console.info('Server started at ' + server.info.uri);
};

process.on('unhandledRejection', function (err) {
    console.error(err);
    process.exit(1);
});

init();
