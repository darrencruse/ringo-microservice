var Response = require('ringo/jsgi/response');
var errorutil = require('../errorutil');
var log = require("ringo/logging").getLogger(module.id);

/**
 * Stick middleware for authenticating that a request comes from a configured IP.
 * @param {Function} next the wrapped middleware chain
 * @param {Object} app the Stick Application object
 * @returns {Function} a JSGI middleware function
 */
exports.middleware = function ipauthenticate(next, app) {

	var authorizeAll = '*.*.*.*';
	var authorizeNone = 'x.x.x.x';

	// the chain should be configured with the IPs to allow
	// using the below (no IPs are authorized by default):

	app.ipauthenticate = {
		authorized: authorizeNone,
		forwardedFor: undefined // (or 'HTTP_X_FORWARDED_FOR')
	};

	return function ipauthenticate(request) {

		if(app.ipauthenticate.authorized !== authorizeAll) {

			var authenticated = false;

			if(app.ipauthenticate.authorized !== authorizeNone) {

				authenticated = isAuthenticated(request.env.servletRequest,
												app.ipauthenticate.authorized,
												app.ipauthenticate.forwardedFor);

			}

			if(!authenticated) {
				var res = new Response.json(errorutil.jsonError(
											'unauthorized_requestor',
											'Not Authorized'));
				res.status = 403; 
				return(res);			
			}
		}

		// IP was okay... let the middleware chain continue:
		return next(request);

    };
};

function isAuthenticated(request, authIpList, xForwardForName){
	
	log.debug("Allowed IP(s): " + authIpList);
	if(!authIpList) {
		return false;
	}
	var remoteAddr = request.getRemoteAddr();
	log.debug("Requesting RemoteAddr: " + remoteAddr);
	if(typeof xForwardForName !== 'undefined') {
		log.debug("Requesting X-FORWARDED-FOR: " + xForwardForName);
	}

	var ipAddress = getClientIp(request, xForwardForName);
	log.debug("Client IP Address: " + ipAddress);

	return isIpIncluded(authIpList, ipAddress);
}

/**
 * This method checks if a given ip is in the list if ip address strings.
 * <i> IP addresses string is supports following format</i>
 * <p>
 * 111.*,111.222.222.111,111.222.222.*,111.222.222.111-111.222.222.200
 * </p>
 * <p>
 * Does not process ip segments of this format 111.*-112.*
 * </p>
 */
function isIpIncluded(ipList, ip) {

	if (typeof ip === 'undefined' || ip === null || ip === "") {
		log.debug("Could not determine the requestor's IP - blocking access");
		return false;
	}

	if (ipList.indexOf(ip) > -1) {
		return true;
	}
	var ips = ipList.split(",");
	if (ips.length > 0) {
		// there is more than one ip in the string
		for (var i = 0; i < ips.length; i++) {
			var ipSegment = ips[i];
			// * is not acceptable.
			var result = false;
			if(ipSegment.indexOf("*") > 1) {
				result = isIpInStaredStr(ipSegment, ip);
			} else if (ipSegment.indexOf("-") > 1) {
				result = isIpInRangeStr(ipSegment, ip);
			}
			if (result) {
				// found match, return true;
				return result;
			} // else continue searching.
		}
	}
	return false;
}

/**
 * <p>
 * Takes a string of the following formats and checks if a given ip falls in
 * the range.
 * </p>
 * <ul>
 * <li>111.*</li>
 * <li>111.222.*</li>
 * <li>111.222.123.*</li>
 * <li>111.222.*.123</li>
 * </ul>
 * 
 * @param ipList
 * @param ip
 * @return
 */
function isIpInStaredStr(ipList, ip) {
	var grps = ipList.split(".");
	var newIp = "";
	var grpsDest = ip.split(".");
	for (var i = 0; i < grps.length; i++) {
		if (i > 0) {
			newIp += ".";
		}
		if (grps[i].indexOf("*") > -1) {
			newIp += "*";
		} else {
			newIp += grpsDest[i];
		}
	}
	return (ipList.indexOf(newIp) > -1);
}

/**
 * Takes a ip address string in the following format and checks if a give ip
 * address falls in the range.
 * <ul>
 * <li>111.222.123.22-111.222.123.42</li>
 * </ul>
 * 
 * @param ipList
 * @param ip
 * @return
 */
function isIpInRangeStr(ipList, ip) {
	var grps = ipList.split("-");
	var leftRange = grps[0];
	var rightRange = grps[1];
	if(isIpInStaredStr(leftRange, ip)) {
		return true;
	}
	if (isIpInStaredStr(rightRange, ip)) {
		return true;
	}
	var leftIPNum = ipAddrToNum(leftRange);
	var rightIPNum = ipAddrToNum(rightRange);
	var destIpNum = ipAddrToNum(ip);
	if((destIpNum >= leftIPNum) && (destIpNum <= rightIPNum)) {
		return true;
	}
	return false;
}

/**
 * Converts an ip addr into a number
 * 
 * @param ipAddr
 * @return
 */
function ipAddrToNum(ipAddr) {
	var addr = ipAddr.split(".");
	var ip_number = 0;
	for(var i = 0; i < addr.length; i++) {
		ip_number *= 256;
		ip_number += (addr[i] + 0);
	}
	return ip_number;
}

function getClientIp(request, forwardFor){
	
	var ip = null;
	if(typeof forwardFor !== 'undefined') {
		ip = request.getHeader(forwardFor);
	}
	if(typeof ip !== 'undefined' && ip != null && ip !== "") {
		return ip;
	}
	ip = request.getRemoteAddr();
	
	if (typeof ip !== 'undefined' && ip != null && ip !== "") {
		return ip;
	}
	return null;
}	
