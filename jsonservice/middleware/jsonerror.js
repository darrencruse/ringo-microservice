/**
 * @fileOverview Middleware to allow downstream code to
 * simply throw json error objects knowing that those
 * will propogate to the client as the http response if
 * no intervening code handles the problem.
 *
 * Note:  Currently this middleware handles only "standard"
 *   error objects (e.g. json objects with "error: true").
 *   In the future this should be enhanced to also handle
 *   404 not found, 500 internal server errors, etc. to 
 *   to ensure the client is *guaranteed* to get only json
 *   responses and *never* an html error page response.
 *
 * @author dcruse
 */

var jsv = require("JSV").JSV;
var errorschema = require("schemas").get("error");
var Response = require("ringo/jsgi/response");
var log = require("ringo/logging").getLogger("jsonerror");

// Requiring errorutil ensures anybody using the jsonerror
// middleware also gets e.g. Response.jsonError().
var errorutil = require("./errorutil");

/**
 * Stick middleware to format (thrown) errors as 
 * standard JSON error response.
 *
 * @param {Function} next the wrapped middleware chain
 * @param {Object} app the Stick Application object
 * @returns {Function} a JSGI middleware function
 */
 
exports.middleware = function jsonerror(next, app) {

	return function jsonerror(request) {
		try {
			// add "request.body" for use by downstream code...
			patchRequest(request);

			return next(request);

		} catch(e if e.schema == "error") {

			// caught an error json object

			// let's make sure we only send schema-valid reponses:
			var env = jsv.createEnvironment();
			var validation = env.validate(e.content, errorschema);
			if(validation.errors.length !== 0) {
				// log the error to help us correct such problems
				// (yet we do send the error to the client - it's
				// better than nothing!)
				log.error("Caught a thrown json error " + e.content.type +
					" that does not conform to our error schema!");
			}

			log.error("Response from caught error: " + JSON.stringify(e));
			var httpStatus = (e.httpStatus) ? e.httpStatus : 500;

			// httpStatus is simply a way for the thrower of the error
			// object to convey what http status code should be sent
			// the client (it's not an *actual* part of our response 
			// json payloads)			
			delete e.httpStatus;
			
			var res = new Response.json(e);
			res.status = httpStatus;
		
			return(res);
		}
	}

};

/**
 * Patch the request with an easy way to read the posted body.
 * This doesn't really (logically) belong in jsonerror, at
 * the moment it's just the most convenient place...
 */
function patchRequest(request) {

	Object.defineProperty(request, "body", {
		get: function() {
			var servletRequest = request.env.servletRequest;
			var bod = servletRequest.getParameter("http.body");
			if(bod == null) {
				var encoding = servletRequest.getCharacterEncoding() || "utf8";
				var input = request.input.read();
				bod = input.decodeToString(encoding);
			}
			return bod;
		}
	});
}
