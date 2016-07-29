# ringo-microservice

This is a project skeleton for building a microservice using RingoJS.

It assumes your microservice exposes RESTful JSON endpoints for doing CRUD
operations on entities persisted to a relational database.

To support this it provides examples and hooks for using:

* command line ringo using embedded jetty
* MySQL via JDBC
* JSON request/response payload validation using JSON Schema
* easy per environment configuration (i.e. dev/cert/prod settings)
* enforcement of standard format JSON responses (even when exceptions occur)
* ability to emulate PUT/POST/DELETE using GET for ease of testing
* logging via log4j
* (optional) ip authentication of clients

### Explanation and History

This code was written subsequent to my other project here SpringoJS
which lets you use ringo together with Spring MVC.

When our team developed the "Springo" approach it was needed because we
were adding Ringo server side javascript to an already existing java/Spring
codebase.

Those efforts demonstrated to our team that Ringo was a capable and
productive tool.  But the codebase for that project was large, and the
mixture of java and javascript was a surprise to some outside our core
team.

The skeleton project you see here started as a proof of concept for using
Ringo fully as well as a conscious attempt to *simplify* things compared
to the other project.

Though this effort predated the term "microservice" in retrospect that
described perfectly our effort to keep things small, simple, and standalone with
this new service.

For me personally the result was a breath of fresh air as many times our
previous java/Spring/Eclipse/WAR file/WebSphere ecosystem felt like trying
to insert a thumbtack using a sledgehammer.

Unfortunately as I write this in 2016 the time for Ringo may have passed
considering Nashorn is now the official javascript engine for the JVM.

Though my experience showed the above is more a social/political consideration
than a practical one.  i.e. Whether it's popular or not - RingoJS really
worked very well for us.

To make this code more relevant today though it should be ported to Nashorn
using some CommonJS library to add module support.  That would be the easy
part, the bigger question is how hard it would be to replace the other Ringo
capabilities e.g. the express-like middleware web framework "stick".

And frankly, it's not *even* clear how large the audience for Nashorn is right
now or how large it will become.  i.e. It might be there's just not enough overlap
between the Java and Javascript communities for even Nashorn to become popular,
as compared to e.g. node.js.  I guess only time will tell.

It's in that spirit I post this code as an example showing that javascript on
the JVM can work very well and provide the simplicity and productivity comparable
to other dynamic languages on the JVM such as Groovy, JRuby, Jython, Clojure,
etc. but using the language you're already using in the browser anyway.

For the reasons mentioned above (e.g. Ringo's lack of popularity) you might
not choose to use this code as it stands, but I remain convinced server side
javascript on the JVM has a lot of potential as a very practical and productive
alternative to today's more popular alternatives for projects requiring the JVM.

### What's Included

This repo includes:

* REMOVED: The RingoJS Server-Side Javascript Framework (ringojs.org)
* Some add-on modules in the CommonJS format (commonjs.org)
* A sample app you can use as a starting point for your microservice.

Note:  As indicated above I have removed the ringojs-0.8 directory from this
  repo as it seems more appropriate for you to download your own (and possibly
	more up to date) copy of Ringo from http://ringojs.org.  Note the packages
	directory here includes required third party packages (you can copy these to
  your ringo installation's packages directory).

The sample app provides a simple set of CRUD operations for
creating persons in a PERSON table.  

Note: We assume your MySQL database has a simple TEST.PERSON table with
  columns NAME and VALUE.

Below are instructions for installing this software and running
the sample app on your local machine.

### Installation

1.  Clone the repo to your machine. e.g. On my PC
	I chose to simply clone it into the root of C:.  The root
	directory of the cloned archive is therefore "C:\ringo-microservice".

	Note: For simplicity sake I will show paths starting "C:\ringo-microservice" in
	the examples below.

	If you choose a different directory, or if you're on a Mac or
	Linux box, please adjust these paths accordingly as you follow
	along.

2.  Make sure you have java jdk 1.6 (or later) installed on your
    machine.  Make sure JAVA_HOME is defined and %JAVA_HOME%\bin
	is included in your PATH.

	If this is set correctly you should be able to do "java -version"
    from a DOS window and see something like the following:
```
	C:\ringo-microservice>java -version
	java version "1.7.0"
	Java(TM) SE Runtime Environment (build 1.7.0-b147)
	Java HotSpot(TM) Client VM (build 21.0-b17, mixed mode, sharing)
```
3.  Next set RINGO_HOME to point at the ringo directory where you've installed
  ringo.  Since I installed in C:\ringo-microservice mine looks like:
```
	RINGO_HOME=C:\ringo-microservice\ringojs-0.8
```
Likewise add %RINGO_HOME%\bin to your PATH.

4.  If the steps above are done correctly you should now be able to do the following at a DOS prompt:
```
	C:\ringo-microservice>ringo -version
	RingoJS version 0.8
```
5.  If for any reason the above steps don't work, you might find additional information at the ringo install page:
```
	http://ringojs.org/getting_started
```
Or through the Ringo mailing list or IRC chat:
```
	http://ringojs.org/wiki/Community
```
6.  Copy the contents of the ringo-microservices/packages directory to your %RINGO_HOME%\packages directory.

### Running the Sample App

1.  In a DOS window, change to the jsonservice directory.  e.g.:
```
	C:\>cd C:\ringo-microservice\jsonservice

	C:\ringo-microservice\jsonservice>dir
	 Volume in drive C is OS
	 Volume Serial Number is F830-59A5

	 Directory of C:\ringo-microservice\jsonservice

	02/09/2012  09:57 AM    <DIR>          .
	02/09/2012  09:57 AM    <DIR>          ..
	02/10/2012  01:22 PM    <DIR>          config
	02/10/2012  01:35 PM             1,594 environment.js
	02/09/2012  04:41 PM             2,466 errorutil.js
	02/09/2012  03:16 PM               688 main.js
	02/09/2012  03:35 PM    <DIR>          middleware
	02/05/2012  09:04 AM    <DIR>          public
	02/09/2012  04:50 PM               973 schemas.js
	02/09/2012  08:15 AM             1,405 settings.js
	02/07/2012  08:08 AM    <DIR>          templates
	02/10/2012  01:05 PM             6,054 person.js
				   6 File(s)         13,180 bytes
				   6 Dir(s)  71,709,642,752 bytes free
```
2.  The main.js file is the main entry point for our app. It can be run from the command line with the "ringo" command, e.g.:
```
	C:\ringo-microservice\jsonservice>ringo main.js
	0    [main] INFO  environment  - Using default environment: localhost
	js: warning: "JSV/lib/json-schema-draft-03.js", line 917: Assignment to undeclared variable initializer
	1641 [main] INFO  org.eclipse.jetty.util.log  - jetty-7.4.1.v20110513
	1688 [main] INFO  org.eclipse.jetty.util.log  - started o.e.j.s.ServletContextHandler{/,null}
	1719 [main] INFO  org.eclipse.jetty.util.log  - Started SelectChannelConnector@0.0.0.0:8080 STARTING
	1719 [main] INFO  ringo.httpserver  - Server on http://localhost:8080 started.
```
Note that by default our server listens on port 8080.  If another server is listening on that port you will need to shut it down before running ringo.

3.  Now for a quick test you can bring up your browser and hit this test page url:
```
	http://localhost:8080/jsonservice/api/person/test.html
```
If it's working (and talking to your MySQL database) you should see a little page that say's "It's working!"

### Exercising the example RESTful JSON service

1.  A sample JSON service for creating/reading/updating/deleting persons in a PERSON table is provided.

This service has a URI of the form:
```
	http://localhost:8080/jsonservice/api/person/<varname>.json
```
Where &lt;varname&gt; is the name of a person in the PERSON table.

You perform:
* An http GET to read the person.
* An http POST to create a person.
* An http PUT to update an existing person.
* And an http DELETE to delete a person.

2.  Try and retrieve a person that's not there just using your browser, e.g. use your name.

For me that would be:
```
	http://localhost:8080/jsonservice/api/person/darren.json
```
Since the person is not found, I receive a JSON eror response like this:
```
	{
		"schema":"error",
		"responseId":"f7e45f69-abb8-4363-8ad2-14c282474847",
		"content":{
			"type":"not_found",
			"message":"no such person: darren"
		}
	}
```
This format is the standard error format intended for use by all the jsonservice services.

There's a JSON schema that specifies this format precisely, in the file named schemas.js.

3.	Now let's do a POST to create the person not found in the previous step.

Since a browser doesn't provide an easy way to do a POST from the address line alone, you may wish to download a helper plugin to do this.  In my case I use Firefox and the "Poster" plugin available here:
```
	https://addons.mozilla.org/en-US/firefox/addon/poster/?src=search
```
Alternatively our app includes a way to test non-GET requests from the browser address line by including url parameters "http.method" and "http.body", e.g. to emulate an actual POST of a request body.

To add a person the code is setup to expect a simple JSON body like this:
```
	{
		"value": "architect"
	}
```
This JSON format also has a JSON schema defining it in the file schemas.js

Using the simple way (without using Poster), we can add our person by hitting the following url in the browser's address line:
```
	http://localhost:8080/jsonservice/api/person/darren.json?http.method=POST&http.body={"value":"onlyatest"}
```
You should see a response similar to the following:
```
	{
		"id": 1220,
		"name": "darren",
		"value": "thisisatest"
	}
```
4.  Exercise the other CRUD services as follows:

a.  Read the person you just created back again and confirm it's value is what you gave:
```
	http://localhost:8080/jsonservice/api/person/darren.json
```
b.	Update it's value:
```
	http://localhost:8080/jsonservice/api/person/darren.json?http.method=PUT&http.body={"value":"updated"}
```
c.  Read the person you just updated back again and confirm you updated value is returned:
```
	http://localhost:8080/jsonservice/api/person/darren.json
```
d.	Delete the person:
```
	http://localhost:8080/jsonservice/api/person/darren.json?http.method=DELETE
```
e.  Attempt to read the person again and confirm the person is no longer found:
```
	http://localhost:8080/jsonservice/api/person/darren.json
```
### Looking at the code

Now that you've exercised the provided services you might wish to walk through the code.

Here I'll briefly describe some of the more interesting files and what they're for.

Then you can use the Ringo debugger to step through the code to see exactly how it's working.

####  The Files

The files for our app all reside in the jsonservice directory and the directories beneath it.

The most important file to understand the services you exercised is person.js.  This file contains the "action handler" methods that match the urls and http verbs (GET/POST/PUT/DELETE) to the code used to handle them.

The other files here are:

* main.js

The entry point to the app.  The most interesting line is near the end which actually starts the jetty http server you've been hitting:
```
    require("ringo/httpserver").main(module.directory);
```

* environment.js

This is a module that determines what environment (e.g. "development", "certification", "production") your app is running in.

* settings.js

This is a module for getting configuration settings, e.g. the information needed to connect to the database.

It's common for apps to deploy with the configuration settings for all possible environments, and this is what we do as well.  

The actual configuration settings reside in development/certification/etc. subdirectories of the config directory, and this module returns the proper values depending on what environment the environment module says the app is running in.

* schemas.js

This is module that organizes in one place all the JSON schemas for our application.

JSON schemas are used to specify the precise JSON attributes (and their types) that can be sent to, or returned from, our RESTful JSON services.

* errutil.js

This is a set of utility functions for generating errors from action handler methods in a consistent way that conforms to the error schema defined in schemas.js.

#### The Directories

The directories you see there are as follows:

* config

In addition to the environment specific settings subdirectories mentioned above, this directory contains the files log4j.properties and jetty.xml.

You would likely never touch jetty.xml, unless you'd like to change the default port from 8080 to something else this is where you'd do that.

log4j.properties is the typical java log4j.properties file.  You can raise or lower your debug level there or include settings for new modules should you add them.

* middleware

This directory contains custom "middleware" used by our app (beyond the standard "middleware" provided by the "stick" web framework which is part of Ringo).

There are currently just three (custom) middlewares used in our sample app:

ipauthenticate.js checks if our requests are coming from an ip configured in our configuration settings.  If it doesn't an error is returned and the request is refused.

jsonerror.js is middleware which allows low level code to throw an exception and have that translated to a standard JSON error response to the client.  In the future, this middleware will also ensure that no exceptions occurring in the application are sent to the client as an html formatted error page (since our application should return JSON to the client in all circumstances).

overridemethod.js is the middleware which allows us to emulate non-GET verbs on the browser address line by adding "http.method".

* public

In a typical (html generating) web app, this directory is meant to serve static files to the browser.  e.g. It includes a CSS file used by our test.html page.

This directory is specified to be used in main.js with the line:
```
app.static(module.resolve("public"));
```

* templates

In a typical (html generating) web app, this directory is meant to hold page templates, where Ringo's "stick" web framework is configured to use "mustache" as it's default templating engine.

In addition to individual page templates, this directory also holds "master layout" templates, as configured in person.js with the lines:
```
app.render.base = module.resolve("templates");
app.render.master = "page.html";
```

### Using the Ringo Debugger

There are various comments in the code to help explain it, but (esp. if you're new to Ringo) you might best understand the code by single stepping it in the Ringo debugger.

To start the debugger you type:
```
ringo -d main.js
```
Where the -d option tells ringo to start the debugger.

Note:  If your server was running from the previous steps, note that you simply do control-C in the DOS window to stop it (unlike other app servers, there's no elaborate shutdown procedure).

When the debugger comes up it initally stops on the first line of the main.js file.

You must click "Go" to run the program.  Do that now.

Currently, you will also see an error dialog pop up saying "Cannot find module 'C:\ringo-microservice\jsonservice\'.  This should be resolved in the future, but for now simply click "OK" when that pops up, then click Go again.

At this point, your server should be running in the debugger.

And you should see our program's files listed on the left.

Note:  If you don't see person.js listed, you may need to hit our application first (you can use one of the REST urls from the earlier steps above) to make it show up in the list.  This is because the debugger only displays a file after it's actually executed it.

Double click the person.js file and set a breakpoint in one of the "action handler" methods.

Then hit one of our RESTful urls (from the previous steps) to cause your breakpoint to be hit.

At this point you can step over, step into as with any debugger.

The current values of persons are displayed at the bottom left (I most often use the "Locals" tab).

On the bottom right is an Evaluate tab which can also be handy.  In it you can type javascript expressions and execute them directly.

If you're new to Ringo, and e.g. coming from a java background, you might be surprised to learn that the debugger can be used to fairly quickly step through and understand not only how our code handles a request, but how Ringo itself is handling a request.

For example, you can set a breakpoint at line 40 of stick/lib/stick.js (in the "app" function), and step through the stick web frameworks handling of the request, including the "middleware" executed prior to our person.js file.

### References

For additional info you may wish to consult one or more of the following:

* RingoJS:

ringojs.org

* Ringo's "Stick" web framework:

https://github.com/hns/stick#readme

* The CommonJS standard for server side javascript "modules"

http://commonjs.org

* The JSGI Server-Side Javascript "Gateway Interface" specification

http://wiki.commonjs.org/wiki/JSGI/Level0/A/Draft2

* Ringo is built atop the Rhino javascript interpreter (which sits atop java)

* This is a very helpful article explaining how to use java code from Ringo/Rhino

http://www.mozilla.org/rhino/ScriptingJava.html

* The RingoJS mailing list is a great help whether searching the archives or posting questions of your own:

http://groups.google.com/group/ringojs
