(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.createError = factory();
    }
}(this, function () {
    // From https://github.com/Raynos/xtend
    function extend(target) { // ...
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (source && typeof source === 'object') {
                var keys = Object.keys(source);

                for (var j = 0; j < keys.length; j++) {
                    var name = keys[j];
                    target[name] = source[name];
                }
            }
        }

        return target;
    }

    // From node.js 0.8.21:
    function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    }

    return function createError(options, SuperConstructor) {
        options = options || {};

        // to avoid doing if (err instanceof NotFound)
        // instead you can just do if (err.NotFound)
        if (options.name) {
            options[options.name] = true;
        }
        var preprocess = options && options.preprocess;

        var optionsWithoutDataAndPreprocess = extend({}, options);
        delete optionsWithoutDataAndPreprocess.data;
        delete optionsWithoutDataAndPreprocess.preprocess;

        function Constructor(messageOrOptionsOrError, preserveError) {
            if (preprocess) {
                var preprocessed = preprocess(messageOrOptionsOrError);
                if (preprocessed instanceof Constructor) {
                    return preprocessed;
                } else if (typeof preprocessed !== 'undefined') {
                    messageOrOptionsOrError = preprocessed;
                }
            }

            var err;
            var shouldCapture = false;

            if (messageOrOptionsOrError instanceof Error) {
                // Existing instance
                err = messageOrOptionsOrError;

                // if called to extend an existing error we replace it
                if (!preserveError) {
                    err = messageOrOptionsOrError;

                    // ensure we add both message and stack from original error
                    messageOrOptionsOrError = {
                        message: err.message,
                        stack: err.stack
                    };

                    // attach all other properties from the original error
                    extend(messageOrOptionsOrError, err);

                    // explicitly clear error to force creation of a new one
                    err = undefined;
                }
            } else {
                shouldCapture = true;
                if (typeof messageOrOptionsOrError === 'string') {
                    messageOrOptionsOrError = {message: messageOrOptionsOrError};
                }
            }

            if (!err) {
                err = new Error((messageOrOptionsOrError && messageOrOptionsOrError.message) || options.message);
                // https://github.com/joyent/node/issues/3212#issuecomment-5493890
                err.__proto__ = Constructor.prototype;
                if (shouldCapture && Error.captureStackTrace) {
                    Error.captureStackTrace(err, Constructor);
                }
            }

            if (SuperConstructor) {
                SuperConstructor.call(err, err, true);
            }

            extend(err, optionsWithoutDataAndPreprocess);
            if (options.data) {
                err.data = extend({}, options.data);
            }
            if (typeof messageOrOptionsOrError === 'object' && messageOrOptionsOrError) {
                if ('data' in messageOrOptionsOrError) {
                    messageOrOptionsOrError = extend({}, messageOrOptionsOrError);
                    err.data = err.data || {};
                    extend(err.data, messageOrOptionsOrError.data);
                    delete messageOrOptionsOrError.data;
                }
                extend(err, messageOrOptionsOrError);
            }
            return err;
        }
        inherits(Constructor, SuperConstructor || Error);

        if (options.name) {
            if (Object.defineProperty) {
                Object.defineProperty(Constructor, 'name', { value: options.name });
            } else {
                Constructor.name = options.name;
            }
        }

        return Constructor;
    };
}));
