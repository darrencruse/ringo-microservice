/**
 * @fileoverview JSGI middleware for HTTP method override.
 *
 * This is really an Elsevier copy of the Stick "method" middleware, 
 * except that middleware only allowed override of the method on a 
 * POST, but we typically use the override to test our services from 
 * a browser with a GET.  This copy contains a mod to only allow the 
 * override for a GET.
 *
 * Original version description:
 *
 * Since browsers
 * are not able to send HTTP requests with methods other than `GET`
 * and `POST`, this middleware allows the method of `POST` requests to be
 * overridden based on the value of a HTTP form parameter. The default
 * name for the override parameter is `_method`. This can be configured
 * through the `overridemethod.key` property.
 * @example
 * app.configure("overridemethod");
 * app.overridemethod.key = "__method"; 
 */

/**
 * JSGI middleware for HTTP method override.
 * @param {Function} next the wrapped middleware chain
 * @param {Object} app the Stick Application object
 * @returns {Function} a JSGI middleware function

 */
exports.middleware = function overridemethod(next, app) {

    app.overridemethod = {
        key: "_method"
    };

    return function overridemethod(req) {
        if (req.method === "GET") {
            if (!req.params) {
                throw new Error("overridemethod middleware requires params middleware");
            }
			var key = app.overridemethod.key;
			if (req.params[key]) {
				req.method = req.params[key].toUpperCase();
			}
		}
        return next(req);
    }
};