node-createerror
================

Helper for creating easily extensible and subclassable JavaScript Error classes.

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install createerror

Usage
-----

    var createError = require('createerror');

    var MyError = createError({
        name: 'MyError',
        // Used when no message is handed to the constructor:
        message: 'A slightly longer description of the error'
    });

Instances can carry extra data about the error:

    try {
        throw new MyError({
            message: "The message", // Not mandatory
            data: {disallowedIds: [1, 3, 4, 6]}
        });
    } catch(e) {
        console.warn(e.data); // {disallowedIds: [1, 3, 4, 6]}
    }

Inheriting from an existing Error class (the Error classes in the
[httpErrors](https://github.com/One-com/node-httperrors)  module also use
`createError`):

    var httpErrors = require('httperrors');

    var NotFoundUnderTheBedError = createError({
        name: 'NotFoundUnderTheBed',
        message: 'I looked under the bed, but it was not found'
    }, httpErrors.NotFound);

Instances of this error walk and quack like `httpErrors.NotFound` instances, of course:

    var ohDear = new NotFoundUnderTheBedError('No monsters today');
    console.warn(ohDear.NotFound); // true
    console.warn(ohDear.NotFoundUnderTheBed); // true


License
-------

3-clause BSD license -- see the `LICENSE` file for details.
