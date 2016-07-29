// Sample JSON services for "person"
// We assume there's a TEST.PERSON table with columns NAME and VALUE 

var {Application} = require("stick");
var Response = require('ringo/jsgi/response');
var db = require('sql-ringojs-client');
var jsv = require('JSV').JSV;
var settings = require('settings');
var errorutil = require('../errorutil');
var personschema = require("schemas").get("person");
var log = require("ringo/logging").getLogger(module.id);

export("app");

var app = Application();
app.configure("params", "overridemethod", "route", "render");
app.overridemethod.key = "http.method";
app.render.base = module.resolve("templates");
app.render.master = "page.html"; // "fragment.html";

app.get("/test.html", function(request) {

	var conn = dbConnection();

	var persons = dbQuery(conn, 'select * from test.person').map(
		function(rs) {
			return { name: rs.name, value: rs.value };
		}
	);

	var context = {title: "It's working!", persons: persons};
	return app.render("index.html", context);
});

app.get("/:name.json", function(request, name) {

	var resp;

	var conn = dbConnection();

	var persons = dbQuery(conn, 'select * from test.person t where t.name = ' + quot(name));

	if(persons.length > 0) {
		var result = persons.map(
			function(rs) {
				return { name: rs.name, value: rs.value };
			}
		);

		// If there's only one:
		if(result.length == 1) {
			result = result[0]; // don't return an array
		}

		resp = Response.json(result);
	}
	else {
		resp = Response.jsonError('not_found', 'no such person: '+name, 404);
	}

	return resp;
});

app.post("/:name.json", function(request, name) {

	var resp;

	var body = request.body;
	if(body && body !== "") {

		// is the request body in our expected json format?
		var json = JSON.parse(body);
		var env = jsv.createEnvironment();
		var validation = env.validate(json, personschema);
		if (validation.errors.length === 0) {

			// valid json request:
			var value = json.value;

			var conn = dbConnection();

			var rowsEffected = dbExecute(conn, 'insert into test.person (name, value) values (' + quot(name) + ', ' + quot(value) + ')');

			if(rowsEffected > 0) {
				var persons = dbQuery(conn, 'select name, value from test.person t where t.name = ' + quot(name));

				var result = persons.map(
					function(rs) {
						return { name: rs.name, value: rs.value };
					}
				)[0];

				resp = Response.json(result);
				resp.status = 201; // created
			}
			else {
				// db insert failed:
				resp = Response.jsonError('system_error',
											'could not create in database',
											500);
			}
		}
		else {
			// invalid json request
			resp = Response.jsonError('invalid_json_request',
											'The submitted json is invalid',
											400,
											validation.errors);
		}
	}
	else {
		resp = Response.jsonError('bad_request',
								'No request body received',
								400);
	}

	return resp;
});

app.put("/:name.json", function(request, name) {

	var resp;

	var body = request.body;
	if(body && body !== "") {

		// is the request body in our expected json format?
		var json = JSON.parse(body);
		var env = jsv.createEnvironment();
		var validation = env.validate(json, personschema);
		if (validation.errors.length === 0) {

			// valid json request:
			var value = json.value;

			var conn = dbConnection();

			var rowsEffected = dbExecute(conn, 'update test.person set value=' + quot(value) + ' where name=' + quot(name));

			if(rowsEffected > 0) {
				var persons = dbQuery(conn, 'select name, value from test.person t where t.name = ' + quot(name));

				var result = persons.map(
					function(rs) {
						return { name: rs.name, value: rs.value };
					}
				)[0];

				resp = Response.json(result);
			}
			else {
				// db update failed:
				resp = Response.jsonError('not_found',
										'no such person: '+name,
										404);
			}
		}
		else {
			// invalid json request
			resp = Response.jsonError('invalid_json_request',
											'The submitted json is invalid',
											400,
											validation.errors);
		}
	}
	else {
		resp = Response.jsonError('bad_request',
								'No request body received',
								400);
	}

	return resp;
});

app.del("/:name.json", function(request, name) {

	var resp;
	var conn = dbConnection();

	var rowsEffected = dbExecute(conn, 'delete from test.person where name=' + quot(name));

	if(rowsEffected > 0) {
		resp = Response.json({deleted: true});
	}
	else {
		resp = Response.jsonError('not_found',
									'no such person: '+name,
									404);
	}

	return resp;
});

function quot(str) {
	return '\'' + str + '\'';
}

// Consider monkey patching the db module so connect
// could take an array or json argument - in the
// meantime:
function dbConnection() {
	return db.connect(settings.get('dbClass'),
						settings.get('dbUrl'),
						settings.get('dbUser'),
						settings.get('dbPasswd'));
}

//
// Likewise for logging the queries - maybe monkey patch
// the db module (or maybe we wind up with our own copy?)
//
function dbQuery(conn, query) {

	log.debug("Querying: " + query);
	return db.query(conn, query);

}

function dbExecute(conn, statement) {

	log.debug("Executing: " + statement);
	return db.execute(conn, statement);

}

// This is just to compare the speed of a static response
// compared with hitting the database - it appears to average
// less than .1 seconds (on my PC)
app.get("/test.person", function(request) {

	return Response.json({"id":1203,"name":"testvar","value":"testvalue"});

});

// This is just to test the jsonerror middleware which
// catches a thrown error object and sends it back to the
// client.
app.get("/testerror.json", function(request) {

	throw errorutil.jsonError('test_error',
									'Thrown error caught by jsonerror middleware',
									404)

});
