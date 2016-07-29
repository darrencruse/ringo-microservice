/**
* A module containing all the json schemas for ACM.
*
* You fetch a schema by name via the "get" function.
*/

var schemas = {

	// Our standard error response json:
	error: {
		"type": "object",
		"properties": {
			"type": {
				"type": "string",
				"required": true
			},
			"message": {
				"type": "string",
				"required": true
			},
			"detail": {
				"type": "any"
			}
		}
	},

	// The json for setting/retrieving a person
	// (this is only a sample - can go away for a real app)
	person: {
		"type": "object",
		"properties": {
			"value": {
				"type": "string",
				"required": true
			}
		}
	}
}

/**
 * Get a specified schema by name.
 *
 * Note:  The get function might be enhanced to
 *        find versioned schemas, different schemas
 *        per environment, etc. in the future.
 *
 * @param name the name of the schema.
 * @returns the specified schema (otherwise undefined)
 */
exports.get = function(name, defaultval) {

	return schemas[name];

}
