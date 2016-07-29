
// Get the name of the current environment:
var env = require('./environment').env;

// Load overrides appropriate for that environment:
var overrides = require('./config/' + env + '/settings');

// The default settings for variables not overridden:
var defaults = {
	dbClass: 'com.mysql.jdbc.Driver',
	dbUser: 'root',
	dbPasswd: ''
}

/**
 * Get the specified setting appropriate for the
 * current environment, otherwise returned the
 * passed in default value (or undefined if no 
 * default value is given).
 *
 * @param name the name of the setting.
 * @param defaultval the value to return if no such setting
 * @returns the setting's value (otherwise undefined)
 */
exports.get = function(name, defaultval) {
	var val;

	if(typeof overrides !== 'undefined') {
		val = overrides.get(name);
	}

	if(typeof val === 'undefined') {
		val = defaults[name];
	}

	if(typeof val === 'undefined') {
		val = defaultval;
	}

	return val;
}

/**
* Get multiple settings at once as an array of their values.
*
* @param arr an array of the same things you can pass to get().
* @returns an array of the results of calling get()
*/
exports.getArray = function(arr) {
	var result = [];

	for(var i=0; i < arr.length; i++) {
		var callSpec = arr[i];
		if(typeof callSpec !== 'Array') {
			callSpec = [ callSpec ];
		}

		results.push(exports.get.apply(exports,callSpec));
	}

	return results;
}