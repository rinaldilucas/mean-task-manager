var expect = require('unexpected'),
    createError = require('../lib/createError');

describe('createError', function () {
    // https://github.com/joyent/node/issues/3212
    it('should return "[object Error]" when Object.prototype.toString is called on it', function () {
        var Err = createError({foo: 'bar'});
        expect(Object.prototype.toString.call(new Err()), 'to equal', '[object Error]');
    });

    it('should default to the message provided in the options object when creating the class', function () {
        var Err = createError({message: 'theDefaultMessage'});
        expect(new Err().message, 'to equal', 'theDefaultMessage');
    });

    it('should include the default message in the stringification of the Error', function () {
        var Err = createError({message: 'theDefaultMessage'});
        expect(new Err().toString(), 'to equal', 'Error: theDefaultMessage');
    });

    it('should result a constructor that produces instances of itself and Error', function () {
        var Err = createError({foo: 'bar'});
        expect(new Err(), 'to be an', Err);
    });

    it('should result a constructor that produces instances whose constructor property point at it', function () {
        var Err = createError({foo: 'bar'});
        expect(new Err().constructor, 'to equal', Err);
    });

    it('should return a constructor that prefers a message passed as to first argument to the one provided in the options object', function () {
        var Err = createError({message: 'default message'});
        expect(new Err('overridden message').message, 'to equal', 'overridden message');
    });

    it('should return a constructor that produces instances of its SuperConstructor and Error', function () {
        var SuperErr = createError({quux: 'baz'}),
            Err = createError({foo: 'bar'}, SuperErr);
        expect(new Err(), 'to be an', Error);
        expect(new Err(), 'to be a', SuperErr);
    });

    it('should return a constructor that produces instances whose toString method return the expected value', function () {
        var Err = createError({foo: 'bar', name: 'TheErrorName'});
        expect(new Err('error message').toString(), 'to equal', 'TheErrorName: error message');
        expect(new Err().toString(), 'to equal', 'TheErrorName');
    });

    it('should subclass TypeError (and thus other built-in Error subclasses) correctly', function () {
        var Err = createError({foo: 'bar', name: 'TheErrorName'}, TypeError),
            err = new Err('the error message');
        expect(Object.prototype.toString.call(err), 'to equal', '[object Error]');
        expect(err, 'to be a', TypeError);
        expect(err, 'to be an', Error);
        expect(err, 'to be an', Err);
    });

    it('should adopt arbitrary properties passed to a generated constructor', function () {
        var Err = createError({foo: 'bar'}),
            err = new Err();

        expect(err.foo, 'to equal', 'bar');

        var err2 = new Err({foo: 'quux'});
        expect(err2.foo, 'to equal', 'quux');
        // Make sure that top stack frame in err.stack points to this file rather than createError.js:
        expect(err2.stack, 'to match', /test\/createError\.js:/);
    });

    it('should preserve the original stack trace and gain the properties of the Error class and its superclass when an existing Error instance is passed to a generated constructor', function () {
        function Foo() {
            return new Error('the original error');
        }
        var SuperError = createError({isSuper: true, name: 'Super'}),
            Err = createError({name: 'SomethingMoreSpecific'}, SuperError),
            err = new Err(Foo('blabla'));
        expect(err.name, 'to equal', 'SomethingMoreSpecific');
        expect(err.isSuper, 'to equal', true);
        expect(err.SomethingMoreSpecific, 'to equal', true);
        expect(err.stack, 'to match', /the original error/);
        expect(err.stack, 'to match', /Foo/);
    });

    it('should produce a correct instance when a generated constructor is invoked without the new operator', function () {
        var Err = createError(),
            err = Err('message');

        expect(err, 'to be an', Err);
        // Make sure that top stack frame in err.stack points to this file rather than createError.js:
        expect(err.stack.split("\n")[1], 'to match', /test\/createError\.js:/);
    });

    it('should mix the data object of the class with those of the instance', function () {
        var Err = createError({data: {upstream: 'foo'}}),
            err = Err({message: 'blah', data: {quux: 123}});

        expect(err, 'to have properties', {
            message: 'blah',
            data: {
                upstream: 'foo',
                quux: 123
            }
        });
    });

    it('should not share the data object between instances', function () {
        var classData = {hey: 'there'};
        var Err = createError({data: classData}),
            err1 = new Err();
        expect(err1.data, 'to equal', {hey: 'there'});
        expect(err1.data, 'not to be', classData);

        err1.data.foo = 'bar';

        var err2 = new Err();

        expect(err2.data.foo, 'to be undefined');
    });

    it('should not alter an existing error', function () {
        var classData = {hey: 'there'};
        var LocalError = createError({name: 'LocalError', data: classData}),
            SpecificLocalError = createError({name: 'SpecificLocalError'}, LocalError),
            err = new Error('standard error');

        // create a new local error passing in the original error
        var localError = new SpecificLocalError(err);

        // assert we added no keys to the orignal
        expect(err, 'to only have keys', ['message']);

        // assert the error was correctly extended
        expect(localError, 'to have message', 'standard error');
        expect(localError.name, 'to equal', 'SpecificLocalError');
        expect(localError.data, 'to equal', classData);
    });

    it('should not break when the constructor options object has a data property with a value of undefined', function () {
        var Err = createError();
        new Err({data: undefined});
    });

    describe('with a preprocess parameter', function () {
        it('should pass the constructor parameters to the preprocessor', function () {
            var Err = createError({
                preprocess: function (messageOrOptionsOrError) {
                    messageOrOptionsOrError.foo = 123;
                    return messageOrOptionsOrError;
                }
            });
            expect(new Err({}), 'to satisfy', {
                foo: 123
            });
        });

        it('should keep the original options object if the preprocessor returns undefined', function () {
            var Err = createError({
                preprocess: function (messageOrOptionsOrError) {
                    return;
                }
            });
            expect(new Err({ foo: 123 }), 'to satisfy', {
                foo: 123
            });
        });
    });
});
