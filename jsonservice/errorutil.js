/**
 * @fileOverview Some helper/utility functions for handling errors
 *               in the standard json error format.
 *
 * @author dcruse
 */
importClass(java.util.UUID);
 
 
var {Application} = require("stick");
var log = require('ringo/logging').getLogger(module.id);
var Response = require('ringo/jsgi/response');

/**
 * Build a single error according to Evolve's standardized JSON 
 * response format.
 * @param {String} the type of error e.g. "invalid_field"
 * @param {String} the error message
 * @param {Integer} [optional] http status code (if error goes back to the client)
 * @param {Object} [optional] details about the error
 * @returns {Object} a JSON Object
 */
exports.jsonError = function(type, message, httpStatus, detail) {
	var err = {
			type: type,
			message: message
    };
	if(detail) {
		err.detail = detail;
	}
	
	var wrapped = wrapResponseInEnvelope("error", err);

	if(httpStatus) {
		wrapped.httpStatus = httpStatus;
	}
	
	log.error("Returning json error: " + JSON.stringify(wrapped));
	return(wrapped);
};

/**
 * Build a single error according to Evolve's standardized JSON 
 * response format.
 * @param {String} the type of error e.g. "invalid_field"
 * @param {String} the error message
 * @param {Integer} [optional] http status code (if error goes back to the client)
 * @param {Object} [optional] details about the error
 * @returns {Object} a JSON Object
 */
exports.jsonResponse = function(type, message, httpStatus, detail) {

	// note we don't pass httpStatus into the json error payload
	// (we don't want the client to get http status in the payload)
	var json = exports.jsonError(type, message, undefined, detail);
	log.debug("Returning with error: " + JSON.stringify(json));
	var response = new Response.json(json);
	response.status = (httpStatus) ? httpStatus : 500;
	return(response);
};

// Monkey patch Response with an alias for jsonResponse that
// feels a little more like our error json was built in.
Response.jsonError = exports.jsonResponse;

/**
 * All responses are wrapped in an envelope that 
 * includes:
 *    the schema name so a client knows what type of response they've gotten
 *    a unique id so e.g. client logs and server-side logs can be correlated.
 */
function wrapResponseInEnvelope(schemaName, content) {
	return { 
		schema: schemaName, 
		responseId: UUID.randomUUID().toString(),
		content: content
	};
}