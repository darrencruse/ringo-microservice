
/**
 * CommonJS module for deciding what environment we're 
 * running on.
 *
 * We deliver configuration settings for all environments,
 * and this module is used to side which of those should
 * be used for environment we're currently running on.
 *
 * This is a sample implementation, the real implementation 
 * is TBD (not sure what will work best under Amazon EC2).
 *
 * e.g. It may be determined e.g. by a command line arg
 * (this approach implemented below), or by looking at the
 * IP address or hostname of the current machine, etc.
 *
 * The environment names we expect are one of:
 *
 *     "localhost"
 *     "development"
 *     "certification"
 *     "production"
 * 
*/

importClass(java.lang.System);

var log = require('ringo/logging').getLogger(module.id);

exports.env = 'localhost';

var envProp = System.getProperty("env");
if(envProp !== null) {
	log.info("Setting environment from env system property: " + envProp);
	exports.env = envProp;
}
else {
	log.info("Using default environment: " + exports.env);
}

/**
 * Get the hostname of the current machine.
 */
exports.getHostName = function() {
	var addr = InetAddress.getLocalHost();
	return addr.getHostName();
}
