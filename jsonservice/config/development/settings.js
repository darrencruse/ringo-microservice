
// Configuration specific to this environment:
// (variables not listed below are taken from the defaults)
var config = {
	dbUrl: 'jdbc:mysql://localhost:3306',
	ipsAuthorized: '127.0.0.1'
}

/**
 * Get the specified setting, otherwise return the
 * passed in default value (or undefined if no
 * default value is given).
 *
 * @param name the name of the setting.
 * @param defaultval the value to return if no such setting
 * @returns the setting's value (otherwise undefined)
 */
exports.get = function(name, defaultval) {
	var val = config[name];

	if(typeof val === 'undefined') {
		val = defaultval;
	}

	return val;
}
