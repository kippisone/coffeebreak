CoffeeBreak
===========

CoffeeBreak is an extensive testrunner UI for javascript unit tests using mocha.


Installation
------------
    npm install -g coffeebreak


Use it
------
    $ coffeebreak [options]


Command line options
--------------------
    -h, --help                output usage information
    -V, --version             output the version number
    -d, --dev                 Run in debug mode
    -q, --logRequests         Log requests and response
    -p, --port <port>         Set server port
    -c, --coverage            Enable code coverage
    -r , --project <project>  Run only <project>
    -i , --diff <match>       Test title must match <match>

Project configuration
---------------------

Create a `coffeebreak.json` file in your project root.

    {
        "project": "Project Name",
        "browser": true,
        "files": ["src/**/*.js"],
        "tests": ["tests/**/*.spec.js"]
    }


Properties:
-----------

*project* - Sets a test project name.
*browser* - Tells the testrunner that Javascript tests should be handeled as frontend tests.
*files* - Path to required source files
*tests* - Path to your spec files
*watch* - Watch this files for changes. If this property isn't set, all files from the `files` and `tests' properties are watched for changes
