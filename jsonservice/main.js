
// Make sure to find modules here:
require.paths.unshift(".", "./middleware");

// Set up application
var {Application} = require("stick");
var settings = require("settings");

var app = exports.app = Application();
app.configure("notfound", "error", "jsonerror", "static", "params", "mount");
//app.configure("ipauthenticate","notfound", "error", "jsonerror", "static", "params", "mount");
app.static(module.resolve("public"));
app.mount("/jsonservice/api/person", require("person"));

if(app.ipauthenticate) {
	app.ipauthenticate.authorized = settings.get("ipsAuthorized");
}

// export init(), start(), stop(), destroy() functions to get called
// on daemon life-cycle events

// Script to run app from command line
if (require.main === module) {
    require("ringo/httpserver").main(module.directory);
}
