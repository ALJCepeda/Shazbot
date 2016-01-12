global.ONLINE = (process.argv.indexOf('--online') !== -1) ? true : false;
global.DEV = (process.argv.indexOf('--dev') !== -1) ? true : false;

module.exports = {
	name: 'shazbot',
	port: (global.DEV === true) ? 8802 : 8002,
	dirs: {
		root: (global.ONLINE === true ) ? '/var/www/shazbot' : '/shared/shazbot',
		bower: '/shared/bower_components',
		shared: '/shared'
	},
	lib: {
		'requirejs.js' : 'require.js',
		'knockout.js' : 'dist/knockout.js',
		'underscore.js' : 'underscore-min.js'
	},
	libMap: {}
};