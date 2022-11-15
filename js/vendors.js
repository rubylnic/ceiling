(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (global = global || self, factory(global.IMask = {}));
}(this, (function(exports) {
    'use strict';

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var check = function(it) {
        return it && it.Math == Math && it;
    }; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


    var global_1 = // eslint-disable-next-line no-undef
        check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
        Function('return this')();

    var fails = function(exec) {
        try {
            return !!exec();
        } catch (error) {
            return true;
        }
    };

    // Thank's IE8 for his funny defineProperty


    var descriptors = !fails(function() {
        return Object.defineProperty({}, 1, {
            get: function() {
                return 7;
            }
        })[1] != 7;
    });

    var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

    var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
        1: 2
    }, 1); // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

    var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
        var descriptor = getOwnPropertyDescriptor(this, V);
        return !!descriptor && descriptor.enumerable;
    } : nativePropertyIsEnumerable;

    var objectPropertyIsEnumerable = {
        f: f
    };

    var createPropertyDescriptor = function(bitmap, value) {
        return {
            enumerable: !(bitmap & 1),
            configurable: !(bitmap & 2),
            writable: !(bitmap & 4),
            value: value
        };
    };

    var toString = {}.toString;

    var classofRaw = function(it) {
        return toString.call(it).slice(8, -1);
    };

    var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

    var indexedObject = fails(function() {
        // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
        // eslint-disable-next-line no-prototype-builtins
        return !Object('z').propertyIsEnumerable(0);
    }) ? function(it) {
        return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
    } : Object;

    // `RequireObjectCoercible` abstract operation
    // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
    var requireObjectCoercible = function(it) {
        if (it == undefined) throw TypeError("Can't call method on " + it);
        return it;
    };

    // toObject with fallback for non-array-like ES3 strings




    var toIndexedObject = function(it) {
        return indexedObject(requireObjectCoercible(it));
    };

    var isObject = function(it) {
        return typeof it === 'object' ? it !== null : typeof it === 'function';
    };

    // `ToPrimitive` abstract operation
    // https://tc39.github.io/ecma262/#sec-toprimitive
    // instead of the ES6 spec version, we didn't implement @@toPrimitive case
    // and the second argument - flag - preferred type is a string


    var toPrimitive = function(input, PREFERRED_STRING) {
        if (!isObject(input)) return input;
        var fn, val;
        if (PREFERRED_STRING && typeof(fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
        if (typeof(fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
        if (!PREFERRED_STRING && typeof(fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
        throw TypeError("Can't convert object to primitive value");
    };

    var hasOwnProperty = {}.hasOwnProperty;

    var has = function(it, key) {
        return hasOwnProperty.call(it, key);
    };

    var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

    var EXISTS = isObject(document$1) && isObject(document$1.createElement);

    var documentCreateElement = function(it) {
        return EXISTS ? document$1.createElement(it) : {};
    };

    // Thank's IE8 for his funny defineProperty


    var ie8DomDefine = !descriptors && !fails(function() {
        return Object.defineProperty(documentCreateElement('div'), 'a', {
            get: function() {
                return 7;
            }
        }).a != 7;
    });

    var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

    var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
        O = toIndexedObject(O);
        P = toPrimitive(P, true);
        if (ie8DomDefine) try {
            return nativeGetOwnPropertyDescriptor(O, P);
        } catch (error) {
            /* empty */
        }
        if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
    };

    var objectGetOwnPropertyDescriptor = {
        f: f$1
    };

    var anObject = function(it) {
        if (!isObject(it)) {
            throw TypeError(String(it) + ' is not an object');
        }

        return it;
    };

    var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
    // https://tc39.github.io/ecma262/#sec-object.defineproperty

    var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
        anObject(O);
        P = toPrimitive(P, true);
        anObject(Attributes);
        if (ie8DomDefine) try {
            return nativeDefineProperty(O, P, Attributes);
        } catch (error) {
            /* empty */
        }
        if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
        if ('value' in Attributes) O[P] = Attributes.value;
        return O;
    };

    var objectDefineProperty = {
        f: f$2
    };

    var createNonEnumerableProperty = descriptors ? function(object, key, value) {
        return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
    } : function(object, key, value) {
        object[key] = value;
        return object;
    };

    var setGlobal = function(key, value) {
        try {
            createNonEnumerableProperty(global_1, key, value);
        } catch (error) {
            global_1[key] = value;
        }

        return value;
    };

    var SHARED = '__core-js_shared__';
    var store = global_1[SHARED] || setGlobal(SHARED, {});
    var sharedStore = store;

    var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

    if (typeof sharedStore.inspectSource != 'function') {
        sharedStore.inspectSource = function(it) {
            return functionToString.call(it);
        };
    }

    var inspectSource = sharedStore.inspectSource;

    var WeakMap = global_1.WeakMap;
    var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

    var shared = createCommonjsModule(function(module) {
        (module.exports = function(key, value) {
            return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
        })('versions', []).push({
            version: '3.6.4',
            mode: 'global',
            copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
        });
    });

    var id = 0;
    var postfix = Math.random();

    var uid = function(key) {
        return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
    };

    var keys = shared('keys');

    var sharedKey = function(key) {
        return keys[key] || (keys[key] = uid(key));
    };

    var hiddenKeys = {};

    var WeakMap$1 = global_1.WeakMap;
    var set, get, has$1;

    var enforce = function(it) {
        return has$1(it) ? get(it) : set(it, {});
    };

    var getterFor = function(TYPE) {
        return function(it) {
            var state;

            if (!isObject(it) || (state = get(it)).type !== TYPE) {
                throw TypeError('Incompatible receiver, ' + TYPE + ' required');
            }

            return state;
        };
    };

    if (nativeWeakMap) {
        var store$1 = new WeakMap$1();
        var wmget = store$1.get;
        var wmhas = store$1.has;
        var wmset = store$1.set;

        set = function(it, metadata) {
            wmset.call(store$1, it, metadata);
            return metadata;
        };

        get = function(it) {
            return wmget.call(store$1, it) || {};
        };

        has$1 = function(it) {
            return wmhas.call(store$1, it);
        };
    } else {
        var STATE = sharedKey('state');
        hiddenKeys[STATE] = true;

        set = function(it, metadata) {
            createNonEnumerableProperty(it, STATE, metadata);
            return metadata;
        };

        get = function(it) {
            return has(it, STATE) ? it[STATE] : {};
        };

        has$1 = function(it) {
            return has(it, STATE);
        };
    }

    var internalState = {
        set: set,
        get: get,
        has: has$1,
        enforce: enforce,
        getterFor: getterFor
    };

    var redefine = createCommonjsModule(function(module) {
        var getInternalState = internalState.get;
        var enforceInternalState = internalState.enforce;
        var TEMPLATE = String(String).split('String');
        (module.exports = function(O, key, value, options) {
            var unsafe = options ? !!options.unsafe : false;
            var simple = options ? !!options.enumerable : false;
            var noTargetGet = options ? !!options.noTargetGet : false;

            if (typeof value == 'function') {
                if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
                enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
            }

            if (O === global_1) {
                if (simple) O[key] = value;
                else setGlobal(key, value);
                return;
            } else if (!unsafe) {
                delete O[key];
            } else if (!noTargetGet && O[key]) {
                simple = true;
            }

            if (simple) O[key] = value;
            else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
        })(Function.prototype, 'toString', function toString() {
            return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
        });
    });

    var path = global_1;

    var aFunction = function(variable) {
        return typeof variable == 'function' ? variable : undefined;
    };

    var getBuiltIn = function(namespace, method) {
        return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
    };

    var ceil = Math.ceil;
    var floor = Math.floor; // `ToInteger` abstract operation
    // https://tc39.github.io/ecma262/#sec-tointeger

    var toInteger = function(argument) {
        return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
    };

    var min = Math.min; // `ToLength` abstract operation
    // https://tc39.github.io/ecma262/#sec-tolength

    var toLength = function(argument) {
        return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
    };

    var max = Math.max;
    var min$1 = Math.min; // Helper for a popular repeating case of the spec:
    // Let integer be ? ToInteger(index).
    // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

    var toAbsoluteIndex = function(index, length) {
        var integer = toInteger(index);
        return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
    };

    // `Array.prototype.{ indexOf, includes }` methods implementation


    var createMethod = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
            var O = toIndexedObject($this);
            var length = toLength(O.length);
            var index = toAbsoluteIndex(fromIndex, length);
            var value; // Array#includes uses SameValueZero equality algorithm
            // eslint-disable-next-line no-self-compare

            if (IS_INCLUDES && el != el)
                while (length > index) {
                    value = O[index++]; // eslint-disable-next-line no-self-compare

                    if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
                } else
                    for (; length > index; index++) {
                        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
                    }
            return !IS_INCLUDES && -1;
        };
    };

    var arrayIncludes = {
        // `Array.prototype.includes` method
        // https://tc39.github.io/ecma262/#sec-array.prototype.includes
        includes: createMethod(true),
        // `Array.prototype.indexOf` method
        // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
        indexOf: createMethod(false)
    };

    var indexOf = arrayIncludes.indexOf;



    var objectKeysInternal = function(object, names) {
        var O = toIndexedObject(object);
        var i = 0;
        var result = [];
        var key;

        for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


        while (names.length > i)
            if (has(O, key = names[i++])) {
                ~indexOf(result, key) || result.push(key);
            }

        return result;
    };

    // IE8- don't enum bug keys
    var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

    var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
    // https://tc39.github.io/ecma262/#sec-object.getownpropertynames

    var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return objectKeysInternal(O, hiddenKeys$1);
    };

    var objectGetOwnPropertyNames = {
        f: f$3
    };

    var f$4 = Object.getOwnPropertySymbols;

    var objectGetOwnPropertySymbols = {
        f: f$4
    };

    // all object keys, includes non-enumerable and symbols


    var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
        var keys = objectGetOwnPropertyNames.f(anObject(it));
        var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
        return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
    };

    var copyConstructorProperties = function(target, source) {
        var keys = ownKeys(source);
        var defineProperty = objectDefineProperty.f;
        var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
        }
    };

    var replacement = /#|\.prototype\./;

    var isForced = function(feature, detection) {
        var value = data[normalize(feature)];
        return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
    };

    var normalize = isForced.normalize = function(string) {
        return String(string).replace(replacement, '.').toLowerCase();
    };

    var data = isForced.data = {};
    var NATIVE = isForced.NATIVE = 'N';
    var POLYFILL = isForced.POLYFILL = 'P';
    var isForced_1 = isForced;

    var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;










    /*
      options.target      - name of the target object
      options.global      - target is the global object
      options.stat        - export as static methods of target
      options.proto       - export as prototype methods of target
      options.real        - real prototype method for the `pure` version
      options.forced      - export even if the native feature is available
      options.bind        - bind methods to the target, required for the `pure` version
      options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
      options.unsafe      - use the simple assignment of property instead of delete + defineProperty
      options.sham        - add a flag to not completely full polyfills
      options.enumerable  - export as enumerable property
      options.noTargetGet - prevent calling a getter on target
    */


    var _export = function(options, source) {
        var TARGET = options.target;
        var GLOBAL = options.global;
        var STATIC = options.stat;
        var FORCED, target, key, targetProperty, sourceProperty, descriptor;

        if (GLOBAL) {
            target = global_1;
        } else if (STATIC) {
            target = global_1[TARGET] || setGlobal(TARGET, {});
        } else {
            target = (global_1[TARGET] || {}).prototype;
        }

        if (target)
            for (key in source) {
                sourceProperty = source[key];

                if (options.noTargetGet) {
                    descriptor = getOwnPropertyDescriptor$1(target, key);
                    targetProperty = descriptor && descriptor.value;
                } else targetProperty = target[key];

                FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

                if (!FORCED && targetProperty !== undefined) {
                    if (typeof sourceProperty === typeof targetProperty) continue;
                    copyConstructorProperties(sourceProperty, targetProperty);
                } // add a flag to not completely full polyfills


                if (options.sham || targetProperty && targetProperty.sham) {
                    createNonEnumerableProperty(sourceProperty, 'sham', true);
                } // extend global


                redefine(target, key, sourceProperty, options);
            }
    };

    // `Object.keys` method
    // https://tc39.github.io/ecma262/#sec-object.keys


    var objectKeys = Object.keys || function keys(O) {
        return objectKeysInternal(O, enumBugKeys);
    };

    // `ToObject` abstract operation
    // https://tc39.github.io/ecma262/#sec-toobject


    var toObject = function(argument) {
        return Object(requireObjectCoercible(argument));
    };

    var nativeAssign = Object.assign;
    var defineProperty = Object.defineProperty; // `Object.assign` method
    // https://tc39.github.io/ecma262/#sec-object.assign

    var objectAssign = !nativeAssign || fails(function() {
        // should have correct order of operations (Edge bug)
        if (descriptors && nativeAssign({
                b: 1
            }, nativeAssign(defineProperty({}, 'a', {
                enumerable: true,
                get: function() {
                    defineProperty(this, 'b', {
                        value: 3,
                        enumerable: false
                    });
                }
            }), {
                b: 2
            })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

        var A = {};
        var B = {}; // eslint-disable-next-line no-undef

        var symbol = Symbol();
        var alphabet = 'abcdefghijklmnopqrst';
        A[symbol] = 7;
        alphabet.split('').forEach(function(chr) {
            B[chr] = chr;
        });
        return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
    }) ? function assign(target, source) {
        // eslint-disable-line no-unused-vars
        var T = toObject(target);
        var argumentsLength = arguments.length;
        var index = 1;
        var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
        var propertyIsEnumerable = objectPropertyIsEnumerable.f;

        while (argumentsLength > index) {
            var S = indexedObject(arguments[index++]);
            var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
            var length = keys.length;
            var j = 0;
            var key;

            while (length > j) {
                key = keys[j++];
                if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
            }
        }

        return T;
    } : nativeAssign;

    // `Object.assign` method
    // https://tc39.github.io/ecma262/#sec-object.assign


    _export({
        target: 'Object',
        stat: true,
        forced: Object.assign !== objectAssign
    }, {
        assign: objectAssign
    });

    // `String.prototype.repeat` method implementation
    // https://tc39.github.io/ecma262/#sec-string.prototype.repeat


    var stringRepeat = ''.repeat || function repeat(count) {
        var str = String(requireObjectCoercible(this));
        var result = '';
        var n = toInteger(count);
        if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');

        for (; n > 0;
            (n >>>= 1) && (str += str))
            if (n & 1) result += str;

        return result;
    };

    // https://github.com/tc39/proposal-string-pad-start-end






    var ceil$1 = Math.ceil; // `String.prototype.{ padStart, padEnd }` methods implementation

    var createMethod$1 = function(IS_END) {
        return function($this, maxLength, fillString) {
            var S = String(requireObjectCoercible($this));
            var stringLength = S.length;
            var fillStr = fillString === undefined ? ' ' : String(fillString);
            var intMaxLength = toLength(maxLength);
            var fillLen, stringFiller;
            if (intMaxLength <= stringLength || fillStr == '') return S;
            fillLen = intMaxLength - stringLength;
            stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
            if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
            return IS_END ? S + stringFiller : stringFiller + S;
        };
    };

    var stringPad = {
        // `String.prototype.padStart` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
        start: createMethod$1(false),
        // `String.prototype.padEnd` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.padend
        end: createMethod$1(true)
    };

    var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

    // https://github.com/zloirock/core-js/issues/280
    // eslint-disable-next-line unicorn/no-unsafe-regex


    var stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(engineUserAgent);

    var $padEnd = stringPad.end;

    // `String.prototype.padEnd` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padend


    _export({
        target: 'String',
        proto: true,
        forced: stringPadWebkitBug
    }, {
        padEnd: function padEnd(maxLength
            /* , fillString = ' ' */
        ) {
            return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
        }
    });

    var $padStart = stringPad.start;

    // `String.prototype.padStart` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.padstart


    _export({
        target: 'String',
        proto: true,
        forced: stringPadWebkitBug
    }, {
        padStart: function padStart(maxLength
            /* , fillString = ' ' */
        ) {
            return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
        }
    });

    // `String.prototype.repeat` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.repeat


    _export({
        target: 'String',
        proto: true
    }, {
        repeat: stringRepeat
    });

    // `globalThis` object
    // https://github.com/tc39/proposal-global


    _export({
        global: true
    }, {
        globalThis: global_1
    });

    function _typeof(obj) {
        "@babel/helpers - typeof";

        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
            _typeof = function(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
        }

        return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function");
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true
            }
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };

        return _setPrototypeOf(o, p);
    }

    function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;

        for (i = 0; i < sourceKeys.length; i++) {
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }

        return target;
    }

    function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};

        var target = _objectWithoutPropertiesLoose(source, excluded);

        var key, i;

        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

            for (i = 0; i < sourceSymbolKeys.length; i++) {
                key = sourceSymbolKeys[i];
                if (excluded.indexOf(key) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
                target[key] = source[key];
            }
        }

        return target;
    }

    function _assertThisInitialized(self) {
        if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return self;
    }

    function _possibleConstructorReturn(self, call) {
        if (call && (typeof call === "object" || typeof call === "function")) {
            return call;
        }

        return _assertThisInitialized(self);
    }

    function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null) break;
        }

        return object;
    }

    function _get(target, property, receiver) {
        if (typeof Reflect !== "undefined" && Reflect.get) {
            _get = Reflect.get;
        } else {
            _get = function _get(target, property, receiver) {
                var base = _superPropBase(target, property);

                if (!base) return;
                var desc = Object.getOwnPropertyDescriptor(base, property);

                if (desc.get) {
                    return desc.get.call(receiver);
                }

                return desc.value;
            };
        }

        return _get(target, property, receiver || target);
    }

    function set$1(target, property, value, receiver) {
        if (typeof Reflect !== "undefined" && Reflect.set) {
            set$1 = Reflect.set;
        } else {
            set$1 = function set(target, property, value, receiver) {
                var base = _superPropBase(target, property);

                var desc;

                if (base) {
                    desc = Object.getOwnPropertyDescriptor(base, property);

                    if (desc.set) {
                        desc.set.call(receiver, value);
                        return true;
                    } else if (!desc.writable) {
                        return false;
                    }
                }

                desc = Object.getOwnPropertyDescriptor(receiver, property);

                if (desc) {
                    if (!desc.writable) {
                        return false;
                    }

                    desc.value = value;
                    Object.defineProperty(receiver, property, desc);
                } else {
                    _defineProperty(receiver, property, value);
                }

                return true;
            };
        }

        return set$1(target, property, value, receiver);
    }

    function _set(target, property, value, receiver, isStrict) {
        var s = set$1(target, property, value, receiver || target);

        if (!s && isStrict) {
            throw new Error('failed to set property');
        }

        return value;
    }

    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
        if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
            return;
        }

        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);

                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }

        return _arr;
    }

    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }

    /** Checks if value is string */
    function isString(str) {
        return typeof str === 'string' || str instanceof String;
    }
    /**
      Direction
      @prop {string} NONE
      @prop {string} LEFT
      @prop {string} FORCE_LEFT
      @prop {string} RIGHT
      @prop {string} FORCE_RIGHT
    */

    var DIRECTION = {
        NONE: 'NONE',
        LEFT: 'LEFT',
        FORCE_LEFT: 'FORCE_LEFT',
        RIGHT: 'RIGHT',
        FORCE_RIGHT: 'FORCE_RIGHT'
    };
    /** */

    function forceDirection(direction) {
        switch (direction) {
            case DIRECTION.LEFT:
                return DIRECTION.FORCE_LEFT;

            case DIRECTION.RIGHT:
                return DIRECTION.FORCE_RIGHT;

            default:
                return direction;
        }
    }
    /** Escapes regular expression control chars */

    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
    } // cloned from https://github.com/epoberezkin/fast-deep-equal with small changes

    function objectIncludes(b, a) {
        if (a === b) return true;
        var arrA = Array.isArray(a),
            arrB = Array.isArray(b),
            i;

        if (arrA && arrB) {
            if (a.length != b.length) return false;

            for (i = 0; i < a.length; i++) {
                if (!objectIncludes(a[i], b[i])) return false;
            }

            return true;
        }

        if (arrA != arrB) return false;

        if (a && b && _typeof(a) === 'object' && _typeof(b) === 'object') {
            var dateA = a instanceof Date,
                dateB = b instanceof Date;
            if (dateA && dateB) return a.getTime() == b.getTime();
            if (dateA != dateB) return false;
            var regexpA = a instanceof RegExp,
                regexpB = b instanceof RegExp;
            if (regexpA && regexpB) return a.toString() == b.toString();
            if (regexpA != regexpB) return false;
            var keys = Object.keys(a); // if (keys.length !== Object.keys(b).length) return false;

            for (i = 0; i < keys.length; i++) {
                if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
            }

            for (i = 0; i < keys.length; i++) {
                if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
            }

            return true;
        } else if (a && b && typeof a === 'function' && typeof b === 'function') {
            return a.toString() === b.toString();
        }

        return false;
    }
    /** Selection range */

    /** Provides details of changing input */

    var ActionDetails =
        /*#__PURE__*/
        function() {
            /** Current input value */

            /** Current cursor position */

            /** Old input value */

            /** Old selection */
            function ActionDetails(value, cursorPos, oldValue, oldSelection) {
                _classCallCheck(this, ActionDetails);

                this.value = value;
                this.cursorPos = cursorPos;
                this.oldValue = oldValue;
                this.oldSelection = oldSelection; // double check if left part was changed (autofilling, other non-standard input triggers)

                while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
                    --this.oldSelection.start;
                }
            }
            /**
              Start changing position
              @readonly
            */


            _createClass(ActionDetails, [{
                key: "startChangePos",
                get: function get() {
                        return Math.min(this.cursorPos, this.oldSelection.start);
                    }
                    /**
                      Inserted symbols count
                      @readonly
                    */

            }, {
                key: "insertedCount",
                get: function get() {
                        return this.cursorPos - this.startChangePos;
                    }
                    /**
                      Inserted symbols
                      @readonly
                    */

            }, {
                key: "inserted",
                get: function get() {
                        return this.value.substr(this.startChangePos, this.insertedCount);
                    }
                    /**
                      Removed symbols count
                      @readonly
                    */

            }, {
                key: "removedCount",
                get: function get() {
                        // Math.max for opposite operation
                        return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
                            this.oldValue.length - this.value.length, 0);
                    }
                    /**
                      Removed symbols
                      @readonly
                    */

            }, {
                key: "removed",
                get: function get() {
                        return this.oldValue.substr(this.startChangePos, this.removedCount);
                    }
                    /**
                      Unchanged head symbols
                      @readonly
                    */

            }, {
                key: "head",
                get: function get() {
                        return this.value.substring(0, this.startChangePos);
                    }
                    /**
                      Unchanged tail symbols
                      @readonly
                    */

            }, {
                key: "tail",
                get: function get() {
                        return this.value.substring(this.startChangePos + this.insertedCount);
                    }
                    /**
                      Remove direction
                      @readonly
                    */

            }, {
                key: "removeDirection",
                get: function get() {
                    if (!this.removedCount || this.insertedCount) return DIRECTION.NONE; // align right if delete at right or if range removed (event with backspace)

                    return this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos ? DIRECTION.RIGHT : DIRECTION.LEFT;
                }
            }]);

            return ActionDetails;
        }();

    /**
      Provides details of changing model value
      @param {Object} [details]
      @param {string} [details.inserted] - Inserted symbols
      @param {boolean} [details.skip] - Can skip chars
      @param {number} [details.removeCount] - Removed symbols count
      @param {number} [details.tailShift] - Additional offset if any changes occurred before tail
    */
    var ChangeDetails =
        /*#__PURE__*/
        function() {
            /** Inserted symbols */

            /** Can skip chars */

            /** Additional offset if any changes occurred before tail */

            /** Raw inserted is used by dynamic mask */
            function ChangeDetails(details) {
                _classCallCheck(this, ChangeDetails);

                Object.assign(this, {
                    inserted: '',
                    rawInserted: '',
                    skip: false,
                    tailShift: 0
                }, details);
            }
            /**
              Aggregate changes
              @returns {ChangeDetails} `this`
            */


            _createClass(ChangeDetails, [{
                key: "aggregate",
                value: function aggregate(details) {
                        this.rawInserted += details.rawInserted;
                        this.skip = this.skip || details.skip;
                        this.inserted += details.inserted;
                        this.tailShift += details.tailShift;
                        return this;
                    }
                    /** Total offset considering all changes */

            }, {
                key: "offset",
                get: function get() {
                    return this.tailShift + this.inserted.length;
                }
            }]);

            return ChangeDetails;
        }();

    /** Provides details of continuous extracted tail */
    var ContinuousTailDetails =
        /*#__PURE__*/
        function() {
            /** Tail value as string */

            /** Tail start position */

            /** Start position */
            function ContinuousTailDetails() {
                var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var stop = arguments.length > 2 ? arguments[2] : undefined;

                _classCallCheck(this, ContinuousTailDetails);

                this.value = value;
                this.from = from;
                this.stop = stop;
            }

            _createClass(ContinuousTailDetails, [{
                key: "toString",
                value: function toString() {
                    return this.value;
                }
            }, {
                key: "extend",
                value: function extend(tail) {
                    this.value += String(tail);
                }
            }, {
                key: "appendTo",
                value: function appendTo(masked) {
                    return masked.append(this.toString(), {
                        tail: true
                    }).aggregate(masked._appendPlaceholder());
                }
            }, {
                key: "shiftBefore",
                value: function shiftBefore(pos) {
                    if (this.from >= pos || !this.value.length) return '';
                    var shiftChar = this.value[0];
                    this.value = this.value.slice(1);
                    return shiftChar;
                }
            }, {
                key: "state",
                get: function get() {
                    return {
                        value: this.value,
                        from: this.from,
                        stop: this.stop
                    };
                },
                set: function set(state) {
                    Object.assign(this, state);
                }
            }]);

            return ContinuousTailDetails;
        }();

    /**
     * Applies mask on element.
     * @constructor
     * @param {HTMLInputElement|HTMLTextAreaElement|MaskElement} el - Element to apply mask
     * @param {Object} opts - Custom mask options
     * @return {InputMask}
     */
    function IMask(el) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        // currently available only for input-like elements
        return new IMask.InputMask(el, opts);
    }

    /** Supported mask type */

    /** Provides common masking stuff */
    var Masked =
        /*#__PURE__*/
        function() {
            // $Shape<MaskedOptions>; TODO after fix https://github.com/facebook/flow/issues/4773

            /** @type {Mask} */

            /** */
            // $FlowFixMe no ideas

            /** Transforms value before mask processing */

            /** Validates if value is acceptable */

            /** Does additional processing in the end of editing */

            /** Format typed value to string */

            /** Parse strgin to get typed value */

            /** Enable characters overwriting */

            /** */
            function Masked(opts) {
                _classCallCheck(this, Masked);

                this._value = '';

                this._update(Object.assign({}, Masked.DEFAULTS, {}, opts));

                this.isInitialized = true;
            }
            /** Sets and applies new options */


            _createClass(Masked, [{
                key: "updateOptions",
                value: function updateOptions(opts) {
                        if (!Object.keys(opts).length) return;
                        this.withValueRefresh(this._update.bind(this, opts));
                    }
                    /**
                      Sets new options
                      @protected
                    */

            }, {
                key: "_update",
                value: function _update(opts) {
                        Object.assign(this, opts);
                    }
                    /** Mask state */

            }, {
                key: "reset",

                /** Resets value */
                value: function reset() {
                        this._value = '';
                    }
                    /** */

            }, {
                key: "resolve",

                /** Resolve new value */
                value: function resolve(value) {
                        this.reset();
                        this.append(value, {
                            input: true
                        }, '');
                        this.doCommit();
                        return this.value;
                    }
                    /** */

            }, {
                key: "nearestInputPos",

                /** Finds nearest input position in direction */
                value: function nearestInputPos(cursorPos, direction) {
                        return cursorPos;
                    }
                    /** Extracts value in range considering flags */

            }, {
                key: "extractInput",
                value: function extractInput() {
                        var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                        return this.value.slice(fromPos, toPos);
                    }
                    /** Extracts tail in range */

            }, {
                key: "extractTail",
                value: function extractTail() {
                        var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                        return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
                    }
                    /** Appends tail */
                    // $FlowFixMe no ideas

            }, {
                key: "appendTail",
                value: function appendTail(tail) {
                        if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
                        return tail.appendTo(this);
                    }
                    /** Appends char */

            }, {
                key: "_appendCharRaw",
                value: function _appendCharRaw(ch) {
                        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        ch = this.doPrepare(ch, flags);
                        if (!ch) return new ChangeDetails();
                        this._value += ch;
                        return new ChangeDetails({
                            inserted: ch,
                            rawInserted: ch
                        });
                    }
                    /** Appends char */

            }, {
                key: "_appendChar",
                value: function _appendChar(ch) {
                        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        var checkTail = arguments.length > 2 ? arguments[2] : undefined;
                        var consistentState = this.state;

                        var details = this._appendCharRaw(ch, flags);

                        if (details.inserted) {
                            var consistentTail;
                            var appended = this.doValidate(flags) !== false;

                            if (appended && checkTail != null) {
                                // validation ok, check tail
                                var beforeTailState = this.state;

                                if (this.overwrite) {
                                    consistentTail = checkTail.state;
                                    checkTail.shiftBefore(this.value.length);
                                }

                                var tailDetails = this.appendTail(checkTail);
                                appended = tailDetails.rawInserted === checkTail.toString(); // if ok, rollback state after tail

                                if (appended && tailDetails.inserted) this.state = beforeTailState;
                            } // revert all if something went wrong


                            if (!appended) {
                                details = new ChangeDetails();
                                this.state = consistentState;
                                if (checkTail && consistentTail) checkTail.state = consistentTail;
                            }
                        }

                        return details;
                    }
                    /** Appends optional placeholder at end */

            }, {
                key: "_appendPlaceholder",
                value: function _appendPlaceholder() {
                        return new ChangeDetails();
                    }
                    /** Appends symbols considering flags */
                    // $FlowFixMe no ideas

            }, {
                key: "append",
                value: function append(str, flags, tail) {
                        if (!isString(str)) throw new Error('value should be string');
                        var details = new ChangeDetails();
                        var checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
                        if (flags.tail) flags._beforeTailState = this.state;

                        for (var ci = 0; ci < str.length; ++ci) {
                            details.aggregate(this._appendChar(str[ci], flags, checkTail));
                        } // append tail but aggregate only tailShift


                        if (checkTail != null) {
                            details.tailShift += this.appendTail(checkTail).tailShift; // TODO it's a good idea to clear state after appending ends
                            // but it causes bugs when one append calls another (when dynamic dispatch set rawInputValue)
                            // this._resetBeforeTailState();
                        }

                        return details;
                    }
                    /** */

            }, {
                key: "remove",
                value: function remove() {
                        var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                        this._value = this.value.slice(0, fromPos) + this.value.slice(toPos);
                        return new ChangeDetails();
                    }
                    /** Calls function and reapplies current value */

            }, {
                key: "withValueRefresh",
                value: function withValueRefresh(fn) {
                        if (this._refreshing || !this.isInitialized) return fn();
                        this._refreshing = true;
                        var rawInput = this.rawInputValue;
                        var value = this.value;
                        var ret = fn();
                        this.rawInputValue = rawInput; // append lost trailing chars at end

                        if (this.value !== value && value.indexOf(this.value) === 0) {
                            this.append(value.slice(this.value.length), {}, '');
                        }

                        delete this._refreshing;
                        return ret;
                    }
                    /** */

            }, {
                key: "runIsolated",
                value: function runIsolated(fn) {
                        if (this._isolated || !this.isInitialized) return fn(this);
                        this._isolated = true;
                        var state = this.state;
                        var ret = fn(this);
                        this.state = state;
                        delete this._isolated;
                        return ret;
                    }
                    /**
                      Prepares string before mask processing
                      @protected
                    */

            }, {
                key: "doPrepare",
                value: function doPrepare(str) {
                        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        return this.prepare ? this.prepare(str, this, flags) : str;
                    }
                    /**
                      Validates if value is acceptable
                      @protected
                    */

            }, {
                key: "doValidate",
                value: function doValidate(flags) {
                        return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
                    }
                    /**
                      Does additional processing in the end of editing
                      @protected
                    */

            }, {
                key: "doCommit",
                value: function doCommit() {
                        if (this.commit) this.commit(this.value, this);
                    }
                    /** */

            }, {
                key: "doFormat",
                value: function doFormat(value) {
                        return this.format ? this.format(value, this) : value;
                    }
                    /** */

            }, {
                key: "doParse",
                value: function doParse(str) {
                        return this.parse ? this.parse(str, this) : str;
                    }
                    /** */

            }, {
                key: "splice",
                value: function splice(start, deleteCount, inserted, removeDirection) {
                    var tailPos = start + deleteCount;
                    var tail = this.extractTail(tailPos);
                    var startChangePos = this.nearestInputPos(start, removeDirection);
                    var changeDetails = new ChangeDetails({
                        tailShift: startChangePos - start // adjust tailShift if start was aligned

                    }).aggregate(this.remove(startChangePos)).aggregate(this.append(inserted, {
                        input: true
                    }, tail));
                    return changeDetails;
                }
            }, {
                key: "state",
                get: function get() {
                    return {
                        _value: this.value
                    };
                },
                set: function set(state) {
                    this._value = state._value;
                }
            }, {
                key: "value",
                get: function get() {
                    return this._value;
                },
                set: function set(value) {
                    this.resolve(value);
                }
            }, {
                key: "unmaskedValue",
                get: function get() {
                    return this.value;
                },
                set: function set(value) {
                        this.reset();
                        this.append(value, {}, '');
                        this.doCommit();
                    }
                    /** */

            }, {
                key: "typedValue",
                get: function get() {
                    return this.doParse(this.value);
                },
                set: function set(value) {
                        this.value = this.doFormat(value);
                    }
                    /** Value that includes raw user input */

            }, {
                key: "rawInputValue",
                get: function get() {
                    return this.extractInput(0, this.value.length, {
                        raw: true
                    });
                },
                set: function set(value) {
                        this.reset();
                        this.append(value, {
                            raw: true
                        }, '');
                        this.doCommit();
                    }
                    /** */

            }, {
                key: "isComplete",
                get: function get() {
                    return true;
                }
            }]);

            return Masked;
        }();
    Masked.DEFAULTS = {
        format: function format(v) {
            return v;
        },
        parse: function parse(v) {
            return v;
        }
    };
    IMask.Masked = Masked;

    /** Get Masked class by mask type */

    function maskedClass(mask) {
        if (mask == null) {
            throw new Error('mask property should be defined');
        } // $FlowFixMe


        if (mask instanceof RegExp) return IMask.MaskedRegExp; // $FlowFixMe

        if (isString(mask)) return IMask.MaskedPattern; // $FlowFixMe

        if (mask instanceof Date || mask === Date) return IMask.MaskedDate; // $FlowFixMe

        if (mask instanceof Number || typeof mask === 'number' || mask === Number) return IMask.MaskedNumber; // $FlowFixMe

        if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic; // $FlowFixMe

        if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask; // $FlowFixMe

        if (mask instanceof Function) return IMask.MaskedFunction; // $FlowFixMe

        if (mask instanceof IMask.Masked) return mask.constructor;
        console.warn('Mask not found for mask', mask); // eslint-disable-line no-console
        // $FlowFixMe

        return IMask.Masked;
    }
    /** Creates new {@link Masked} depending on mask type */

    function createMask(opts) {
        // $FlowFixMe
        if (IMask.Masked && opts instanceof IMask.Masked) return opts;
        opts = Object.assign({}, opts);
        var mask = opts.mask; // $FlowFixMe

        if (IMask.Masked && mask instanceof IMask.Masked) return mask;
        var MaskedClass = maskedClass(mask);
        if (!MaskedClass) throw new Error('Masked class is not found for provided mask, appropriate module needs to be import manually before creating mask.');
        return new MaskedClass(opts);
    }
    IMask.createMask = createMask;

    var DEFAULT_INPUT_DEFINITIONS = {
        '0': /\d/,
        'a': /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        // http://stackoverflow.com/a/22075070
        '*': /./
    };
    /** */

    var PatternInputDefinition =
        /*#__PURE__*/
        function() {
            /** */

            /** */

            /** */

            /** */

            /** */

            /** */
            function PatternInputDefinition(opts) {
                _classCallCheck(this, PatternInputDefinition);

                var mask = opts.mask,
                    blockOpts = _objectWithoutProperties(opts, ["mask"]);

                this.masked = createMask({
                    mask: mask
                });
                Object.assign(this, blockOpts);
            }

            _createClass(PatternInputDefinition, [{
                key: "reset",
                value: function reset() {
                    this._isFilled = false;
                    this.masked.reset();
                }
            }, {
                key: "remove",
                value: function remove() {
                    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

                    if (fromPos === 0 && toPos >= 1) {
                        this._isFilled = false;
                        return this.masked.remove(fromPos, toPos);
                    }

                    return new ChangeDetails();
                }
            }, {
                key: "_appendChar",
                value: function _appendChar(str) {
                    var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    if (this._isFilled) return new ChangeDetails();
                    var state = this.masked.state; // simulate input

                    var details = this.masked._appendChar(str, flags);

                    if (details.inserted && this.doValidate(flags) === false) {
                        details.inserted = details.rawInserted = '';
                        this.masked.state = state;
                    }

                    if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
                        details.inserted = this.placeholderChar;
                    }

                    details.skip = !details.inserted && !this.isOptional;
                    this._isFilled = Boolean(details.inserted);
                    return details;
                }
            }, {
                key: "append",
                value: function append() {
                    var _this$masked;

                    return (_this$masked = this.masked).append.apply(_this$masked, arguments);
                }
            }, {
                key: "_appendPlaceholder",
                value: function _appendPlaceholder() {
                    var details = new ChangeDetails();
                    if (this._isFilled || this.isOptional) return details;
                    this._isFilled = true;
                    details.inserted = this.placeholderChar;
                    return details;
                }
            }, {
                key: "extractTail",
                value: function extractTail() {
                    var _this$masked2;

                    return (_this$masked2 = this.masked).extractTail.apply(_this$masked2, arguments);
                }
            }, {
                key: "appendTail",
                value: function appendTail() {
                    var _this$masked3;

                    return (_this$masked3 = this.masked).appendTail.apply(_this$masked3, arguments);
                }
            }, {
                key: "extractInput",
                value: function extractInput() {
                    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                    var flags = arguments.length > 2 ? arguments[2] : undefined;
                    return this.masked.extractInput(fromPos, toPos, flags);
                }
            }, {
                key: "nearestInputPos",
                value: function nearestInputPos(cursorPos) {
                    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
                    var minPos = 0;
                    var maxPos = this.value.length;
                    var boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);

                    switch (direction) {
                        case DIRECTION.LEFT:
                        case DIRECTION.FORCE_LEFT:
                            return this.isComplete ? boundPos : minPos;

                        case DIRECTION.RIGHT:
                        case DIRECTION.FORCE_RIGHT:
                            return this.isComplete ? boundPos : maxPos;

                        case DIRECTION.NONE:
                        default:
                            return boundPos;
                    }
                }
            }, {
                key: "doValidate",
                value: function doValidate() {
                    var _this$masked4, _this$parent;

                    return (_this$masked4 = this.masked).doValidate.apply(_this$masked4, arguments) && (!this.parent || (_this$parent = this.parent).doValidate.apply(_this$parent, arguments));
                }
            }, {
                key: "doCommit",
                value: function doCommit() {
                    this.masked.doCommit();
                }
            }, {
                key: "value",
                get: function get() {
                    return this.masked.value || (this._isFilled && !this.isOptional ? this.placeholderChar : '');
                }
            }, {
                key: "unmaskedValue",
                get: function get() {
                    return this.masked.unmaskedValue;
                }
            }, {
                key: "isComplete",
                get: function get() {
                    return Boolean(this.masked.value) || this.isOptional;
                }
            }, {
                key: "state",
                get: function get() {
                    return {
                        masked: this.masked.state,
                        _isFilled: this._isFilled
                    };
                },
                set: function set(state) {
                    this.masked.state = state.masked;
                    this._isFilled = state._isFilled;
                }
            }]);

            return PatternInputDefinition;
        }();

    var PatternFixedDefinition =
        /*#__PURE__*/
        function() {
            /** */

            /** */

            /** */

            /** */
            function PatternFixedDefinition(opts) {
                _classCallCheck(this, PatternFixedDefinition);

                Object.assign(this, opts);
                this._value = '';
            }

            _createClass(PatternFixedDefinition, [{
                key: "reset",
                value: function reset() {
                    this._isRawInput = false;
                    this._value = '';
                }
            }, {
                key: "remove",
                value: function remove() {
                    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
                    this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
                    if (!this._value) this._isRawInput = false;
                    return new ChangeDetails();
                }
            }, {
                key: "nearestInputPos",
                value: function nearestInputPos(cursorPos) {
                    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
                    var minPos = 0;
                    var maxPos = this._value.length;

                    switch (direction) {
                        case DIRECTION.LEFT:
                        case DIRECTION.FORCE_LEFT:
                            return minPos;

                        case DIRECTION.NONE:
                        case DIRECTION.RIGHT:
                        case DIRECTION.FORCE_RIGHT:
                        default:
                            return maxPos;
                    }
                }
            }, {
                key: "extractInput",
                value: function extractInput() {
                    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._value.length;
                    var flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                    return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || '';
                }
            }, {
                key: "_appendChar",
                value: function _appendChar(str) {
                    var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    var details = new ChangeDetails();
                    if (this._value) return details;
                    var appended = this.char === str[0];
                    var isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && !flags.tail;
                    if (isResolved) details.rawInserted = this.char;
                    this._value = details.inserted = this.char;
                    this._isRawInput = isResolved && (flags.raw || flags.input);
                    return details;
                }
            }, {
                key: "_appendPlaceholder",
                value: function _appendPlaceholder() {
                    var details = new ChangeDetails();
                    if (this._value) return details;
                    this._value = details.inserted = this.char;
                    return details;
                }
            }, {
                key: "extractTail",
                value: function extractTail() {
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                        return new ContinuousTailDetails('');
                    } // $FlowFixMe no ideas

            }, {
                key: "appendTail",
                value: function appendTail(tail) {
                    if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
                    return tail.appendTo(this);
                }
            }, {
                key: "append",
                value: function append(str, flags, tail) {
                    var details = this._appendChar(str, flags);

                    if (tail != null) {
                        details.tailShift += this.appendTail(tail).tailShift;
                    }

                    return details;
                }
            }, {
                key: "doCommit",
                value: function doCommit() {}
            }, {
                key: "value",
                get: function get() {
                    return this._value;
                }
            }, {
                key: "unmaskedValue",
                get: function get() {
                    return this.isUnmasking ? this.value : '';
                }
            }, {
                key: "isComplete",
                get: function get() {
                    return true;
                }
            }, {
                key: "state",
                get: function get() {
                    return {
                        _value: this._value,
                        _isRawInput: this._isRawInput
                    };
                },
                set: function set(state) {
                    Object.assign(this, state);
                }
            }]);

            return PatternFixedDefinition;
        }();

    var ChunksTailDetails =
        /*#__PURE__*/
        function() {
            /** */
            function ChunksTailDetails() {
                var chunks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                _classCallCheck(this, ChunksTailDetails);

                this.chunks = chunks;
                this.from = from;
            }

            _createClass(ChunksTailDetails, [{
                key: "toString",
                value: function toString() {
                        return this.chunks.map(String).join('');
                    } // $FlowFixMe no ideas

            }, {
                key: "extend",
                value: function extend(tailChunk) {
                    if (!String(tailChunk)) return;
                    if (isString(tailChunk)) tailChunk = new ContinuousTailDetails(String(tailChunk));
                    var lastChunk = this.chunks[this.chunks.length - 1];
                    var extendLast = lastChunk && ( // if stops are same or tail has no stop
                            lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
                        tailChunk.from === lastChunk.from + lastChunk.toString().length;

                    if (tailChunk instanceof ContinuousTailDetails) {
                        // check the ability to extend previous chunk
                        if (extendLast) {
                            // extend previous chunk
                            lastChunk.extend(tailChunk.toString());
                        } else {
                            // append new chunk
                            this.chunks.push(tailChunk);
                        }
                    } else if (tailChunk instanceof ChunksTailDetails) {
                        if (tailChunk.stop == null) {
                            // unwrap floating chunks to parent, keeping `from` pos
                            var firstTailChunk;

                            while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
                                firstTailChunk = tailChunk.chunks.shift();
                                firstTailChunk.from += tailChunk.from;
                                this.extend(firstTailChunk);
                            }
                        } // if tail chunk still has value


                        if (tailChunk.toString()) {
                            // if chunks contains stops, then popup stop to container
                            tailChunk.stop = tailChunk.blockIndex;
                            this.chunks.push(tailChunk);
                        }
                    }
                }
            }, {
                key: "appendTo",
                value: function appendTo(masked) {
                    // $FlowFixMe
                    if (!(masked instanceof IMask.MaskedPattern)) {
                        var tail = new ContinuousTailDetails(this.toString());
                        return tail.appendTo(masked);
                    }

                    var details = new ChangeDetails();

                    for (var ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
                        var chunk = this.chunks[ci];

                        var lastBlockIter = masked._mapPosToBlock(masked.value.length);

                        var stop = chunk.stop;
                        var chunkBlock = void 0;

                        if (stop != null && ( // if block not found or stop is behind lastBlock
                                !lastBlockIter || lastBlockIter.index <= stop)) {
                            if (chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
                                masked._stops.indexOf(stop) >= 0) {
                                details.aggregate(masked._appendPlaceholder(stop));
                            }

                            chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
                        }

                        if (chunkBlock) {
                            var tailDetails = chunkBlock.appendTail(chunk);
                            tailDetails.skip = false; // always ignore skip, it will be set on last

                            details.aggregate(tailDetails);
                            masked._value += tailDetails.inserted; // get not inserted chars

                            var remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
                            if (remainChars) details.aggregate(masked.append(remainChars, {
                                tail: true
                            }));
                        } else {
                            details.aggregate(masked.append(chunk.toString(), {
                                tail: true
                            }));
                        }
                    }
                    return details;
                }
            }, {
                key: "shiftBefore",
                value: function shiftBefore(pos) {
                    if (this.from >= pos || !this.chunks.length) return '';
                    var chunkShiftPos = pos - this.from;
                    var ci = 0;

                    while (ci < this.chunks.length) {
                        var chunk = this.chunks[ci];
                        var shiftChar = chunk.shiftBefore(chunkShiftPos);

                        if (chunk.toString()) {
                            // chunk still contains value
                            // but not shifted - means no more available chars to shift
                            if (!shiftChar) break;
                            ++ci;
                        } else {
                            // clean if chunk has no value
                            this.chunks.splice(ci, 1);
                        }

                        if (shiftChar) return shiftChar;
                    }

                    return '';
                }
            }, {
                key: "state",
                get: function get() {
                    return {
                        chunks: this.chunks.map(function(c) {
                            return c.state;
                        }),
                        from: this.from,
                        stop: this.stop,
                        blockIndex: this.blockIndex
                    };
                },
                set: function set(state) {
                    var chunks = state.chunks,
                        props = _objectWithoutProperties(state, ["chunks"]);

                    Object.assign(this, props);
                    this.chunks = chunks.map(function(cstate) {
                        var chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails(); // $FlowFixMe already checked above

                        chunk.state = cstate;
                        return chunk;
                    });
                }
            }]);

            return ChunksTailDetails;
        }();

    /** Masking by RegExp */

    var MaskedRegExp =
        /*#__PURE__*/
        function(_Masked) {
            _inherits(MaskedRegExp, _Masked);

            function MaskedRegExp() {
                _classCallCheck(this, MaskedRegExp);

                return _possibleConstructorReturn(this, _getPrototypeOf(MaskedRegExp).apply(this, arguments));
            }

            _createClass(MaskedRegExp, [{
                key: "_update",

                /**
                  @override
                  @param {Object} opts
                */
                value: function _update(opts) {
                    if (opts.mask) opts.validate = function(value) {
                        return value.search(opts.mask) >= 0;
                    };

                    _get(_getPrototypeOf(MaskedRegExp.prototype), "_update", this).call(this, opts);
                }
            }]);

            return MaskedRegExp;
        }(Masked);
    IMask.MaskedRegExp = MaskedRegExp;

    /**
      Pattern mask
      @param {Object} opts
      @param {Object} opts.blocks
      @param {Object} opts.definitions
      @param {string} opts.placeholderChar
      @param {boolean} opts.lazy
    */
    var MaskedPattern =
        /*#__PURE__*/
        function(_Masked) {
            _inherits(MaskedPattern, _Masked);

            /** */

            /** */

            /** Single char for empty input */

            /** Show placeholder only when needed */
            function MaskedPattern() {
                var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                _classCallCheck(this, MaskedPattern);

                // TODO type $Shape<MaskedPatternOptions>={} does not work
                opts.definitions = Object.assign({}, DEFAULT_INPUT_DEFINITIONS, opts.definitions);
                return _possibleConstructorReturn(this, _getPrototypeOf(MaskedPattern).call(this, Object.assign({}, MaskedPattern.DEFAULTS, {}, opts)));
            }
            /**
              @override
              @param {Object} opts
            */


            _createClass(MaskedPattern, [{
                key: "_update",
                value: function _update() {
                        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        opts.definitions = Object.assign({}, this.definitions, opts.definitions);

                        _get(_getPrototypeOf(MaskedPattern.prototype), "_update", this).call(this, opts);

                        this._rebuildMask();
                    }
                    /** */

            }, {
                key: "_rebuildMask",
                value: function _rebuildMask() {
                        var _this = this;

                        var defs = this.definitions;
                        this._blocks = [];
                        this._stops = [];
                        this._maskedBlocks = {};
                        var pattern = this.mask;
                        if (!pattern || !defs) return;
                        var unmaskingBlock = false;
                        var optionalBlock = false;

                        for (var i = 0; i < pattern.length; ++i) {
                            if (this.blocks) {
                                var _ret = function() {
                                    var p = pattern.slice(i);
                                    var bNames = Object.keys(_this.blocks).filter(function(bName) {
                                        return p.indexOf(bName) === 0;
                                    }); // order by key length

                                    bNames.sort(function(a, b) {
                                        return b.length - a.length;
                                    }); // use block name with max length

                                    var bName = bNames[0];

                                    if (bName) {
                                        var maskedBlock = createMask(Object.assign({
                                            parent: _this,
                                            lazy: _this.lazy,
                                            placeholderChar: _this.placeholderChar,
                                            overwrite: _this.overwrite
                                        }, _this.blocks[bName]));

                                        if (maskedBlock) {
                                            _this._blocks.push(maskedBlock); // store block index


                                            if (!_this._maskedBlocks[bName]) _this._maskedBlocks[bName] = [];

                                            _this._maskedBlocks[bName].push(_this._blocks.length - 1);
                                        }

                                        i += bName.length - 1;
                                        return "continue";
                                    }
                                }();

                                if (_ret === "continue") continue;
                            }

                            var char = pattern[i];

                            var _isInput = char in defs;

                            if (char === MaskedPattern.STOP_CHAR) {
                                this._stops.push(this._blocks.length);

                                continue;
                            }

                            if (char === '{' || char === '}') {
                                unmaskingBlock = !unmaskingBlock;
                                continue;
                            }

                            if (char === '[' || char === ']') {
                                optionalBlock = !optionalBlock;
                                continue;
                            }

                            if (char === MaskedPattern.ESCAPE_CHAR) {
                                ++i;
                                char = pattern[i];
                                if (!char) break;
                                _isInput = false;
                            }

                            var def = _isInput ? new PatternInputDefinition({
                                parent: this,
                                lazy: this.lazy,
                                placeholderChar: this.placeholderChar,
                                mask: defs[char],
                                isOptional: optionalBlock
                            }) : new PatternFixedDefinition({
                                char: char,
                                isUnmasking: unmaskingBlock
                            });

                            this._blocks.push(def);
                        }
                    }
                    /**
                      @override
                    */

            }, {
                key: "reset",

                /**
                  @override
                */
                value: function reset() {
                        _get(_getPrototypeOf(MaskedPattern.prototype), "reset", this).call(this);

                        this._blocks.forEach(function(b) {
                            return b.reset();
                        });
                    }
                    /**
                      @override
                    */

            }, {
                key: "doCommit",

                /**
                  @override
                */
                value: function doCommit() {
                        this._blocks.forEach(function(b) {
                            return b.doCommit();
                        });

                        _get(_getPrototypeOf(MaskedPattern.prototype), "doCommit", this).call(this);
                    }
                    /**
                      @override
                    */

            }, {
                key: "appendTail",

                /**
                  @override
                */
                value: function appendTail(tail) {
                        return _get(_getPrototypeOf(MaskedPattern.prototype), "appendTail", this).call(this, tail).aggregate(this._appendPlaceholder());
                    }
                    /**
                      @override
                    */

            }, {
                key: "_appendCharRaw",
                value: function _appendCharRaw(ch) {
                        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        ch = this.doPrepare(ch, flags);

                        var blockIter = this._mapPosToBlock(this.value.length);

                        var details = new ChangeDetails();
                        if (!blockIter) return details;

                        for (var bi = blockIter.index;; ++bi) {
                            var _block = this._blocks[bi];
                            if (!_block) break;

                            var blockDetails = _block._appendChar(ch, flags);

                            var skip = blockDetails.skip;
                            details.aggregate(blockDetails);
                            if (skip || blockDetails.rawInserted) break; // go next char
                        }

                        return details;
                    }
                    /**
                      @override
                    */

            }, {
                key: "extractTail",
                value: function extractTail() {
                        var _this2 = this;

                        var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                        var chunkTail = new ChunksTailDetails();
                        if (fromPos === toPos) return chunkTail;

                        this._forEachBlocksInRange(fromPos, toPos, function(b, bi, bFromPos, bToPos) {
                            var blockChunk = b.extractTail(bFromPos, bToPos);
                            blockChunk.stop = _this2._findStopBefore(bi);
                            blockChunk.from = _this2._blockStartPos(bi);
                            if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
                            chunkTail.extend(blockChunk);
                        });

                        return chunkTail;
                    }
                    /**
                      @override
                    */

            }, {
                key: "extractInput",
                value: function extractInput() {
                    var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                    var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                    var flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                    if (fromPos === toPos) return '';
                    var input = '';

                    this._forEachBlocksInRange(fromPos, toPos, function(b, _, fromPos, toPos) {
                        input += b.extractInput(fromPos, toPos, flags);
                    });

                    return input;
                }
            }, {
                key: "_findStopBefore",
                value: function _findStopBefore(blockIndex) {
                        var stopBefore;

                        for (var si = 0; si < this._stops.length; ++si) {
                            var stop = this._stops[si];
                            if (stop <= blockIndex) stopBefore = stop;
                            else break;
                        }

                        return stopBefore;
                    }
                    /** Appends placeholder depending on laziness */

            }, {
                key: "_appendPlaceholder",
                value: function _appendPlaceholder(toBlockIndex) {
                        var _this3 = this;

                        var details = new ChangeDetails();
                        if (this.lazy && toBlockIndex == null) return details;

                        var startBlockIter = this._mapPosToBlock(this.value.length);

                        if (!startBlockIter) return details;
                        var startBlockIndex = startBlockIter.index;
                        var endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;

                        this._blocks.slice(startBlockIndex, endBlockIndex).forEach(function(b) {
                            if (!b.lazy || toBlockIndex != null) {
                                // $FlowFixMe `_blocks` may not be present
                                var args = b._blocks != null ? [b._blocks.length] : [];

                                var bDetails = b._appendPlaceholder.apply(b, args);

                                _this3._value += bDetails.inserted;
                                details.aggregate(bDetails);
                            }
                        });

                        return details;
                    }
                    /** Finds block in pos */

            }, {
                key: "_mapPosToBlock",
                value: function _mapPosToBlock(pos) {
                        var accVal = '';

                        for (var bi = 0; bi < this._blocks.length; ++bi) {
                            var _block2 = this._blocks[bi];
                            var blockStartPos = accVal.length;
                            accVal += _block2.value;

                            if (pos <= accVal.length) {
                                return {
                                    index: bi,
                                    offset: pos - blockStartPos
                                };
                            }
                        }
                    }
                    /** */

            }, {
                key: "_blockStartPos",
                value: function _blockStartPos(blockIndex) {
                        return this._blocks.slice(0, blockIndex).reduce(function(pos, b) {
                            return pos += b.value.length;
                        }, 0);
                    }
                    /** */

            }, {
                key: "_forEachBlocksInRange",
                value: function _forEachBlocksInRange(fromPos) {
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                        var fn = arguments.length > 2 ? arguments[2] : undefined;

                        var fromBlockIter = this._mapPosToBlock(fromPos);

                        if (fromBlockIter) {
                            var toBlockIter = this._mapPosToBlock(toPos); // process first block


                            var isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
                            var fromBlockStartPos = fromBlockIter.offset;
                            var fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].value.length;
                            fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);

                            if (toBlockIter && !isSameBlock) {
                                // process intermediate blocks
                                for (var bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
                                    fn(this._blocks[bi], bi, 0, this._blocks[bi].value.length);
                                } // process last block


                                fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
                            }
                        }
                    }
                    /**
                      @override
                    */

            }, {
                key: "remove",
                value: function remove() {
                        var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

                        var removeDetails = _get(_getPrototypeOf(MaskedPattern.prototype), "remove", this).call(this, fromPos, toPos);

                        this._forEachBlocksInRange(fromPos, toPos, function(b, _, bFromPos, bToPos) {
                            removeDetails.aggregate(b.remove(bFromPos, bToPos));
                        });

                        return removeDetails;
                    }
                    /**
                      @override
                    */

            }, {
                key: "nearestInputPos",
                value: function nearestInputPos(cursorPos) {
                        var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DIRECTION.NONE;
                        // TODO refactor - extract alignblock
                        var beginBlockData = this._mapPosToBlock(cursorPos) || {
                            index: 0,
                            offset: 0
                        };
                        var beginBlockOffset = beginBlockData.offset,
                            beginBlockIndex = beginBlockData.index;
                        var beginBlock = this._blocks[beginBlockIndex];
                        if (!beginBlock) return cursorPos;
                        var beginBlockCursorPos = beginBlockOffset; // if position inside block - try to adjust it

                        if (beginBlockCursorPos !== 0 && beginBlockCursorPos < beginBlock.value.length) {
                            beginBlockCursorPos = beginBlock.nearestInputPos(beginBlockOffset, forceDirection(direction));
                        }

                        var cursorAtRight = beginBlockCursorPos === beginBlock.value.length;
                        var cursorAtLeft = beginBlockCursorPos === 0; //  cursor is INSIDE first block (not at bounds)

                        if (!cursorAtLeft && !cursorAtRight) return this._blockStartPos(beginBlockIndex) + beginBlockCursorPos;
                        var searchBlockIndex = cursorAtRight ? beginBlockIndex + 1 : beginBlockIndex;

                        if (direction === DIRECTION.NONE) {
                            // NONE direction used to calculate start input position if no chars were removed
                            // FOR NONE:
                            // -
                            // input|any
                            // ->
                            //  any|input
                            // <-
                            //  filled-input|any
                            // check if first block at left is input
                            if (searchBlockIndex > 0) {
                                var blockIndexAtLeft = searchBlockIndex - 1;
                                var blockAtLeft = this._blocks[blockIndexAtLeft];
                                var blockInputPos = blockAtLeft.nearestInputPos(0, DIRECTION.NONE); // is input

                                if (!blockAtLeft.value.length || blockInputPos !== blockAtLeft.value.length) {
                                    return this._blockStartPos(searchBlockIndex);
                                }
                            } // ->


                            var firstInputAtRight = searchBlockIndex;

                            for (var bi = firstInputAtRight; bi < this._blocks.length; ++bi) {
                                var blockAtRight = this._blocks[bi];

                                var _blockInputPos = blockAtRight.nearestInputPos(0, DIRECTION.NONE);

                                if (!blockAtRight.value.length || _blockInputPos !== blockAtRight.value.length) {
                                    return this._blockStartPos(bi) + _blockInputPos;
                                }
                            } // <-
                            // find first non-fixed symbol


                            for (var _bi = searchBlockIndex - 1; _bi >= 0; --_bi) {
                                var _block3 = this._blocks[_bi];

                                var _blockInputPos2 = _block3.nearestInputPos(0, DIRECTION.NONE); // is input


                                if (!_block3.value.length || _blockInputPos2 !== _block3.value.length) {
                                    return this._blockStartPos(_bi) + _block3.value.length;
                                }
                            }

                            return cursorPos;
                        }

                        if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
                            // -
                            //  any|filled-input
                            // <-
                            //  any|first not empty is not-len-aligned
                            //  not-0-aligned|any
                            // ->
                            //  any|not-len-aligned or end
                            // check if first block at right is filled input
                            var firstFilledBlockIndexAtRight;

                            for (var _bi2 = searchBlockIndex; _bi2 < this._blocks.length; ++_bi2) {
                                if (this._blocks[_bi2].value) {
                                    firstFilledBlockIndexAtRight = _bi2;
                                    break;
                                }
                            }

                            if (firstFilledBlockIndexAtRight != null) {
                                var filledBlock = this._blocks[firstFilledBlockIndexAtRight];

                                var _blockInputPos3 = filledBlock.nearestInputPos(0, DIRECTION.RIGHT);

                                if (_blockInputPos3 === 0 && filledBlock.unmaskedValue.length) {
                                    // filled block is input
                                    return this._blockStartPos(firstFilledBlockIndexAtRight) + _blockInputPos3;
                                }
                            } // <-
                            // find this vars


                            var firstFilledInputBlockIndex = -1;
                            var firstEmptyInputBlockIndex; // TODO consider nested empty inputs

                            for (var _bi3 = searchBlockIndex - 1; _bi3 >= 0; --_bi3) {
                                var _block4 = this._blocks[_bi3];

                                var _blockInputPos4 = _block4.nearestInputPos(_block4.value.length, DIRECTION.FORCE_LEFT);

                                if (!_block4.value || _blockInputPos4 !== 0) firstEmptyInputBlockIndex = _bi3;

                                if (_blockInputPos4 !== 0) {
                                    if (_blockInputPos4 !== _block4.value.length) {
                                        // aligned inside block - return immediately
                                        return this._blockStartPos(_bi3) + _blockInputPos4;
                                    } else {
                                        // found filled
                                        firstFilledInputBlockIndex = _bi3;
                                        break;
                                    }
                                }
                            }

                            if (direction === DIRECTION.LEFT) {
                                // try find first empty input before start searching position only when not forced
                                for (var _bi4 = firstFilledInputBlockIndex + 1; _bi4 <= Math.min(searchBlockIndex, this._blocks.length - 1); ++_bi4) {
                                    var _block5 = this._blocks[_bi4];

                                    var _blockInputPos5 = _block5.nearestInputPos(0, DIRECTION.NONE);

                                    var blockAlignedPos = this._blockStartPos(_bi4) + _blockInputPos5;

                                    if (blockAlignedPos > cursorPos) break; // if block is not lazy input

                                    if (_blockInputPos5 !== _block5.value.length) return blockAlignedPos;
                                }
                            } // process overflow


                            if (firstFilledInputBlockIndex >= 0) {
                                return this._blockStartPos(firstFilledInputBlockIndex) + this._blocks[firstFilledInputBlockIndex].value.length;
                            } // for lazy if has aligned left inside fixed and has came to the start - use start position


                            if (direction === DIRECTION.FORCE_LEFT || this.lazy && !this.extractInput() && !isInput(this._blocks[searchBlockIndex])) {
                                return 0;
                            }

                            if (firstEmptyInputBlockIndex != null) {
                                return this._blockStartPos(firstEmptyInputBlockIndex);
                            } // find first input


                            for (var _bi5 = searchBlockIndex; _bi5 < this._blocks.length; ++_bi5) {
                                var _block6 = this._blocks[_bi5];

                                var _blockInputPos6 = _block6.nearestInputPos(0, DIRECTION.NONE); // is input


                                if (!_block6.value.length || _blockInputPos6 !== _block6.value.length) {
                                    return this._blockStartPos(_bi5) + _blockInputPos6;
                                }
                            }

                            return 0;
                        }

                        if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
                            // ->
                            //  any|not-len-aligned and filled
                            //  any|not-len-aligned
                            // <-
                            //  not-0-aligned or start|any
                            var firstInputBlockAlignedIndex;
                            var firstInputBlockAlignedPos;

                            for (var _bi6 = searchBlockIndex; _bi6 < this._blocks.length; ++_bi6) {
                                var _block7 = this._blocks[_bi6];

                                var _blockInputPos7 = _block7.nearestInputPos(0, DIRECTION.NONE);

                                if (_blockInputPos7 !== _block7.value.length) {
                                    firstInputBlockAlignedPos = this._blockStartPos(_bi6) + _blockInputPos7;
                                    firstInputBlockAlignedIndex = _bi6;
                                    break;
                                }
                            }

                            if (firstInputBlockAlignedIndex != null && firstInputBlockAlignedPos != null) {
                                for (var _bi7 = firstInputBlockAlignedIndex; _bi7 < this._blocks.length; ++_bi7) {
                                    var _block8 = this._blocks[_bi7];

                                    var _blockInputPos8 = _block8.nearestInputPos(0, DIRECTION.FORCE_RIGHT);

                                    if (_blockInputPos8 !== _block8.value.length) {
                                        return this._blockStartPos(_bi7) + _blockInputPos8;
                                    }
                                }

                                return direction === DIRECTION.FORCE_RIGHT ? this.value.length : firstInputBlockAlignedPos;
                            }

                            for (var _bi8 = Math.min(searchBlockIndex, this._blocks.length - 1); _bi8 >= 0; --_bi8) {
                                var _block9 = this._blocks[_bi8];

                                var _blockInputPos9 = _block9.nearestInputPos(_block9.value.length, DIRECTION.LEFT);

                                if (_blockInputPos9 !== 0) {
                                    var alignedPos = this._blockStartPos(_bi8) + _blockInputPos9;

                                    if (alignedPos >= cursorPos) return alignedPos;
                                    break;
                                }
                            }
                        }

                        return cursorPos;
                    }
                    /** Get block by name */

            }, {
                key: "maskedBlock",
                value: function maskedBlock(name) {
                        return this.maskedBlocks(name)[0];
                    }
                    /** Get all blocks by name */

            }, {
                key: "maskedBlocks",
                value: function maskedBlocks(name) {
                    var _this4 = this;

                    var indices = this._maskedBlocks[name];
                    if (!indices) return [];
                    return indices.map(function(gi) {
                        return _this4._blocks[gi];
                    });
                }
            }, {
                key: "state",
                get: function get() {
                    return Object.assign({}, _get(_getPrototypeOf(MaskedPattern.prototype), "state", this), {
                        _blocks: this._blocks.map(function(b) {
                            return b.state;
                        })
                    });
                },
                set: function set(state) {
                    var _blocks = state._blocks,
                        maskedState = _objectWithoutProperties(state, ["_blocks"]);

                    this._blocks.forEach(function(b, bi) {
                        return b.state = _blocks[bi];
                    });

                    _set(_getPrototypeOf(MaskedPattern.prototype), "state", maskedState, this, true);
                }
            }, {
                key: "isComplete",
                get: function get() {
                    return this._blocks.every(function(b) {
                        return b.isComplete;
                    });
                }
            }, {
                key: "unmaskedValue",
                get: function get() {
                    return this._blocks.reduce(function(str, b) {
                        return str += b.unmaskedValue;
                    }, '');
                },
                set: function set(unmaskedValue) {
                        _set(_getPrototypeOf(MaskedPattern.prototype), "unmaskedValue", unmaskedValue, this, true);
                    }
                    /**
                      @override
                    */

            }, {
                key: "value",
                get: function get() {
                    // TODO return _value when not in change?
                    return this._blocks.reduce(function(str, b) {
                        return str += b.value;
                    }, '');
                },
                set: function set(value) {
                    _set(_getPrototypeOf(MaskedPattern.prototype), "value", value, this, true);
                }
            }]);

            return MaskedPattern;
        }(Masked);
    MaskedPattern.DEFAULTS = {
        lazy: true,
        placeholderChar: '_'
    };
    MaskedPattern.STOP_CHAR = '`';
    MaskedPattern.ESCAPE_CHAR = '\\';
    MaskedPattern.InputDefinition = PatternInputDefinition;
    MaskedPattern.FixedDefinition = PatternFixedDefinition;

    function isInput(block) {
        if (!block) return false;
        var value = block.value;
        return !value || block.nearestInputPos(0, DIRECTION.NONE) !== value.length;
    }

    IMask.MaskedPattern = MaskedPattern;

    /** Pattern which accepts ranges */

    var MaskedRange =
        /*#__PURE__*/
        function(_MaskedPattern) {
            _inherits(MaskedRange, _MaskedPattern);

            function MaskedRange() {
                _classCallCheck(this, MaskedRange);

                return _possibleConstructorReturn(this, _getPrototypeOf(MaskedRange).apply(this, arguments));
            }

            _createClass(MaskedRange, [{
                key: "_update",

                /**
                  @override
                */
                value: function _update(opts) {
                        // TODO type
                        opts = Object.assign({
                            to: this.to || 0,
                            from: this.from || 0
                        }, opts);
                        var maxLength = String(opts.to).length;
                        if (opts.maxLength != null) maxLength = Math.max(maxLength, opts.maxLength);
                        opts.maxLength = maxLength;
                        var fromStr = String(opts.from).padStart(maxLength, '0');
                        var toStr = String(opts.to).padStart(maxLength, '0');
                        var sameCharsCount = 0;

                        while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) {
                            ++sameCharsCount;
                        }

                        opts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, '\\0') + '0'.repeat(maxLength - sameCharsCount);

                        _get(_getPrototypeOf(MaskedRange.prototype), "_update", this).call(this, opts);
                    }
                    /**
                      @override
                    */

            }, {
                key: "boundaries",
                value: function boundaries(str) {
                        var minstr = '';
                        var maxstr = '';

                        var _ref = str.match(/^(\D*)(\d*)(\D*)/) || [],
                            _ref2 = _slicedToArray(_ref, 3),
                            placeholder = _ref2[1],
                            num = _ref2[2];

                        if (num) {
                            minstr = '0'.repeat(placeholder.length) + num;
                            maxstr = '9'.repeat(placeholder.length) + num;
                        }

                        minstr = minstr.padEnd(this.maxLength, '0');
                        maxstr = maxstr.padEnd(this.maxLength, '9');
                        return [minstr, maxstr];
                    }
                    /**
                      @override
                    */

            }, {
                key: "doPrepare",
                value: function doPrepare(str) {
                        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        str = _get(_getPrototypeOf(MaskedRange.prototype), "doPrepare", this).call(this, str, flags).replace(/\D/g, '');
                        if (!this.autofix) return str;
                        var fromStr = String(this.from).padStart(this.maxLength, '0');
                        var toStr = String(this.to).padStart(this.maxLength, '0');
                        var val = this.value;
                        var prepStr = '';

                        for (var ci = 0; ci < str.length; ++ci) {
                            var nextVal = val + prepStr + str[ci];

                            var _this$boundaries = this.boundaries(nextVal),
                                _this$boundaries2 = _slicedToArray(_this$boundaries, 2),
                                minstr = _this$boundaries2[0],
                                maxstr = _this$boundaries2[1];

                            if (Number(maxstr) < this.from) prepStr += fromStr[nextVal.length - 1];
                            else if (Number(minstr) > this.to) prepStr += toStr[nextVal.length - 1];
                            else prepStr += str[ci];
                        }

                        return prepStr;
                    }
                    /**
                      @override
                    */

            }, {
                key: "doValidate",
                value: function doValidate() {
                    var _get2;

                    var str = this.value;
                    var firstNonZero = str.search(/[^0]/);
                    if (firstNonZero === -1 && str.length <= this._matchFrom) return true;

                    var _this$boundaries3 = this.boundaries(str),
                        _this$boundaries4 = _slicedToArray(_this$boundaries3, 2),
                        minstr = _this$boundaries4[0],
                        maxstr = _this$boundaries4[1];

                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    return this.from <= Number(maxstr) && Number(minstr) <= this.to && (_get2 = _get(_getPrototypeOf(MaskedRange.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args));
                }
            }, {
                key: "_matchFrom",

                /**
                  Optionally sets max length of pattern.
                  Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
                */

                /** Min bound */

                /** Max bound */

                /** */
                get: function get() {
                    return this.maxLength - String(this.from).length;
                }
            }, {
                key: "isComplete",
                get: function get() {
                    return _get(_getPrototypeOf(MaskedRange.prototype), "isComplete", this) && Boolean(this.value);
                }
            }]);

            return MaskedRange;
        }(MaskedPattern);
    IMask.MaskedRange = MaskedRange;

    /** Date mask */

    var MaskedDate =
        /*#__PURE__*/
        function(_MaskedPattern) {
            _inherits(MaskedDate, _MaskedPattern);

            /** Pattern mask for date according to {@link MaskedDate#format} */

            /** Start date */

            /** End date */

            /** */

            /**
              @param {Object} opts
            */
            function MaskedDate(opts) {
                _classCallCheck(this, MaskedDate);

                return _possibleConstructorReturn(this, _getPrototypeOf(MaskedDate).call(this, Object.assign({}, MaskedDate.DEFAULTS, {}, opts)));
            }
            /**
              @override
            */


            _createClass(MaskedDate, [{
                key: "_update",
                value: function _update(opts) {
                        if (opts.mask === Date) delete opts.mask;
                        if (opts.pattern) opts.mask = opts.pattern;
                        var blocks = opts.blocks;
                        opts.blocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS()); // adjust year block

                        if (opts.min) opts.blocks.Y.from = opts.min.getFullYear();
                        if (opts.max) opts.blocks.Y.to = opts.max.getFullYear();

                        if (opts.min && opts.max && opts.blocks.Y.from === opts.blocks.Y.to) {
                            opts.blocks.m.from = opts.min.getMonth() + 1;
                            opts.blocks.m.to = opts.max.getMonth() + 1;

                            if (opts.blocks.m.from === opts.blocks.m.to) {
                                opts.blocks.d.from = opts.min.getDate();
                                opts.blocks.d.to = opts.max.getDate();
                            }
                        }

                        Object.assign(opts.blocks, blocks); // add autofix

                        Object.keys(opts.blocks).forEach(function(bk) {
                            var b = opts.blocks[bk];
                            if (!('autofix' in b)) b.autofix = opts.autofix;
                        });

                        _get(_getPrototypeOf(MaskedDate.prototype), "_update", this).call(this, opts);
                    }
                    /**
                      @override
                    */

            }, {
                key: "doValidate",
                value: function doValidate() {
                        var _get2;

                        var date = this.date;

                        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        return (_get2 = _get(_getPrototypeOf(MaskedDate.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args)) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
                    }
                    /** Checks if date is exists */

            }, {
                key: "isDateExist",
                value: function isDateExist(str) {
                        return this.format(this.parse(str, this), this).indexOf(str) >= 0;
                    }
                    /** Parsed Date */

            }, {
                key: "date",
                get: function get() {
                    return this.typedValue;
                },
                set: function set(date) {
                        this.typedValue = date;
                    }
                    /**
                      @override
                    */

            }, {
                key: "typedValue",
                get: function get() {
                    return this.isComplete ? _get(_getPrototypeOf(MaskedDate.prototype), "typedValue", this) : null;
                },
                set: function set(value) {
                    _set(_getPrototypeOf(MaskedDate.prototype), "typedValue", value, this, true);
                }
            }]);

            return MaskedDate;
        }(MaskedPattern);
    MaskedDate.DEFAULTS = {
        pattern: 'd{.}`m{.}`Y',
        format: function format(date) {
            var day = String(date.getDate()).padStart(2, '0');
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var year = date.getFullYear();
            return [day, month, year].join('.');
        },
        parse: function parse(str) {
            var _str$split = str.split('.'),
                _str$split2 = _slicedToArray(_str$split, 3),
                day = _str$split2[0],
                month = _str$split2[1],
                year = _str$split2[2];

            return new Date(year, month - 1, day);
        }
    };

    MaskedDate.GET_DEFAULT_BLOCKS = function() {
        return {
            d: {
                mask: MaskedRange,
                from: 1,
                to: 31,
                maxLength: 2
            },
            m: {
                mask: MaskedRange,
                from: 1,
                to: 12,
                maxLength: 2
            },
            Y: {
                mask: MaskedRange,
                from: 1900,
                to: 9999
            }
        };
    };

    IMask.MaskedDate = MaskedDate;

    /**
      Generic element API to use with mask
      @interface
    */
    var MaskElement =
        /*#__PURE__*/
        function() {
            function MaskElement() {
                _classCallCheck(this, MaskElement);
            }

            _createClass(MaskElement, [{
                key: "select",

                /** Safely sets element selection */
                value: function select(start, end) {
                        if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;

                        try {
                            this._unsafeSelect(start, end);
                        } catch (e) {}
                    }
                    /** Should be overriden in subclasses */

            }, {
                key: "_unsafeSelect",
                value: function _unsafeSelect(start, end) {}
                    /** Should be overriden in subclasses */

            }, {
                key: "bindEvents",

                /** Should be overriden in subclasses */
                value: function bindEvents(handlers) {}
                    /** Should be overriden in subclasses */

            }, {
                key: "unbindEvents",
                value: function unbindEvents() {}
            }, {
                key: "selectionStart",

                /** */

                /** */

                /** */

                /** Safely returns selection start */
                get: function get() {
                        var start;

                        try {
                            start = this._unsafeSelectionStart;
                        } catch (e) {}

                        return start != null ? start : this.value.length;
                    }
                    /** Safely returns selection end */

            }, {
                key: "selectionEnd",
                get: function get() {
                    var end;

                    try {
                        end = this._unsafeSelectionEnd;
                    } catch (e) {}

                    return end != null ? end : this.value.length;
                }
            }, {
                key: "isActive",
                get: function get() {
                    return false;
                }
            }]);

            return MaskElement;
        }();
    IMask.MaskElement = MaskElement;

    /** Bridge between HTMLElement and {@link Masked} */

    var HTMLMaskElement =
        /*#__PURE__*/
        function(_MaskElement) {
            _inherits(HTMLMaskElement, _MaskElement);

            /** Mapping between HTMLElement events and mask internal events */

            /** HTMLElement to use mask on */

            /**
              @param {HTMLInputElement|HTMLTextAreaElement} input
            */
            function HTMLMaskElement(input) {
                var _this;

                _classCallCheck(this, HTMLMaskElement);

                _this = _possibleConstructorReturn(this, _getPrototypeOf(HTMLMaskElement).call(this));
                _this.input = input;
                _this._handlers = {};
                return _this;
            }
            /** */
            // $FlowFixMe https://github.com/facebook/flow/issues/2839


            _createClass(HTMLMaskElement, [{
                key: "_unsafeSelect",

                /**
                  Sets HTMLElement selection
                  @override
                */
                value: function _unsafeSelect(start, end) {
                        this.input.setSelectionRange(start, end);
                    }
                    /**
                      HTMLElement value
                      @override
                    */

            }, {
                key: "bindEvents",

                /**
                  Binds HTMLElement events to mask internal events
                  @override
                */
                value: function bindEvents(handlers) {
                        var _this2 = this;

                        Object.keys(handlers).forEach(function(event) {
                            return _this2._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]);
                        });
                    }
                    /**
                      Unbinds HTMLElement events to mask internal events
                      @override
                    */

            }, {
                key: "unbindEvents",
                value: function unbindEvents() {
                        var _this3 = this;

                        Object.keys(this._handlers).forEach(function(event) {
                            return _this3._toggleEventHandler(event);
                        });
                    }
                    /** */

            }, {
                key: "_toggleEventHandler",
                value: function _toggleEventHandler(event, handler) {
                    if (this._handlers[event]) {
                        this.input.removeEventListener(event, this._handlers[event]);
                        delete this._handlers[event];
                    }

                    if (handler) {
                        this.input.addEventListener(event, handler);
                        this._handlers[event] = handler;
                    }
                }
            }, {
                key: "rootElement",
                get: function get() {
                        return this.input.getRootNode ? this.input.getRootNode() : document;
                    }
                    /**
                      Is element in focus
                      @readonly
                    */

            }, {
                key: "isActive",
                get: function get() {
                        //$FlowFixMe
                        return this.input === this.rootElement.activeElement;
                    }
                    /**
                      Returns HTMLElement selection start
                      @override
                    */

            }, {
                key: "_unsafeSelectionStart",
                get: function get() {
                        return this.input.selectionStart;
                    }
                    /**
                      Returns HTMLElement selection end
                      @override
                    */

            }, {
                key: "_unsafeSelectionEnd",
                get: function get() {
                    return this.input.selectionEnd;
                }
            }, {
                key: "value",
                get: function get() {
                    return this.input.value;
                },
                set: function set(value) {
                    this.input.value = value;
                }
            }]);

            return HTMLMaskElement;
        }(MaskElement);
    HTMLMaskElement.EVENTS_MAP = {
        selectionChange: 'keydown',
        input: 'input',
        drop: 'drop',
        click: 'click',
        focus: 'focus',
        commit: 'blur'
    };
    IMask.HTMLMaskElement = HTMLMaskElement;

    var HTMLContenteditableMaskElement =
        /*#__PURE__*/
        function(_HTMLMaskElement) {
            _inherits(HTMLContenteditableMaskElement, _HTMLMaskElement);

            function HTMLContenteditableMaskElement() {
                _classCallCheck(this, HTMLContenteditableMaskElement);

                return _possibleConstructorReturn(this, _getPrototypeOf(HTMLContenteditableMaskElement).apply(this, arguments));
            }

            _createClass(HTMLContenteditableMaskElement, [{
                key: "_unsafeSelect",

                /**
                  Sets HTMLElement selection
                  @override
                */
                value: function _unsafeSelect(start, end) {
                        if (!this.rootElement.createRange) return;
                        var range = this.rootElement.createRange();
                        range.setStart(this.input.firstChild || this.input, start);
                        range.setEnd(this.input.lastChild || this.input, end);
                        var root = this.rootElement;
                        var selection = root.getSelection && root.getSelection();

                        if (selection) {
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }
                    /**
                      HTMLElement value
                      @override
                    */

            }, {
                key: "_unsafeSelectionStart",

                /**
                  Returns HTMLElement selection start
                  @override
                */
                get: function get() {
                        var root = this.rootElement;
                        var selection = root.getSelection && root.getSelection();
                        return selection && selection.anchorOffset;
                    }
                    /**
                      Returns HTMLElement selection end
                      @override
                    */

            }, {
                key: "_unsafeSelectionEnd",
                get: function get() {
                    var root = this.rootElement;
                    var selection = root.getSelection && root.getSelection();
                    return selection && this._unsafeSelectionStart + String(selection).length;
                }
            }, {
                key: "value",
                get: function get() {
                    // $FlowFixMe
                    return this.input.textContent;
                },
                set: function set(value) {
                    this.input.textContent = value;
                }
            }]);

            return HTMLContenteditableMaskElement;
        }(HTMLMaskElement);
    IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;

    /** Listens to element events and controls changes between element and {@link Masked} */

    var InputMask =
        /*#__PURE__*/
        function() {
            /**
              View element
              @readonly
            */

            /**
              Internal {@link Masked} model
              @readonly
            */

            /**
              @param {MaskElement|HTMLInputElement|HTMLTextAreaElement} el
              @param {Object} opts
            */
            function InputMask(el, opts) {
                _classCallCheck(this, InputMask);

                this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' ? new HTMLContenteditableMaskElement(el) : new HTMLMaskElement(el);
                this.masked = createMask(opts);
                this._listeners = {};
                this._value = '';
                this._unmaskedValue = '';
                this._saveSelection = this._saveSelection.bind(this);
                this._onInput = this._onInput.bind(this);
                this._onChange = this._onChange.bind(this);
                this._onDrop = this._onDrop.bind(this);
                this._onFocus = this._onFocus.bind(this);
                this._onClick = this._onClick.bind(this);
                this.alignCursor = this.alignCursor.bind(this);
                this.alignCursorFriendly = this.alignCursorFriendly.bind(this);

                this._bindEvents(); // refresh


                this.updateValue();

                this._onChange();
            }
            /** Read or update mask */


            _createClass(InputMask, [{
                key: "maskEquals",
                value: function maskEquals(mask) {
                    return mask == null || mask === this.masked.mask || mask === Date && this.masked instanceof MaskedDate;
                }
            }, {
                key: "_bindEvents",

                /**
                  Starts listening to element events
                  @protected
                */
                value: function _bindEvents() {
                        this.el.bindEvents({
                            selectionChange: this._saveSelection,
                            input: this._onInput,
                            drop: this._onDrop,
                            click: this._onClick,
                            focus: this._onFocus,
                            commit: this._onChange
                        });
                    }
                    /**
                      Stops listening to element events
                      @protected
                     */

            }, {
                key: "_unbindEvents",
                value: function _unbindEvents() {
                        if (this.el) this.el.unbindEvents();
                    }
                    /**
                      Fires custom event
                      @protected
                     */

            }, {
                key: "_fireEvent",
                value: function _fireEvent(ev) {
                        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            args[_key - 1] = arguments[_key];
                        }

                        var listeners = this._listeners[ev];
                        if (!listeners) return;
                        listeners.forEach(function(l) {
                            return l.apply(void 0, args);
                        });
                    }
                    /**
                      Current selection start
                      @readonly
                    */

            }, {
                key: "_saveSelection",

                /**
                  Stores current selection
                  @protected
                */
                value: function _saveSelection()
                    /* ev */
                    {
                        if (this.value !== this.el.value) {
                            console.warn('Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.'); // eslint-disable-line no-console
                        }

                        this._selection = {
                            start: this.selectionStart,
                            end: this.cursorPos
                        };
                    }
                    /** Syncronizes model value from view */

            }, {
                key: "updateValue",
                value: function updateValue() {
                        this.masked.value = this.el.value;
                        this._value = this.masked.value;
                    }
                    /** Syncronizes view from model value, fires change events */

            }, {
                key: "updateControl",
                value: function updateControl() {
                        var newUnmaskedValue = this.masked.unmaskedValue;
                        var newValue = this.masked.value;
                        var isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
                        this._unmaskedValue = newUnmaskedValue;
                        this._value = newValue;
                        if (this.el.value !== newValue) this.el.value = newValue;
                        if (isChanged) this._fireChangeEvents();
                    }
                    /** Updates options with deep equal check, recreates @{link Masked} model if mask type changes */

            }, {
                key: "updateOptions",
                value: function updateOptions(opts) {
                        var mask = opts.mask,
                            restOpts = _objectWithoutProperties(opts, ["mask"]);

                        var updateMask = !this.maskEquals(mask);
                        var updateOpts = !objectIncludes(this.masked, restOpts);
                        if (updateMask) this.mask = mask;
                        if (updateOpts) this.masked.updateOptions(restOpts);
                        if (updateMask || updateOpts) this.updateControl();
                    }
                    /** Updates cursor */

            }, {
                key: "updateCursor",
                value: function updateCursor(cursorPos) {
                        if (cursorPos == null) return;
                        this.cursorPos = cursorPos; // also queue change cursor for mobile browsers

                        this._delayUpdateCursor(cursorPos);
                    }
                    /**
                      Delays cursor update to support mobile browsers
                      @private
                    */

            }, {
                key: "_delayUpdateCursor",
                value: function _delayUpdateCursor(cursorPos) {
                        var _this = this;

                        this._abortUpdateCursor();

                        this._changingCursorPos = cursorPos;
                        this._cursorChanging = setTimeout(function() {
                            if (!_this.el) return; // if was destroyed

                            _this.cursorPos = _this._changingCursorPos;

                            _this._abortUpdateCursor();
                        }, 10);
                    }
                    /**
                      Fires custom events
                      @protected
                    */

            }, {
                key: "_fireChangeEvents",
                value: function _fireChangeEvents() {
                        this._fireEvent('accept', this._inputEvent);

                        if (this.masked.isComplete) this._fireEvent('complete', this._inputEvent);
                    }
                    /**
                      Aborts delayed cursor update
                      @private
                    */

            }, {
                key: "_abortUpdateCursor",
                value: function _abortUpdateCursor() {
                        if (this._cursorChanging) {
                            clearTimeout(this._cursorChanging);
                            delete this._cursorChanging;
                        }
                    }
                    /** Aligns cursor to nearest available position */

            }, {
                key: "alignCursor",
                value: function alignCursor() {
                        this.cursorPos = this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT);
                    }
                    /** Aligns cursor only if selection is empty */

            }, {
                key: "alignCursorFriendly",
                value: function alignCursorFriendly() {
                        if (this.selectionStart !== this.cursorPos) return; // skip if range is selected

                        this.alignCursor();
                    }
                    /** Adds listener on custom event */

            }, {
                key: "on",
                value: function on(ev, handler) {
                        if (!this._listeners[ev]) this._listeners[ev] = [];

                        this._listeners[ev].push(handler);

                        return this;
                    }
                    /** Removes custom event listener */

            }, {
                key: "off",
                value: function off(ev, handler) {
                        if (!this._listeners[ev]) return this;

                        if (!handler) {
                            delete this._listeners[ev];
                            return this;
                        }

                        var hIndex = this._listeners[ev].indexOf(handler);

                        if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
                        return this;
                    }
                    /** Handles view input event */

            }, {
                key: "_onInput",
                value: function _onInput(e) {
                        this._inputEvent = e;

                        this._abortUpdateCursor(); // fix strange IE behavior


                        if (!this._selection) return this.updateValue();
                        var details = new ActionDetails( // new state
                            this.el.value, this.cursorPos, // old state
                            this.value, this._selection);
                        var oldRawValue = this.masked.rawInputValue;
                        var offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection).offset; // force align in remove direction only if no input chars were removed
                        // otherwise we still need to align with NONE (to get out from fixed symbols for instance)

                        var removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
                        var cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
                        this.updateControl();
                        this.updateCursor(cursorPos);
                        delete this._inputEvent;
                    }
                    /** Handles view change event and commits model value */

            }, {
                key: "_onChange",
                value: function _onChange() {
                        if (this.value !== this.el.value) {
                            this.updateValue();
                        }

                        this.masked.doCommit();
                        this.updateControl();

                        this._saveSelection();
                    }
                    /** Handles view drop event, prevents by default */

            }, {
                key: "_onDrop",
                value: function _onDrop(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                    }
                    /** Restore last selection on focus */

            }, {
                key: "_onFocus",
                value: function _onFocus(ev) {
                        this.alignCursorFriendly();
                    }
                    /** Restore last selection on focus */

            }, {
                key: "_onClick",
                value: function _onClick(ev) {
                        this.alignCursorFriendly();
                    }
                    /** Unbind view events and removes element reference */

            }, {
                key: "destroy",
                value: function destroy() {
                    this._unbindEvents(); // $FlowFixMe why not do so?


                    this._listeners.length = 0; // $FlowFixMe

                    delete this.el;
                }
            }, {
                key: "mask",
                get: function get() {
                    return this.masked.mask;
                },
                set: function set(mask) {
                        if (this.maskEquals(mask)) return;

                        if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
                            this.masked.updateOptions({
                                mask: mask
                            });
                            return;
                        }

                        var masked = createMask({
                            mask: mask
                        });
                        masked.unmaskedValue = this.masked.unmaskedValue;
                        this.masked = masked;
                    }
                    /** Raw value */

            }, {
                key: "value",
                get: function get() {
                    return this._value;
                },
                set: function set(str) {
                        this.masked.value = str;
                        this.updateControl();
                        this.alignCursor();
                    }
                    /** Unmasked value */

            }, {
                key: "unmaskedValue",
                get: function get() {
                    return this._unmaskedValue;
                },
                set: function set(str) {
                        this.masked.unmaskedValue = str;
                        this.updateControl();
                        this.alignCursor();
                    }
                    /** Typed unmasked value */

            }, {
                key: "typedValue",
                get: function get() {
                    return this.masked.typedValue;
                },
                set: function set(val) {
                    this.masked.typedValue = val;
                    this.updateControl();
                    this.alignCursor();
                }
            }, {
                key: "selectionStart",
                get: function get() {
                        return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
                    }
                    /** Current cursor position */

            }, {
                key: "cursorPos",
                get: function get() {
                    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
                },
                set: function set(pos) {
                    if (!this.el || !this.el.isActive) return;
                    this.el.select(pos, pos);

                    this._saveSelection();
                }
            }]);

            return InputMask;
        }();
    IMask.InputMask = InputMask;

    /** Pattern which validates enum values */

    var MaskedEnum =
        /*#__PURE__*/
        function(_MaskedPattern) {
            _inherits(MaskedEnum, _MaskedPattern);

            function MaskedEnum() {
                _classCallCheck(this, MaskedEnum);

                return _possibleConstructorReturn(this, _getPrototypeOf(MaskedEnum).apply(this, arguments));
            }

            _createClass(MaskedEnum, [{
                key: "_update",

                /**
                  @override
                  @param {Object} opts
                */
                value: function _update(opts) {
                        // TODO type
                        if (opts.enum) opts.mask = '*'.repeat(opts.enum[0].length);

                        _get(_getPrototypeOf(MaskedEnum.prototype), "_update", this).call(this, opts);
                    }
                    /**
                      @override
                    */

            }, {
                key: "doValidate",
                value: function doValidate() {
                    var _this = this,
                        _get2;

                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    return this.enum.some(function(e) {
                        return e.indexOf(_this.unmaskedValue) >= 0;
                    }) && (_get2 = _get(_getPrototypeOf(MaskedEnum.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args));
                }
            }]);

            return MaskedEnum;
        }(MaskedPattern);
    IMask.MaskedEnum = MaskedEnum;

    /**
      Number mask
      @param {Object} opts
      @param {string} opts.radix - Single char
      @param {string} opts.thousandsSeparator - Single char
      @param {Array<string>} opts.mapToRadix - Array of single chars
      @param {number} opts.min
      @param {number} opts.max
      @param {number} opts.scale - Digits after point
      @param {boolean} opts.signed - Allow negative
      @param {boolean} opts.normalizeZeros - Flag to remove leading and trailing zeros in the end of editing
      @param {boolean} opts.padFractionalZeros - Flag to pad trailing zeros after point in the end of editing
    */
    var MaskedNumber =
        /*#__PURE__*/
        function(_Masked) {
            _inherits(MaskedNumber, _Masked);

            /** Single char */

            /** Single char */

            /** Array of single chars */

            /** */

            /** */

            /** Digits after point */

            /** */

            /** Flag to remove leading and trailing zeros in the end of editing */

            /** Flag to pad trailing zeros after point in the end of editing */
            function MaskedNumber(opts) {
                _classCallCheck(this, MaskedNumber);

                return _possibleConstructorReturn(this, _getPrototypeOf(MaskedNumber).call(this, Object.assign({}, MaskedNumber.DEFAULTS, {}, opts)));
            }
            /**
              @override
            */


            _createClass(MaskedNumber, [{
                key: "_update",
                value: function _update(opts) {
                        _get(_getPrototypeOf(MaskedNumber.prototype), "_update", this).call(this, opts);

                        this._updateRegExps();
                    }
                    /** */

            }, {
                key: "_updateRegExps",
                value: function _updateRegExps() {
                        // use different regexp to process user input (more strict, input suffix) and tail shifting
                        var start = '^' + (this.allowNegative ? '[+|\\-]?' : '');
                        var midInput = '(0|([1-9]+\\d*))?';
                        var mid = '\\d*';
                        var end = (this.scale ? '(' + escapeRegExp(this.radix) + '\\d{0,' + this.scale + '})?' : '') + '$';
                        this._numberRegExpInput = new RegExp(start + midInput + end);
                        this._numberRegExp = new RegExp(start + mid + end);
                        this._mapToRadixRegExp = new RegExp('[' + this.mapToRadix.map(escapeRegExp).join('') + ']', 'g');
                        this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), 'g');
                    }
                    /** */

            }, {
                key: "_removeThousandsSeparators",
                value: function _removeThousandsSeparators(value) {
                        return value.replace(this._thousandsSeparatorRegExp, '');
                    }
                    /** */

            }, {
                key: "_insertThousandsSeparators",
                value: function _insertThousandsSeparators(value) {
                        // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
                        var parts = value.split(this.radix);
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
                        return parts.join(this.radix);
                    }
                    /**
                      @override
                    */

            }, {
                key: "doPrepare",
                value: function doPrepare(str) {
                        var _get2;

                        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            args[_key - 1] = arguments[_key];
                        }

                        return (_get2 = _get(_getPrototypeOf(MaskedNumber.prototype), "doPrepare", this)).call.apply(_get2, [this, this._removeThousandsSeparators(str.replace(this._mapToRadixRegExp, this.radix))].concat(args));
                    }
                    /** */

            }, {
                key: "_separatorsCount",
                value: function _separatorsCount(to) {
                        var extendOnSeparators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                        var count = 0;

                        for (var pos = 0; pos < to; ++pos) {
                            if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
                                ++count;
                                if (extendOnSeparators) to += this.thousandsSeparator.length;
                            }
                        }

                        return count;
                    }
                    /** */

            }, {
                key: "_separatorsCountFromSlice",
                value: function _separatorsCountFromSlice() {
                        var slice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._value;
                        return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
                    }
                    /**
                      @override
                    */

            }, {
                key: "extractInput",
                value: function extractInput() {
                        var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;
                        var flags = arguments.length > 2 ? arguments[2] : undefined;

                        var _this$_adjustRangeWit = this._adjustRangeWithSeparators(fromPos, toPos);

                        var _this$_adjustRangeWit2 = _slicedToArray(_this$_adjustRangeWit, 2);

                        fromPos = _this$_adjustRangeWit2[0];
                        toPos = _this$_adjustRangeWit2[1];
                        return this._removeThousandsSeparators(_get(_getPrototypeOf(MaskedNumber.prototype), "extractInput", this).call(this, fromPos, toPos, flags));
                    }
                    /**
                      @override
                    */

            }, {
                key: "_appendCharRaw",
                value: function _appendCharRaw(ch) {
                        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        if (!this.thousandsSeparator) return _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);
                        var prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;

                        var prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);

                        this._value = this._removeThousandsSeparators(this.value);

                        var appendDetails = _get(_getPrototypeOf(MaskedNumber.prototype), "_appendCharRaw", this).call(this, ch, flags);

                        this._value = this._insertThousandsSeparators(this._value);
                        var beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;

                        var beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);

                        appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
                        appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
                        return appendDetails;
                    }
                    /** */

            }, {
                key: "_findSeparatorAround",
                value: function _findSeparatorAround(pos) {
                    if (this.thousandsSeparator) {
                        var searchFrom = pos - this.thousandsSeparator.length + 1;
                        var separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
                        if (separatorPos <= pos) return separatorPos;
                    }

                    return -1;
                }
            }, {
                key: "_adjustRangeWithSeparators",
                value: function _adjustRangeWithSeparators(from, to) {
                        var separatorAroundFromPos = this._findSeparatorAround(from);

                        if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;

                        var separatorAroundToPos = this._findSeparatorAround(to);

                        if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
                        return [from, to];
                    }
                    /**
                      @override
                    */

            }, {
                key: "remove",
                value: function remove() {
                        var fromPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var toPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.value.length;

                        var _this$_adjustRangeWit3 = this._adjustRangeWithSeparators(fromPos, toPos);

                        var _this$_adjustRangeWit4 = _slicedToArray(_this$_adjustRangeWit3, 2);

                        fromPos = _this$_adjustRangeWit4[0];
                        toPos = _this$_adjustRangeWit4[1];
                        var valueBeforePos = this.value.slice(0, fromPos);
                        var valueAfterPos = this.value.slice(toPos);

                        var prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);

                        this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));

                        var beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);

                        return new ChangeDetails({
                            tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
                        });
                    }
                    /**
                      @override
                    */

            }, {
                key: "nearestInputPos",
                value: function nearestInputPos(cursorPos, direction) {
                        if (!this.thousandsSeparator) return cursorPos;

                        switch (direction) {
                            case DIRECTION.NONE:
                            case DIRECTION.LEFT:
                            case DIRECTION.FORCE_LEFT:
                                {
                                    var separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);

                                    if (separatorAtLeftPos >= 0) {
                                        var separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;

                                        if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
                                            return separatorAtLeftPos;
                                        }
                                    }

                                    break;
                                }

                            case DIRECTION.RIGHT:
                            case DIRECTION.FORCE_RIGHT:
                                {
                                    var separatorAtRightPos = this._findSeparatorAround(cursorPos);

                                    if (separatorAtRightPos >= 0) {
                                        return separatorAtRightPos + this.thousandsSeparator.length;
                                    }
                                }
                        }

                        return cursorPos;
                    }
                    /**
                      @override
                    */

            }, {
                key: "doValidate",
                value: function doValidate(flags) {
                        var regexp = flags.input ? this._numberRegExpInput : this._numberRegExp; // validate as string

                        var valid = regexp.test(this._removeThousandsSeparators(this.value));

                        if (valid) {
                            // validate as number
                            var number = this.number;
                            valid = valid && !isNaN(number) && ( // check min bound for negative values
                                this.min == null || this.min >= 0 || this.min <= this.number) && ( // check max bound for positive values
                                this.max == null || this.max <= 0 || this.number <= this.max);
                        }

                        return valid && _get(_getPrototypeOf(MaskedNumber.prototype), "doValidate", this).call(this, flags);
                    }
                    /**
                      @override
                    */

            }, {
                key: "doCommit",
                value: function doCommit() {
                        if (this.value) {
                            var number = this.number;
                            var validnum = number; // check bounds

                            if (this.min != null) validnum = Math.max(validnum, this.min);
                            if (this.max != null) validnum = Math.min(validnum, this.max);
                            if (validnum !== number) this.unmaskedValue = String(validnum);
                            var formatted = this.value;
                            if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
                            if (this.padFractionalZeros) formatted = this._padFractionalZeros(formatted);
                            this._value = formatted;
                        }

                        _get(_getPrototypeOf(MaskedNumber.prototype), "doCommit", this).call(this);
                    }
                    /** */

            }, {
                key: "_normalizeZeros",
                value: function _normalizeZeros(value) {
                        var parts = this._removeThousandsSeparators(value).split(this.radix); // remove leading zeros


                        parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, function(match, sign, zeros, num) {
                            return sign + num;
                        }); // add leading zero

                        if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + '0';

                        if (parts.length > 1) {
                            parts[1] = parts[1].replace(/0*$/, ''); // remove trailing zeros

                            if (!parts[1].length) parts.length = 1; // remove fractional
                        }

                        return this._insertThousandsSeparators(parts.join(this.radix));
                    }
                    /** */

            }, {
                key: "_padFractionalZeros",
                value: function _padFractionalZeros(value) {
                        if (!value) return value;
                        var parts = value.split(this.radix);
                        if (parts.length < 2) parts.push('');
                        parts[1] = parts[1].padEnd(this.scale, '0');
                        return parts.join(this.radix);
                    }
                    /**
                      @override
                    */

            }, {
                key: "unmaskedValue",
                get: function get() {
                    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, '.');
                },
                set: function set(unmaskedValue) {
                        _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", unmaskedValue.replace('.', this.radix), this, true);
                    }
                    /**
                      @override
                    */

            }, {
                key: "typedValue",
                get: function get() {
                    return Number(this.unmaskedValue);
                },
                set: function set(n) {
                        _set(_getPrototypeOf(MaskedNumber.prototype), "unmaskedValue", String(n), this, true);
                    }
                    /** Parsed Number */

            }, {
                key: "number",
                get: function get() {
                    return this.typedValue;
                },
                set: function set(number) {
                        this.typedValue = number;
                    }
                    /**
                      Is negative allowed
                      @readonly
                    */

            }, {
                key: "allowNegative",
                get: function get() {
                    return this.signed || this.min != null && this.min < 0 || this.max != null && this.max < 0;
                }
            }]);

            return MaskedNumber;
        }(Masked);
    MaskedNumber.DEFAULTS = {
        radix: ',',
        thousandsSeparator: '',
        mapToRadix: ['.'],
        scale: 2,
        signed: false,
        normalizeZeros: true,
        padFractionalZeros: false
    };
    IMask.MaskedNumber = MaskedNumber;

    /** Masking by custom Function */

    var MaskedFunction =
        /*#__PURE__*/
        function(_Masked) {
            _inherits(MaskedFunction, _Masked);

            function MaskedFunction() {
                _classCallCheck(this, MaskedFunction);

                return _possibleConstructorReturn(this, _getPrototypeOf(MaskedFunction).apply(this, arguments));
            }

            _createClass(MaskedFunction, [{
                key: "_update",

                /**
                  @override
                  @param {Object} opts
                */
                value: function _update(opts) {
                    if (opts.mask) opts.validate = opts.mask;

                    _get(_getPrototypeOf(MaskedFunction.prototype), "_update", this).call(this, opts);
                }
            }]);

            return MaskedFunction;
        }(Masked);
    IMask.MaskedFunction = MaskedFunction;

    /** Dynamic mask for choosing apropriate mask in run-time */
    var MaskedDynamic =
        /*#__PURE__*/
        function(_Masked) {
            _inherits(MaskedDynamic, _Masked);

            /** Currently chosen mask */

            /** Compliled {@link Masked} options */

            /** Chooses {@link Masked} depending on input value */

            /**
              @param {Object} opts
            */
            function MaskedDynamic(opts) {
                var _this;

                _classCallCheck(this, MaskedDynamic);

                _this = _possibleConstructorReturn(this, _getPrototypeOf(MaskedDynamic).call(this, Object.assign({}, MaskedDynamic.DEFAULTS, {}, opts)));
                _this.currentMask = null;
                return _this;
            }
            /**
              @override
            */


            _createClass(MaskedDynamic, [{
                key: "_update",
                value: function _update(opts) {
                        _get(_getPrototypeOf(MaskedDynamic.prototype), "_update", this).call(this, opts);

                        if ('mask' in opts) {
                            // mask could be totally dynamic with only `dispatch` option
                            this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map(function(m) {
                                return createMask(m);
                            }) : [];
                        }
                    }
                    /**
                      @override
                    */

            }, {
                key: "_appendCharRaw",
                value: function _appendCharRaw() {
                    var details = this._applyDispatch.apply(this, arguments);

                    if (this.currentMask) {
                        var _this$currentMask;

                        details.aggregate((_this$currentMask = this.currentMask)._appendChar.apply(_this$currentMask, arguments));
                    }

                    return details;
                }
            }, {
                key: "_applyDispatch",
                value: function _applyDispatch() {
                    var appended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                    var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    var prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
                    var inputValue = this.rawInputValue;
                    var insertValue = flags.tail && flags._beforeTailState != null ? // $FlowFixMe - tired to fight with type system
                        flags._beforeTailState._rawInputValue : inputValue;
                    var tailValue = inputValue.slice(insertValue.length);
                    var prevMask = this.currentMask;
                    var details = new ChangeDetails();
                    var prevMaskState = prevMask && prevMask.state; // clone flags to prevent overwriting `_beforeTailState`

                    this.currentMask = this.doDispatch(appended, Object.assign({}, flags)); // restore state after dispatch

                    if (this.currentMask) {
                        if (this.currentMask !== prevMask) {
                            // if mask changed reapply input
                            this.currentMask.reset(); // $FlowFixMe - it's ok, we don't change current mask above

                            var d = this.currentMask.append(insertValue, {
                                raw: true
                            });
                            details.tailShift = d.inserted.length - prevValueBeforeTail.length;

                            if (tailValue) {
                                // $FlowFixMe - it's ok, we don't change current mask above
                                details.tailShift += this.currentMask.append(tailValue, {
                                    raw: true,
                                    tail: true
                                }).tailShift;
                            }
                        } else {
                            // Dispatch can do something bad with state, so
                            // restore prev mask state
                            this.currentMask.state = prevMaskState;
                        }
                    }

                    return details;
                }
            }, {
                key: "_appendPlaceholder",
                value: function _appendPlaceholder() {
                        var details = this._applyDispatch.apply(this, arguments);

                        if (this.currentMask) {
                            details.aggregate(this.currentMask._appendPlaceholder());
                        }

                        return details;
                    }
                    /**
                      @override
                    */

            }, {
                key: "doDispatch",
                value: function doDispatch(appended) {
                        var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        return this.dispatch(appended, this, flags);
                    }
                    /**
                      @override
                    */

            }, {
                key: "doValidate",
                value: function doValidate() {
                        var _get2, _this$currentMask2;

                        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        return (_get2 = _get(_getPrototypeOf(MaskedDynamic.prototype), "doValidate", this)).call.apply(_get2, [this].concat(args)) && (!this.currentMask || (_this$currentMask2 = this.currentMask).doValidate.apply(_this$currentMask2, args));
                    }
                    /**
                      @override
                    */

            }, {
                key: "reset",
                value: function reset() {
                        if (this.currentMask) this.currentMask.reset();
                        this.compiledMasks.forEach(function(m) {
                            return m.reset();
                        });
                    }
                    /**
                      @override
                    */

            }, {
                key: "remove",

                /**
                  @override
                */
                value: function remove() {
                        var details = new ChangeDetails();

                        if (this.currentMask) {
                            var _this$currentMask3;

                            details.aggregate((_this$currentMask3 = this.currentMask).remove.apply(_this$currentMask3, arguments)) // update with dispatch
                                .aggregate(this._applyDispatch());
                        }

                        return details;
                    }
                    /**
                      @override
                    */

            }, {
                key: "extractInput",

                /**
                  @override
                */
                value: function extractInput() {
                        var _this$currentMask4;

                        return this.currentMask ? (_this$currentMask4 = this.currentMask).extractInput.apply(_this$currentMask4, arguments) : '';
                    }
                    /**
                      @override
                    */

            }, {
                key: "extractTail",
                value: function extractTail() {
                        var _this$currentMask5, _get3;

                        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                            args[_key2] = arguments[_key2];
                        }

                        return this.currentMask ? (_this$currentMask5 = this.currentMask).extractTail.apply(_this$currentMask5, args) : (_get3 = _get(_getPrototypeOf(MaskedDynamic.prototype), "extractTail", this)).call.apply(_get3, [this].concat(args));
                    }
                    /**
                      @override
                    */

            }, {
                key: "doCommit",
                value: function doCommit() {
                        if (this.currentMask) this.currentMask.doCommit();

                        _get(_getPrototypeOf(MaskedDynamic.prototype), "doCommit", this).call(this);
                    }
                    /**
                      @override
                    */

            }, {
                key: "nearestInputPos",
                value: function nearestInputPos() {
                    var _this$currentMask6, _get4;

                    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                    }

                    return this.currentMask ? (_this$currentMask6 = this.currentMask).nearestInputPos.apply(_this$currentMask6, args) : (_get4 = _get(_getPrototypeOf(MaskedDynamic.prototype), "nearestInputPos", this)).call.apply(_get4, [this].concat(args));
                }
            }, {
                key: "value",
                get: function get() {
                    return this.currentMask ? this.currentMask.value : '';
                },
                set: function set(value) {
                        _set(_getPrototypeOf(MaskedDynamic.prototype), "value", value, this, true);
                    }
                    /**
                      @override
                    */

            }, {
                key: "unmaskedValue",
                get: function get() {
                    return this.currentMask ? this.currentMask.unmaskedValue : '';
                },
                set: function set(unmaskedValue) {
                        _set(_getPrototypeOf(MaskedDynamic.prototype), "unmaskedValue", unmaskedValue, this, true);
                    }
                    /**
                      @override
                    */

            }, {
                key: "typedValue",
                get: function get() {
                        return this.currentMask ? this.currentMask.typedValue : '';
                    } // probably typedValue should not be used with dynamic
                    ,
                set: function set(value) {
                        var unmaskedValue = String(value); // double check it

                        if (this.currentMask) {
                            this.currentMask.typedValue = value;
                            unmaskedValue = this.currentMask.unmaskedValue;
                        }

                        this.unmaskedValue = unmaskedValue;
                    }
                    /**
                      @override
                    */

            }, {
                key: "isComplete",
                get: function get() {
                    return !!this.currentMask && this.currentMask.isComplete;
                }
            }, {
                key: "state",
                get: function get() {
                    return Object.assign({}, _get(_getPrototypeOf(MaskedDynamic.prototype), "state", this), {
                        _rawInputValue: this.rawInputValue,
                        compiledMasks: this.compiledMasks.map(function(m) {
                            return m.state;
                        }),
                        currentMaskRef: this.currentMask,
                        currentMask: this.currentMask && this.currentMask.state
                    });
                },
                set: function set(state) {
                    var compiledMasks = state.compiledMasks,
                        currentMaskRef = state.currentMaskRef,
                        currentMask = state.currentMask,
                        maskedState = _objectWithoutProperties(state, ["compiledMasks", "currentMaskRef", "currentMask"]);

                    this.compiledMasks.forEach(function(m, mi) {
                        return m.state = compiledMasks[mi];
                    });

                    if (currentMaskRef != null) {
                        this.currentMask = currentMaskRef;
                        this.currentMask.state = currentMask;
                    }

                    _set(_getPrototypeOf(MaskedDynamic.prototype), "state", maskedState, this, true);
                }
            }, {
                key: "overwrite",
                get: function get() {
                    return this.currentMask ? this.currentMask.overwrite : _get(_getPrototypeOf(MaskedDynamic.prototype), "overwrite", this);
                },
                set: function set(overwrite) {
                    console.warn('"overwrite" option is not available in dynamic mask, use this option in siblings');
                }
            }]);

            return MaskedDynamic;
        }(Masked);
    MaskedDynamic.DEFAULTS = {
        dispatch: function dispatch(appended, masked, flags) {
            if (!masked.compiledMasks.length) return;
            var inputValue = masked.rawInputValue; // simulate input

            var inputs = masked.compiledMasks.map(function(m, index) {
                m.reset();
                m.append(inputValue, {
                    raw: true
                });
                m.append(appended, flags);
                var weight = m.rawInputValue.length;
                return {
                    weight: weight,
                    index: index
                };
            }); // pop masks with longer values first

            inputs.sort(function(i1, i2) {
                return i2.weight - i1.weight;
            });
            return masked.compiledMasks[inputs[0].index];
        }
    };
    IMask.MaskedDynamic = MaskedDynamic;

    /** Mask pipe source and destination types */

    var PIPE_TYPE = {
        MASKED: 'value',
        UNMASKED: 'unmaskedValue',
        TYPED: 'typedValue'
    };
    /** Creates new pipe function depending on mask type, source and destination options */

    function createPipe(mask) {
        var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : PIPE_TYPE.MASKED;
        var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PIPE_TYPE.MASKED;
        var masked = createMask(mask);
        return function(value) {
            return masked.runIsolated(function(m) {
                m[from] = value;
                return m[to];
            });
        };
    }
    /** Pipes value through mask depending on mask type, source and destination options */

    function pipe(value) {
        for (var _len = arguments.length, pipeArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            pipeArgs[_key - 1] = arguments[_key];
        }

        return createPipe.apply(void 0, pipeArgs)(value);
    }
    IMask.PIPE_TYPE = PIPE_TYPE;
    IMask.createPipe = createPipe;
    IMask.pipe = pipe;

    try {
        globalThis.IMask = IMask;
    } catch (e) {}

    exports.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
    exports.HTMLMaskElement = HTMLMaskElement;
    exports.InputMask = InputMask;
    exports.MaskElement = MaskElement;
    exports.Masked = Masked;
    exports.MaskedDate = MaskedDate;
    exports.MaskedDynamic = MaskedDynamic;
    exports.MaskedEnum = MaskedEnum;
    exports.MaskedFunction = MaskedFunction;
    exports.MaskedNumber = MaskedNumber;
    exports.MaskedPattern = MaskedPattern;
    exports.MaskedRange = MaskedRange;
    exports.MaskedRegExp = MaskedRegExp;
    exports.PIPE_TYPE = PIPE_TYPE;
    exports.createMask = createMask;
    exports.createPipe = createPipe;
    exports.default = IMask;
    exports.pipe = pipe;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=imask.js.map
/**!
 * lightgallery.js | 1.4.0 | October 13th 2020
 * http://sachinchoolur.github.io/lightgallery.js/
 * Copyright (c) 2016 Sachin N; 
 * @license GPLv3 
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Lightgallery=e()}}(function(){var e,t,s;return function(){function e(t,s,l){function i(r,a){if(!s[r]){if(!t[r]){var d="function"==typeof require&&require;if(!a&&d)return d(r,!0);if(o)return o(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var u=s[r]={exports:{}};t[r][0].call(u.exports,function(e){return i(t[r][1][e]||e)},u,u.exports,e,t,s,l)}return s[r].exports}for(var o="function"==typeof require&&require,r=0;r<l.length;r++)i(l[r]);return i}return e}()({1:[function(t,s,l){!function(t,s){if("function"==typeof e&&e.amd)e(["exports"],s);else if(void 0!==l)s(l);else{var i={exports:{}};s(i.exports),t.lgUtils=i.exports}}(this,function(e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var t={getAttribute:function e(t,s){return t[s]},setAttribute:function e(t,s,l){t[s]=l},wrap:function e(t,s){if(t){var l=document.createElement("div");l.className=s,t.parentNode.insertBefore(l,t),t.parentNode.removeChild(t),l.appendChild(t)}},addClass:function e(t,s){t&&(t.classList?t.classList.add(s):t.className+=" "+s)},removeClass:function e(t,s){t&&(t.classList?t.classList.remove(s):t.className=t.className.replace(new RegExp("(^|\\b)"+s.split(" ").join("|")+"(\\b|$)","gi")," "))},hasClass:function e(t,s){return t.classList?t.classList.contains(s):new RegExp("(^| )"+s+"( |$)","gi").test(t.className)},setVendor:function e(t,s,l){t&&(t.style[s.charAt(0).toLowerCase()+s.slice(1)]=l,t.style["webkit"+s]=l,t.style["moz"+s]=l,t.style["ms"+s]=l,t.style["o"+s]=l)},trigger:function e(t,s){var l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;if(t){var i=new CustomEvent(s,{detail:l});t.dispatchEvent(i)}},Listener:{uid:0},on:function e(s,l,i){var o=this;s&&l.split(" ").forEach(function(e){var l=o.getAttribute(s,"lg-event-uid")||"";t.Listener.uid++,l+="&"+t.Listener.uid,o.setAttribute(s,"lg-event-uid",l),t.Listener[e+t.Listener.uid]=i,s.addEventListener(e.split(".")[0],i,!1)})},off:function e(s,l){if(s){var i=this.getAttribute(s,"lg-event-uid");if(i){i=i.split("&");for(var o=0;o<i.length;o++)if(i[o]){var r=l+i[o];if("."===r.substring(0,1))for(var a in t.Listener)t.Listener.hasOwnProperty(a)&&a.split(".").indexOf(r.split(".")[1])>-1&&(s.removeEventListener(a.split(".")[0],t.Listener[a]),this.setAttribute(s,"lg-event-uid",this.getAttribute(s,"lg-event-uid").replace("&"+i[o],"")),delete t.Listener[a]);else s.removeEventListener(r.split(".")[0],t.Listener[r]),this.setAttribute(s,"lg-event-uid",this.getAttribute(s,"lg-event-uid").replace("&"+i[o],"")),delete t.Listener[r]}}}},param:function e(t){return Object.keys(t).map(function(e){return encodeURIComponent(e)+"="+encodeURIComponent(t[e])}).join("&")}};e.default=t})},{}],2:[function(t,s,l){!function(s,i){if("function"==typeof e&&e.amd)e(["./lg-utils"],i);else if(void 0!==l)i(t("./lg-utils"));else{var o={exports:{}};i(s.lgUtils),s.lightgallery=o.exports}}(this,function(e){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(this.el=e,this.s=i({},o,t),this.s.dynamic&&"undefined"!==this.s.dynamicEl&&this.s.dynamicEl.constructor===Array&&!this.s.dynamicEl.length)throw"When using dynamic mode, you must also define dynamicEl as an Array.";return this.modules={},this.lGalleryOn=!1,this.lgBusy=!1,this.hideBartimeout=!1,this.isTouch="ontouchstart"in document.documentElement,this.s.slideEndAnimatoin&&(this.s.hideControlOnEnd=!1),this.items=[],this.s.dynamic?this.items=this.s.dynamicEl:"this"===this.s.selector?this.items.push(this.el):""!==this.s.selector?this.s.selectWithin?this.items=document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector):this.items=this.el.querySelectorAll(this.s.selector):this.items=this.el.children,this.___slide="",this.outer="",this.init(),this}var l=t(e),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var l in s)Object.prototype.hasOwnProperty.call(s,l)&&(e[l]=s[l])}return e};!function(){function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var s=document.createEvent("CustomEvent");return s.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),s}if("function"==typeof window.CustomEvent)return!1;e.prototype=window.Event.prototype,window.CustomEvent=e}(),window.utils=l.default,window.lgData={uid:0},window.lgModules={};var o={mode:"lg-slide",cssEasing:"ease",easing:"linear",speed:600,height:"100%",width:"100%",addClass:"",startClass:"lg-start-zoom",backdropDuration:150,hideBarsDelay:6e3,useLeft:!1,ariaLabelledby:"",ariaDescribedby:"",closable:!0,loop:!0,escKey:!0,keyPress:!0,controls:!0,slideEndAnimatoin:!0,hideControlOnEnd:!1,mousewheel:!1,getCaptionFromTitleOrAlt:!0,appendSubHtmlTo:".lg-sub-html",subHtmlSelectorRelative:!1,preload:1,showAfterLoad:!0,selector:"",selectWithin:"",nextHtml:"",prevHtml:"",index:!1,iframeMaxWidth:"100%",download:!0,counter:!0,appendCounterTo:".lg-toolbar",swipeThreshold:50,enableSwipe:!0,enableDrag:!0,dynamic:!1,dynamicEl:[],galleryId:1,supportLegacyBrowser:!0};s.prototype.init=function(){var e=this;e.s.preload>e.items.length&&(e.s.preload=e.items.length);var t=window.location.hash;if(t.indexOf("lg="+this.s.galleryId)>0&&(e.index=parseInt(t.split("&slide=")[1],10),l.default.addClass(document.body,"lg-from-hash"),l.default.hasClass(document.body,"lg-on")||(l.default.addClass(document.body,"lg-on"),setTimeout(function(){e.build(e.index)}))),e.s.dynamic)l.default.trigger(this.el,"onBeforeOpen"),e.index=e.s.index||0,l.default.hasClass(document.body,"lg-on")||(l.default.addClass(document.body,"lg-on"),setTimeout(function(){e.build(e.index)}));else for(var s=0;s<e.items.length;s++)!function(t){l.default.on(e.items[t],"click.lgcustom",function(s){s.preventDefault(),l.default.trigger(e.el,"onBeforeOpen"),e.index=e.s.index||t,l.default.hasClass(document.body,"lg-on")||(e.build(e.index),l.default.addClass(document.body,"lg-on"))})}(s)},s.prototype.build=function(e){var t=this;t.structure();for(var s in window.lgModules)t.modules[s]=new window.lgModules[s](t.el);if(t.slide(e,!1,!1),t.s.keyPress&&t.keyPress(),t.items.length>1&&(t.arrow(),setTimeout(function(){t.enableDrag(),t.enableSwipe()},50),t.s.mousewheel&&t.mousewheel()),t.counter(),t.closeGallery(),l.default.trigger(t.el,"onAfterOpen"),t.s.hideBarsDelay>0){var i=setTimeout(function(){l.default.addClass(t.outer,"lg-hide-items")},t.s.hideBarsDelay);l.default.on(t.outer,"mousemove.lg click.lg touchstart.lg",function(){clearTimeout(i),l.default.removeClass(t.outer,"lg-hide-items"),clearTimeout(t.hideBartimeout),t.hideBartimeout=setTimeout(function(){l.default.addClass(t.outer,"lg-hide-items")},t.s.hideBarsDelay)})}},s.prototype.structure=function(){var e="",t="",s=0,i="",o,r=this;for(document.body.insertAdjacentHTML("beforeend",'<div class="lg-backdrop"></div>'),l.default.setVendor(document.querySelector(".lg-backdrop"),"TransitionDuration",this.s.backdropDuration+"ms"),s=0;s<this.items.length;s++)e+='<div class="lg-item"></div>';if(this.s.controls&&this.items.length>1&&(t='<div class="lg-actions"><button type="button" aria-label="Previous slide" class="lg-prev lg-icon">'+this.s.prevHtml+'</button><button type="button" aria-label="Next slide" class="lg-next lg-icon">'+this.s.nextHtml+"</button></div>"),".lg-sub-html"===this.s.appendSubHtmlTo&&(i='<div role="status" aria-live="polite" class="lg-sub-html"></div>'),o='<div tabindex="-1" aria-modal="true" '+(this.s.ariaLabelledby?'aria-labelledby="'+this.s.ariaLabelledby+'"':"")+" "+(this.s.ariaDescribedby?'aria-describedby="'+this.s.ariaDescribedby+'"':"")+' role="dialog" class="lg-outer '+this.s.addClass+" "+this.s.startClass+'"><div class="lg" style="width:'+this.s.width+"; height:"+this.s.height+'"><div class="lg-inner">'+e+'</div><div class="lg-toolbar lg-group"><button type="button" aria-label="Close gallery" class="lg-close lg-icon"></button></div>'+t+i+"</div></div>",document.body.insertAdjacentHTML("beforeend",o),this.outer=document.querySelector(".lg-outer"),this.outer.focus(),this.___slide=this.outer.querySelectorAll(".lg-item"),this.s.useLeft?(l.default.addClass(this.outer,"lg-use-left"),this.s.mode="lg-slide"):l.default.addClass(this.outer,"lg-use-css3"),r.setTop(),l.default.on(window,"resize.lg orientationchange.lg",function(){setTimeout(function(){r.setTop()},100)}),l.default.addClass(this.___slide[this.index],"lg-current"),this.doCss()?l.default.addClass(this.outer,"lg-css3"):(l.default.addClass(this.outer,"lg-css"),this.s.speed=0),l.default.addClass(this.outer,this.s.mode),this.s.enableDrag&&this.items.length>1&&l.default.addClass(this.outer,"lg-grab"),this.s.showAfterLoad&&l.default.addClass(this.outer,"lg-show-after-load"),this.doCss()){var a=this.outer.querySelector(".lg-inner");l.default.setVendor(a,"TransitionTimingFunction",this.s.cssEasing),l.default.setVendor(a,"TransitionDuration",this.s.speed+"ms")}setTimeout(function(){l.default.addClass(document.querySelector(".lg-backdrop"),"in")}),setTimeout(function(){l.default.addClass(r.outer,"lg-visible")},this.s.backdropDuration),this.s.download&&this.outer.querySelector(".lg-toolbar").insertAdjacentHTML("beforeend",'<a id="lg-download" aria-label="Download" target="_blank" download class="lg-download lg-icon"></a>'),this.prevScrollTop=document.documentElement.scrollTop||document.body.scrollTop},s.prototype.setTop=function(){if("100%"!==this.s.height){var e=window.innerHeight,t=(e-parseInt(this.s.height,10))/2,s=this.outer.querySelector(".lg");e>=parseInt(this.s.height,10)?s.style.top=t+"px":s.style.top="0px"}},s.prototype.doCss=function(){return!!function e(){var t=["transition","MozTransition","WebkitTransition","OTransition","msTransition","KhtmlTransition"],s=document.documentElement,l=0;for(l=0;l<t.length;l++)if(t[l]in s.style)return!0}()},s.prototype.isVideo=function(e,t){var s;if(s=this.s.dynamic?this.s.dynamicEl[t].html:this.items[t].getAttribute("data-html"),!e&&s)return{html5:!0};var l=e.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),i=e.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),o=e.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),r=e.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);return l?{youtube:l}:i?{vimeo:i}:o?{dailymotion:o}:r?{vk:r}:void 0},s.prototype.counter=function(){this.s.counter&&this.outer.querySelector(this.s.appendCounterTo).insertAdjacentHTML("beforeend",'<div id="lg-counter" role="status" aria-live="polite"><span id="lg-counter-current">'+(parseInt(this.index,10)+1)+'</span> / <span id="lg-counter-all">'+this.items.length+"</span></div>")},s.prototype.addHtml=function(e){var t=null,s;if(this.s.dynamic?t=this.s.dynamicEl[e].subHtml:(s=this.items[e],t=s.getAttribute("data-sub-html"),this.s.getCaptionFromTitleOrAlt&&!t&&(t=s.getAttribute("title"))&&s.querySelector("img")&&(t=s.querySelector("img").getAttribute("alt"))),void 0!==t&&null!==t){var i=t.substring(0,1);"."!==i&&"#"!==i||(t=this.s.subHtmlSelectorRelative&&!this.s.dynamic?s.querySelector(t).innerHTML:document.querySelector(t).innerHTML)}else t="";".lg-sub-html"===this.s.appendSubHtmlTo?this.outer.querySelector(this.s.appendSubHtmlTo).innerHTML=t:this.___slide[e].insertAdjacentHTML("beforeend",t),void 0!==t&&null!==t&&(""===t?l.default.addClass(this.outer.querySelector(this.s.appendSubHtmlTo),"lg-empty-html"):l.default.removeClass(this.outer.querySelector(this.s.appendSubHtmlTo),"lg-empty-html")),l.default.trigger(this.el,"onAfterAppendSubHtml",{index:e})},s.prototype.preload=function(e){var t=1,s=1;for(t=1;t<=this.s.preload&&!(t>=this.items.length-e);t++)this.loadContent(e+t,!1,0);for(s=1;s<=this.s.preload&&!(e-s<0);s++)this.loadContent(e-s,!1,0)},s.prototype.loadContent=function(e,t,s){var i=this,o=!1,r,a,d,n,u,c,g,f=function e(t){for(var s=[],l=[],i=0;i<t.length;i++){var o=t[i].split(" ");""===o[0]&&o.splice(0,1),l.push(o[0]),s.push(o[1])}for(var r=window.innerWidth,d=0;d<s.length;d++)if(parseInt(s[d],10)>r){a=l[d];break}};if(i.s.dynamic){if(i.s.dynamicEl[e].poster&&(o=!0,d=i.s.dynamicEl[e].poster),c=i.s.dynamicEl[e].html,a=i.s.dynamicEl[e].src,g=i.s.dynamicEl[e].alt,i.s.dynamicEl[e].responsive){f(i.s.dynamicEl[e].responsive.split(","))}n=i.s.dynamicEl[e].srcset,u=i.s.dynamicEl[e].sizes}else{if(i.items[e].getAttribute("data-poster")&&(o=!0,d=i.items[e].getAttribute("data-poster")),c=i.items[e].getAttribute("data-html"),a=i.items[e].getAttribute("href")||i.items[e].getAttribute("data-src"),g=i.items[e].getAttribute("title"),i.items[e].querySelector("img")&&(g=g||i.items[e].querySelector("img").getAttribute("alt")),i.items[e].getAttribute("data-responsive")){f(i.items[e].getAttribute("data-responsive").split(","))}n=i.items[e].getAttribute("data-srcset"),u=i.items[e].getAttribute("data-sizes")}var h=!1;i.s.dynamic?i.s.dynamicEl[e].iframe&&(h=!0):"true"===i.items[e].getAttribute("data-iframe")&&(h=!0);var m=i.isVideo(a,e);if(!l.default.hasClass(i.___slide[e],"lg-loaded")){if(h)i.___slide[e].insertAdjacentHTML("afterbegin",'<div class="lg-video-cont" style="max-width:'+i.s.iframeMaxWidth+'"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="'+a+'"  allowfullscreen="true"></iframe></div></div>');else if(o){var p="";p=m&&m.youtube?"lg-has-youtube":m&&m.vimeo?"lg-has-vimeo":"lg-has-html5",i.___slide[e].insertAdjacentHTML("beforeend",'<div class="lg-video-cont '+p+' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="'+d+'" /></div></div>')}else m?(i.___slide[e].insertAdjacentHTML("beforeend",'<div class="lg-video-cont "><div class="lg-video"></div></div>'),l.default.trigger(i.el,"hasVideo",{index:e,src:a,html:c})):(g=g?'alt="'+g+'"':"",i.___slide[e].insertAdjacentHTML("beforeend",'<div class="lg-img-wrap"><img class="lg-object lg-image" '+g+' src="'+a+'" /></div>'));if(l.default.trigger(i.el,"onAferAppendSlide",{index:e}),r=i.___slide[e].querySelector(".lg-object"),u&&r.setAttribute("sizes",u),n&&(r.setAttribute("srcset",n),this.s.supportLegacyBrowser))try{picturefill({elements:[r[0]]})}catch(e){console.warn("If you want srcset to be supported for older browsers, please include picturefil javascript library in your document.")}".lg-sub-html"!==this.s.appendSubHtmlTo&&i.addHtml(e),l.default.addClass(i.___slide[e],"lg-loaded")}l.default.on(i.___slide[e].querySelector(".lg-object"),"load.lg error.lg",function(){var t=0;s&&!l.default.hasClass(document.body,"lg-from-hash")&&(t=s),setTimeout(function(){l.default.addClass(i.___slide[e],"lg-complete"),l.default.trigger(i.el,"onSlideItemLoad",{index:e,delay:s||0})},t)}),m&&m.html5&&!o&&l.default.addClass(i.___slide[e],"lg-complete"),!0===t&&(l.default.hasClass(i.___slide[e],"lg-complete")?i.preload(e):l.default.on(i.___slide[e].querySelector(".lg-object"),"load.lg error.lg",function(){i.preload(e)}))},s.prototype.slide=function(e,t,s){for(var i=0,o=0;o<this.___slide.length;o++)if(l.default.hasClass(this.___slide[o],"lg-current")){i=o;break}var r=this;if(!r.lGalleryOn||i!==e){var a=this.___slide.length,d=r.lGalleryOn?this.s.speed:0,n=!1,u=!1;if(!r.lgBusy){if(this.s.download){var c;c=r.s.dynamic?!1!==r.s.dynamicEl[e].downloadUrl&&(r.s.dynamicEl[e].downloadUrl||r.s.dynamicEl[e].src):"false"!==r.items[e].getAttribute("data-download-url")&&(r.items[e].getAttribute("data-download-url")||r.items[e].getAttribute("href")||r.items[e].getAttribute("data-src")),c?(document.getElementById("lg-download").setAttribute("href",c),l.default.removeClass(r.outer,"lg-hide-download")):l.default.addClass(r.outer,"lg-hide-download")}if(l.default.trigger(r.el,"onBeforeSlide",{prevIndex:i,index:e,fromTouch:t,fromThumb:s}),r.lgBusy=!0,clearTimeout(r.hideBartimeout),".lg-sub-html"===this.s.appendSubHtmlTo&&setTimeout(function(){r.addHtml(e)},d),this.arrowDisable(e),t){var g=e-1,f=e+1;0===e&&i===a-1?(f=0,g=a-1):e===a-1&&0===i&&(f=0,g=a-1),l.default.removeClass(r.outer.querySelector(".lg-prev-slide"),"lg-prev-slide"),l.default.removeClass(r.outer.querySelector(".lg-current"),"lg-current"),l.default.removeClass(r.outer.querySelector(".lg-next-slide"),"lg-next-slide"),l.default.addClass(r.___slide[g],"lg-prev-slide"),l.default.addClass(r.___slide[f],"lg-next-slide"),l.default.addClass(r.___slide[e],"lg-current")}else{l.default.addClass(r.outer,"lg-no-trans");for(var h=0;h<this.___slide.length;h++)l.default.removeClass(this.___slide[h],"lg-prev-slide"),l.default.removeClass(this.___slide[h],"lg-next-slide");e<i?(u=!0,0!==e||i!==a-1||s||(u=!1,n=!0)):e>i&&(n=!0,e!==a-1||0!==i||s||(u=!0,n=!1)),u?(l.default.addClass(this.___slide[e],"lg-prev-slide"),l.default.addClass(this.___slide[i],"lg-next-slide")):n&&(l.default.addClass(this.___slide[e],"lg-next-slide"),l.default.addClass(this.___slide[i],"lg-prev-slide")),setTimeout(function(){l.default.removeClass(r.outer.querySelector(".lg-current"),"lg-current"),l.default.addClass(r.___slide[e],"lg-current"),l.default.removeClass(r.outer,"lg-no-trans")},50)}r.lGalleryOn?(setTimeout(function(){r.loadContent(e,!0,0)},this.s.speed+50),setTimeout(function(){r.lgBusy=!1,l.default.trigger(r.el,"onAfterSlide",{prevIndex:i,index:e,fromTouch:t,fromThumb:s})},this.s.speed)):(r.loadContent(e,!0,r.s.backdropDuration),r.lgBusy=!1,l.default.trigger(r.el,"onAfterSlide",{prevIndex:i,index:e,fromTouch:t,fromThumb:s})),r.lGalleryOn=!0,this.s.counter&&document.getElementById("lg-counter-current")&&(document.getElementById("lg-counter-current").innerHTML=e+1)}}},s.prototype.goToNextSlide=function(e){var t=this;t.lgBusy||(t.index+1<t.___slide.length?(t.index++,l.default.trigger(t.el,"onBeforeNextSlide",{index:t.index}),t.slide(t.index,e,!1)):t.s.loop?(t.index=0,l.default.trigger(t.el,"onBeforeNextSlide",{index:t.index}),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(l.default.addClass(t.outer,"lg-right-end"),setTimeout(function(){l.default.removeClass(t.outer,"lg-right-end")},400)))},s.prototype.goToPrevSlide=function(e){var t=this;t.lgBusy||(t.index>0?(t.index--,l.default.trigger(t.el,"onBeforePrevSlide",{index:t.index,fromTouch:e}),t.slide(t.index,e,!1)):t.s.loop?(t.index=t.items.length-1,l.default.trigger(t.el,"onBeforePrevSlide",{index:t.index,fromTouch:e}),t.slide(t.index,e,!1)):t.s.slideEndAnimatoin&&(l.default.addClass(t.outer,"lg-left-end"),setTimeout(function(){l.default.removeClass(t.outer,"lg-left-end")},400)))},s.prototype.keyPress=function(){var e=this;this.items.length>1&&l.default.on(window,"keyup.lg",function(t){e.items.length>1&&(37===t.keyCode&&(t.preventDefault(),e.goToPrevSlide()),39===t.keyCode&&(t.preventDefault(),e.goToNextSlide()))}),l.default.on(window,"keydown.lg",function(t){!0===e.s.escKey&&27===t.keyCode&&(t.preventDefault(),l.default.hasClass(e.outer,"lg-thumb-open")?l.default.removeClass(e.outer,"lg-thumb-open"):e.destroy())})},s.prototype.arrow=function(){var e=this;l.default.on(this.outer.querySelector(".lg-prev"),"click.lg",function(){e.goToPrevSlide()}),l.default.on(this.outer.querySelector(".lg-next"),"click.lg",function(){e.goToNextSlide()})},s.prototype.arrowDisable=function(e){if(!this.s.loop&&this.s.hideControlOnEnd){var t=this.outer.querySelector(".lg-next"),s=this.outer.querySelector(".lg-prev");e+1<this.___slide.length?(t.removeAttribute("disabled"),l.default.removeClass(t,"disabled")):(t.setAttribute("disabled","disabled"),l.default.addClass(t,"disabled")),e>0?(s.removeAttribute("disabled"),l.default.removeClass(s,"disabled")):(s.setAttribute("disabled","disabled"),l.default.addClass(s,"disabled"))}},s.prototype.setTranslate=function(e,t,s){this.s.useLeft?e.style.left=t:l.default.setVendor(e,"Transform","translate3d("+t+"px, "+s+"px, 0px)")},s.prototype.touchMove=function(e,t){var s=t-e;Math.abs(s)>15&&(l.default.addClass(this.outer,"lg-dragging"),this.setTranslate(this.___slide[this.index],s,0),this.setTranslate(document.querySelector(".lg-prev-slide"),-this.___slide[this.index].clientWidth+s,0),this.setTranslate(document.querySelector(".lg-next-slide"),this.___slide[this.index].clientWidth+s,0))},s.prototype.touchEnd=function(e){var t=this;"lg-slide"!==t.s.mode&&l.default.addClass(t.outer,"lg-slide");for(var s=0;s<this.___slide.length;s++)l.default.hasClass(this.___slide[s],"lg-current")||l.default.hasClass(this.___slide[s],"lg-prev-slide")||l.default.hasClass(this.___slide[s],"lg-next-slide")||(this.___slide[s].style.opacity="0");setTimeout(function(){l.default.removeClass(t.outer,"lg-dragging"),e<0&&Math.abs(e)>t.s.swipeThreshold?t.goToNextSlide(!0):e>0&&Math.abs(e)>t.s.swipeThreshold?t.goToPrevSlide(!0):Math.abs(e)<5&&l.default.trigger(t.el,"onSlideClick");for(var s=0;s<t.___slide.length;s++)t.___slide[s].removeAttribute("style")}),setTimeout(function(){l.default.hasClass(t.outer,"lg-dragging")||"lg-slide"===t.s.mode||l.default.removeClass(t.outer,"lg-slide")},t.s.speed+100)},s.prototype.enableSwipe=function(){var e=this,t=0,s=0,i=!1;if(e.s.enableSwipe&&e.isTouch&&e.doCss()){for(var o=0;o<e.___slide.length;o++)l.default.on(e.___slide[o],"touchstart.lg",function(s){l.default.hasClass(e.outer,"lg-zoomed")||e.lgBusy||(s.preventDefault(),e.manageSwipeClass(),t=s.targetTouches[0].pageX)});for(var r=0;r<e.___slide.length;r++)l.default.on(e.___slide[r],"touchmove.lg",function(o){l.default.hasClass(e.outer,"lg-zoomed")||(o.preventDefault(),s=o.targetTouches[0].pageX,e.touchMove(t,s),i=!0)});for(var a=0;a<e.___slide.length;a++)l.default.on(e.___slide[a],"touchend.lg",function(){l.default.hasClass(e.outer,"lg-zoomed")||(i?(i=!1,e.touchEnd(s-t)):l.default.trigger(e.el,"onSlideClick"))})}},s.prototype.enableDrag=function(){var e=this,t=0,s=0,i=!1,o=!1;if(e.s.enableDrag&&!e.isTouch&&e.doCss()){for(var r=0;r<e.___slide.length;r++)l.default.on(e.___slide[r],"mousedown.lg",function(s){l.default.hasClass(e.outer,"lg-zoomed")||(l.default.hasClass(s.target,"lg-object")||l.default.hasClass(s.target,"lg-video-play"))&&(s.preventDefault(),e.lgBusy||(e.manageSwipeClass(),t=s.pageX,i=!0,e.outer.scrollLeft+=1,e.outer.scrollLeft-=1,l.default.removeClass(e.outer,"lg-grab"),l.default.addClass(e.outer,"lg-grabbing"),l.default.trigger(e.el,"onDragstart")))});l.default.on(window,"mousemove.lg",function(r){i&&(o=!0,s=r.pageX,e.touchMove(t,s),l.default.trigger(e.el,"onDragmove"))}),l.default.on(window,"mouseup.lg",function(r){o?(o=!1,e.touchEnd(s-t),l.default.trigger(e.el,"onDragend")):(l.default.hasClass(r.target,"lg-object")||l.default.hasClass(r.target,"lg-video-play"))&&l.default.trigger(e.el,"onSlideClick"),i&&(i=!1,l.default.removeClass(e.outer,"lg-grabbing"),l.default.addClass(e.outer,"lg-grab"))})}},s.prototype.manageSwipeClass=function(){var e=this.index+1,t=this.index-1,s=this.___slide.length;this.s.loop&&(0===this.index?t=s-1:this.index===s-1&&(e=0));for(var i=0;i<this.___slide.length;i++)l.default.removeClass(this.___slide[i],"lg-next-slide"),l.default.removeClass(this.___slide[i],"lg-prev-slide");t>-1&&l.default.addClass(this.___slide[t],"lg-prev-slide"),l.default.addClass(this.___slide[e],"lg-next-slide")},s.prototype.mousewheel=function(){var e=this;l.default.on(e.outer,"mousewheel.lg",function(t){t.deltaY&&(t.deltaY>0?e.goToPrevSlide():e.goToNextSlide(),t.preventDefault())})},s.prototype.closeGallery=function(){var e=this,t=!1;l.default.on(this.outer.querySelector(".lg-close"),"click.lg",function(){e.destroy()}),e.s.closable&&(l.default.on(e.outer,"mousedown.lg",function(e){t=!!(l.default.hasClass(e.target,"lg-outer")||l.default.hasClass(e.target,"lg-item")||l.default.hasClass(e.target,"lg-img-wrap"))}),l.default.on(e.outer,"mouseup.lg",function(s){(l.default.hasClass(s.target,"lg-outer")||l.default.hasClass(s.target,"lg-item")||l.default.hasClass(s.target,"lg-img-wrap")&&t)&&(l.default.hasClass(e.outer,"lg-dragging")||e.destroy())}))},s.prototype.destroy=function(e){var t=this;if(e||l.default.trigger(t.el,"onBeforeClose"),document.body.scrollTop=t.prevScrollTop,document.documentElement.scrollTop=t.prevScrollTop,e){if(!t.s.dynamic)for(var s=0;s<this.items.length;s++)l.default.off(this.items[s],".lg"),l.default.off(this.items[s],".lgcustom");var i=t.el.getAttribute("lg-uid");delete window.lgData[i],t.el.removeAttribute("lg-uid")}l.default.off(this.el,".lgtm");for(var o in window.lgModules)t.modules[o]&&t.modules[o].destroy(e);this.lGalleryOn=!1,clearTimeout(t.hideBartimeout),this.hideBartimeout=!1,l.default.off(window,".lg"),l.default.removeClass(document.body,"lg-on"),l.default.removeClass(document.body,"lg-from-hash"),t.outer&&l.default.removeClass(t.outer,"lg-visible"),l.default.removeClass(document.querySelector(".lg-backdrop"),"in"),setTimeout(function(){try{t.outer&&t.outer.parentNode.removeChild(t.outer),document.querySelector(".lg-backdrop")&&document.querySelector(".lg-backdrop").parentNode.removeChild(document.querySelector(".lg-backdrop")),e||l.default.trigger(t.el,"onCloseAfter"),t.el.focus()}catch(e){}},t.s.backdropDuration+50)},window.lightGallery=function(e,t){if(e)try{if(e.getAttribute("lg-uid"))window.lgData[e.getAttribute("lg-uid")].init();else{var l="lg"+window.lgData.uid++;window.lgData[l]=new s(e,t),e.setAttribute("lg-uid",l)}}catch(e){console.error("lightGallery has not initiated properly",e)}}})},{"./lg-utils":1}]},{},[2])(2)});
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.lozad=e()}(this,function(){"use strict";var t="undefined"!=typeof document&&document.documentMode,e={rootMargin:"0px",threshold:0,load:function(e){if("picture"===e.nodeName.toLowerCase()){var r=document.createElement("img");t&&e.getAttribute("data-iesrc")&&(r.src=e.getAttribute("data-iesrc")),e.getAttribute("data-alt")&&(r.alt=e.getAttribute("data-alt")),e.append(r)}if("video"===e.nodeName.toLowerCase()&&!e.getAttribute("data-src")&&e.children){for(var a=e.children,o=void 0,i=0;i<=a.length-1;i++)(o=a[i].getAttribute("data-src"))&&(a[i].src=o);e.load()}if(e.getAttribute("data-poster")&&(e.poster=e.getAttribute("data-poster")),e.getAttribute("data-src")&&(e.src=e.getAttribute("data-src")),e.getAttribute("data-srcset")&&e.setAttribute("srcset",e.getAttribute("data-srcset")),e.getAttribute("data-background-image"))e.style.backgroundImage="url('"+e.getAttribute("data-background-image").split(",").join("'),url('")+"')";else if(e.getAttribute("data-background-image-set")){var n=e.getAttribute("data-background-image-set").split(","),d=n[0].substr(0,n[0].indexOf(" "))||n[0];d=-1===d.indexOf("url(")?"url("+d+")":d,1===n.length?e.style.backgroundImage=d:e.setAttribute("style",(e.getAttribute("style")||"")+"background-image: "+d+"; background-image: -webkit-image-set("+n+"); background-image: image-set("+n+")")}e.getAttribute("data-toggle-class")&&e.classList.toggle(e.getAttribute("data-toggle-class"))},loaded:function(){}};function r(t){t.setAttribute("data-loaded",!0)}var a=function(t){return"true"===t.getAttribute("data-loaded")},o=function(t,e){return function(o,i){o.forEach(function(o){(o.intersectionRatio>0||o.isIntersecting)&&(i.unobserve(o.target),a(o.target)||(t(o.target),r(o.target),o.target.classList.add("lazyloaded"),e(o.target)))})}},i=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document;return t instanceof Element?[t]:t instanceof NodeList?t:e.querySelectorAll(t)};return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:".lozad",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},d=Object.assign({},e,n),u=d.root,s=d.rootMargin,g=d.threshold,c=d.load,l=d.loaded,b=void 0;return"undefined"!=typeof window&&window.IntersectionObserver&&(b=new IntersectionObserver(o(c,l),{root:u,rootMargin:s,threshold:g})),{observe:function(){for(var e=i(t,u),o=0;o<e.length;o++)a(e[o])||(b?b.observe(e[o]):(c(e[o]),r(e[o]),l(e[o])))},triggerLoad:function(t){a(t)||(c(t),r(t),l(t))},observer:b}}});

/* ! Picturefill - v2.3.1 - 2015-04-09
* http://scottjehl.github.io/picturefill
* Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
/* ! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function () {
  'use strict';

  // For browsers that support matchMedium api such as IE 9 and webkit
  var styleMedia = (window.styleMedia || window.media);

  // For those that don't support matchMedium
  if (!styleMedia) {
    var style = document.createElement('style'),
      script = document.getElementsByTagName('script')[0],
      info = null;

    style.type = 'text/css';
    style.id = 'matchmediajs-test';

    script.parentNode.insertBefore(style, script);

    // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
    info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

    styleMedia = {
      matchMedium: function (media) {
        var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

        // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
        if (style.styleSheet) {
          style.styleSheet.cssText = text;
        } else {
          style.textContent = text;
        }

        // Test if media query is true or false
        return info.width === '1px';
      }
    };
  }

  return function (media) {
    return {
      matches: styleMedia.matchMedium(media || 'all'),
      media: media || 'all'
    };
  };
}());
/* ! Picturefill - Responsive Images that work today.
*  Author: Scott Jehl, Filament Group, 2012 ( new proposal implemented by Shawn Jansepar )
*  License: MIT/GPLv2
*  Spec: http://picture.responsiveimages.org/
*/
(function (w, doc, image) {
  // Enable strict mode
  'use strict';

  function expose(picturefill) {
    /* expose picturefill */
    if (typeof module === 'object' && typeof module.exports === 'object') {
      // CommonJS, just export
      module.exports = picturefill;
    } else if (typeof define === 'function' && define.amd) {
      // AMD support
      define('picturefill', function () {
        return picturefill;
      });
    }
    if (typeof w === 'object') {
      // If no AMD and we are in the browser, attach to window
      w.picturefill = picturefill;
    }
  }

  // If picture is supported, well, that's awesome. Let's get outta here...
  if (w.HTMLPictureElement) {
    expose(function () { });
    return;
  }

  // HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
  doc.createElement('picture');

  // local object for method references and testing exposure
  var pf = w.picturefill || {};

  var regWDesc = /\s+\+?\d+(e\d+)?w/;

  // namespace
  pf.ns = 'picturefill';

  // srcset support test
  (function () {
    pf.srcsetSupported = 'srcset' in image;
    pf.sizesSupported = 'sizes' in image;
    pf.curSrcSupported = 'currentSrc' in image;
  })();

  // just a string trim workaround
  pf.trim = function (str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  };

  /**
   * Gets a string and returns the absolute URL
   * @param src
   * @returns {String} absolute URL
   */
  pf.makeUrl = (function () {
    var anchor = doc.createElement('a');
    return function (src) {
      anchor.href = src;
      return anchor.href;
    };
  })();

  /**
   * Shortcut method for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
   */
  pf.restrictsMixedContent = function () {
    return w.location.protocol === 'https:';
  };
  /**
   * Shortcut method for matchMedia ( for easy overriding in tests )
   */

  pf.matchesMedia = function (media) {
    return w.matchMedia && w.matchMedia(media).matches;
  };

  // Shortcut method for `devicePixelRatio` ( for easy overriding in tests )
  pf.getDpr = function () {
    return (w.devicePixelRatio || 1);
  };

  /**
   * Get width in css pixel value from a "length" value
   * http://dev.w3.org/csswg/css-values-3/#length-value
   */
  pf.getWidthFromLength = function (length) {
    var cssValue;
    // If a length is specified and doesn’t contain a percentage, and it is greater than 0 or using `calc`, use it. Else, abort.
    if (!(length && length.indexOf('%') > -1 === false && (parseFloat(length) > 0 || length.indexOf('calc(') > -1))) {
      return false;
    }

    /**
     * If length is specified in  `vw` units, use `%` instead since the div we’re measuring
     * is injected at the top of the document.
     *
     * TODO: maybe we should put this behind a feature test for `vw`? The risk of doing this is possible browser inconsistancies with vw vs %
     */
    length = length.replace('vw', '%');

    // Create a cached element for getting length value widths
    if (!pf.lengthEl) {
      pf.lengthEl = doc.createElement('div');

      // Positioning styles help prevent padding/margin/width on `html` or `body` from throwing calculations off.
      pf.lengthEl.style.cssText = 'border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden';

      // Add a class, so that everyone knows where this element comes from
      pf.lengthEl.className = 'helper-from-picturefill-js';
    }

    pf.lengthEl.style.width = '0px';

    try {
      pf.lengthEl.style.width = length;
    } catch (e) {}

    doc.body.appendChild(pf.lengthEl);

    cssValue = pf.lengthEl.offsetWidth;

    if (cssValue <= 0) {
      cssValue = false;
    }

    doc.body.removeChild(pf.lengthEl);

    return cssValue;
  };

  pf.detectTypeSupport = function (type, typeUri) {
    // based on Modernizr's lossless img-webp test
    // note: asynchronous
    var image = new w.Image();
    image.onerror = function () {
      pf.types[type] = false;
      picturefill();
    };
    image.onload = function () {
      pf.types[type] = image.width === 1;
      picturefill();
    };
    image.src = typeUri;

    return 'pending';
  };
  // container of supported mime types that one might need to qualify before using
  pf.types = pf.types || {};

  pf.initTypeDetects = function () {
    // Add support for standard mime types
    pf.types['image/jpeg'] = true;
    pf.types['image/gif'] = true;
    pf.types['image/png'] = true;
    pf.types['image/svg+xml'] = doc.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
    pf.types['image/webp'] = pf.detectTypeSupport('image/webp', 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=');
  };

  pf.verifyTypeSupport = function (source) {
    var type = source.getAttribute('type');
    // if type attribute exists, return test result, otherwise return true
    if (type === null || type === '') {
      return true;
    } else {
      var pfType = pf.types[type];
      // if the type test is a function, run it and return "pending" status. The function will rerun picturefill on pending elements once finished.
      if (typeof pfType === 'string' && pfType !== 'pending') {
        pf.types[type] = pf.detectTypeSupport(type, pfType);
        return 'pending';
      } else if (typeof pfType === 'function') {
        pfType();
        return 'pending';
      } else {
        return pfType;
      }
    }
  };

  // Parses an individual `size` and returns the length, and optional media query
  pf.parseSize = function (sourceSizeStr) {
    var match = /(\([^)]+\))?\s*(.+)/g.exec(sourceSizeStr);
    return {
      media: match && match[1],
      length: match && match[2]
    };
  };

  // Takes a string of sizes and returns the width in pixels as a number
  pf.findWidthFromSourceSize = function (sourceSizeListStr) {
    // Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
    //                            or (min-width:30em) calc(30% - 15px)
    var sourceSizeList = pf.trim(sourceSizeListStr).split(/\s*,\s*/),
      winningLength;

    for (var i = 0, len = sourceSizeList.length; i < len; i++) {
      // Match <media-condition>? length, ie ( min-width: 50em ) 100%
      var sourceSize = sourceSizeList[i],
        // Split "( min-width: 50em ) 100%" into separate strings
        parsedSize = pf.parseSize(sourceSize),
        length = parsedSize.length,
        media = parsedSize.media;

      if (!length) {
        continue;
      }
      // if there is no media query or it matches, choose this as our winning length
      if ((!media || pf.matchesMedia(media)) &&
        // pass the length to a method that can properly determine length
        // in pixels based on these formats: http://dev.w3.org/csswg/css-values-3/#length-value
        (winningLength = pf.getWidthFromLength(length))) {
        break;
      }
    }

    // if we have no winningLength fallback to 100vw
    return winningLength || Math.max(w.innerWidth || 0, doc.documentElement.clientWidth);
  };

  pf.parseSrcset = function (srcset) {
    /**
     * A lot of this was pulled from Boris Smus’ parser for the now-defunct WHATWG `srcset`
     * https://github.com/borismus/srcset-polyfill/blob/master/js/srcset-info.js
     *
     * 1. Let input (`srcset`) be the value passed to this algorithm.
     * 2. Let position be a pointer into input, initially pointing at the start of the string.
     * 3. Let raw candidates be an initially empty ordered list of URLs with associated
     *    unparsed descriptors. The order of entries in the list is the order in which entries
     *    are added to the list.
     */
    var candidates = [];

    while (srcset !== '') {
      srcset = srcset.replace(/^\s+/g, '');

      // 5. Collect a sequence of characters that are not space characters, and let that be url.
      var pos = srcset.search(/\s/g),
        url, descriptor = null;

      if (pos !== -1) {
        url = srcset.slice(0, pos);

        var last = url.slice(-1);

        // 6. If url ends with a U+002C COMMA character (,), remove that character from url
        // and let descriptors be the empty string. Otherwise, follow these substeps
        // 6.1. If url is empty, then jump to the step labeled descriptor parser.

        if (last === ',' || url === '') {
          url = url.replace(/,+$/, '');
          descriptor = '';
        }
        srcset = srcset.slice(pos + 1);

        // 6.2. Collect a sequence of characters that are not U+002C COMMA characters (,), and
        // let that be descriptors.
        if (descriptor === null) {
          var descpos = srcset.indexOf(',');
          if (descpos !== -1) {
            descriptor = srcset.slice(0, descpos);
            srcset = srcset.slice(descpos + 1);
          } else {
            descriptor = srcset;
            srcset = '';
          }
        }
      } else {
        url = srcset;
        srcset = '';
      }

      // 7. Add url to raw candidates, associated with descriptors.
      if (url || descriptor) {
        candidates.push({
          url: url,
          descriptor: descriptor
        });
      }
    }
    return candidates;
  };

  pf.parseDescriptor = function (descriptor, sizesattr) {
    // 11. Descriptor parser: Let candidates be an initially empty source set. The order of entries in the list
    // is the order in which entries are added to the list.
    var sizes = sizesattr || '100vw',
      sizeDescriptor = descriptor && descriptor.replace(/(^\s+|\s+$)/g, ''),
      widthInCssPixels = pf.findWidthFromSourceSize(sizes),
      resCandidate;

    if (sizeDescriptor) {
      var splitDescriptor = sizeDescriptor.split(' ');

      for (var i = splitDescriptor.length - 1; i >= 0; i--) {
        var curr = splitDescriptor[i],
          lastchar = curr && curr.slice(curr.length - 1);

        if ((lastchar === 'h' || lastchar === 'w') && !pf.sizesSupported) {
          resCandidate = parseFloat((parseInt(curr, 10) / widthInCssPixels));
        } else if (lastchar === 'x') {
          var res = curr && parseFloat(curr, 10);
          resCandidate = res && !isNaN(res) ? res : 1;
        }
      }
    }
    return resCandidate || 1;
  };

  /**
   * Takes a srcset in the form of url/
   * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
   *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
   *     "images/pic-small.png"
   * Get an array of image candidates in the form of
   *      {url: "/foo/bar.png", resolution: 1}
   * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
   * If sizes is specified, resolution is calculated
   */
  pf.getCandidatesFromSourceSet = function (srcset, sizes) {
    var candidates = pf.parseSrcset(srcset),
      formattedCandidates = [];

    for (var i = 0, len = candidates.length; i < len; i++) {
      var candidate = candidates[i];

      formattedCandidates.push({
        url: candidate.url,
        resolution: pf.parseDescriptor(candidate.descriptor, sizes)
      });
    }
    return formattedCandidates;
  };

  /**
   * if it's an img element and it has a srcset property,
   * we need to remove the attribute so we can manipulate src
   * (the property's existence infers native srcset support, and a srcset-supporting browser will prioritize srcset's value over our winning picture candidate)
   * this moves srcset's value to memory for later use and removes the attr
   */
  pf.dodgeSrcset = function (img) {
    if (img.srcset) {
      img[pf.ns].srcset = img.srcset;
      img.srcset = '';
      img.setAttribute('data-pfsrcset', img[pf.ns].srcset);
    }
  };

  // Accept a source or img element and process its srcset and sizes attrs
  pf.processSourceSet = function (el) {
    var srcset = el.getAttribute('srcset'),
      sizes = el.getAttribute('sizes'),
      candidates = [];

    // if it's an img element, use the cached srcset property (defined or not)
    if (el.nodeName.toUpperCase() === 'IMG' && el[pf.ns] && el[pf.ns].srcset) {
      srcset = el[pf.ns].srcset;
    }

    if (srcset) {
      candidates = pf.getCandidatesFromSourceSet(srcset, sizes);
    }
    return candidates;
  };

  pf.backfaceVisibilityFix = function (picImg) {
    // See: https://github.com/scottjehl/picturefill/issues/332
    var style = picImg.style || {},
      WebkitBackfaceVisibility = 'webkitBackfaceVisibility' in style,
      currentZoom = style.zoom;

    if (WebkitBackfaceVisibility) {
      style.zoom = '.999';

      WebkitBackfaceVisibility = picImg.offsetWidth;

      style.zoom = currentZoom;
    }
  };

  pf.setIntrinsicSize = (function () {
    var urlCache = {};
    var setSize = function (picImg, width, res) {
      if (width) {
        picImg.setAttribute('width', parseInt(width / res, 10));
      }
    };
    return function (picImg, bestCandidate) {
      var img;
      if (!picImg[pf.ns] || w.pfStopIntrinsicSize) {
        return;
      }
      if (picImg[pf.ns].dims === undefined) {
        picImg[pf.ns].dims = picImg.getAttribute('width') || picImg.getAttribute('height');
      }
      if (picImg[pf.ns].dims) {
        return;
      }

      if (bestCandidate.url in urlCache) {
        setSize(picImg, urlCache[bestCandidate.url], bestCandidate.resolution);
      } else {
        img = doc.createElement('img');
        img.onload = function () {
          urlCache[bestCandidate.url] = img.width;

          // IE 10/11 don't calculate width for svg outside document
          if (!urlCache[bestCandidate.url]) {
            try {
              doc.body.appendChild(img);
              urlCache[bestCandidate.url] = img.width || img.offsetWidth;
              doc.body.removeChild(img);
            } catch (e) {}
          }

          if (picImg.src === bestCandidate.url) {
            setSize(picImg, urlCache[bestCandidate.url], bestCandidate.resolution);
          }
          picImg = null;
          img.onload = null;
          img = null;
        };
        img.src = bestCandidate.url;
      }
    };
  })();

  pf.applyBestCandidate = function (candidates, picImg) {
    var candidate,
      length,
      bestCandidate;

    candidates.sort(pf.ascendingSort);

    length = candidates.length;
    bestCandidate = candidates[length - 1];

    for (var i = 0; i < length; i++) {
      candidate = candidates[i];
      if (candidate.resolution >= pf.getDpr()) {
        bestCandidate = candidate;
        break;
      }
    }

    if (bestCandidate) {

      bestCandidate.url = pf.makeUrl(bestCandidate.url);

      if (picImg.src !== bestCandidate.url) {
        if (pf.restrictsMixedContent() && bestCandidate.url.substr(0, 'http:'.length).toLowerCase() === 'http:') {
          if (window.console !== undefined) {
            console.warn('Blocked mixed content image ' + bestCandidate.url);
          }
        } else {
          picImg.src = bestCandidate.url;
          // currentSrc attribute and property to match
          // http://picture.responsiveimages.org/#the-img-element
          if (!pf.curSrcSupported) {
            picImg.currentSrc = picImg.src;
          }

          pf.backfaceVisibilityFix(picImg);
        }
      }

      pf.setIntrinsicSize(picImg, bestCandidate);
    }
  };

  pf.ascendingSort = function (a, b) {
    return a.resolution - b.resolution;
  };

  /**
   * In IE9, <source> elements get removed if they aren't children of
   * video elements. Thus, we conditionally wrap source elements
   * using <!--[if IE 9]><video style="display: none;"><![endif]-->
   * and must account for that here by moving those source elements
   * back into the picture element.
   */
  pf.removeVideoShim = function (picture) {
    var videos = picture.getElementsByTagName('video');
    if (videos.length) {
      var video = videos[0],
        vsources = video.getElementsByTagName('source');
      while (vsources.length) {
        picture.insertBefore(vsources[0], video);
      }
      // Remove the video element once we're finished removing its children
      video.parentNode.removeChild(video);
    }
  };

  /**
   * Find all `img` elements, and add them to the candidate list if they have
   * a `picture` parent, a `sizes` attribute in basic `srcset` supporting browsers,
   * a `srcset` attribute at all, and they haven’t been evaluated already.
   */
  pf.getAllElements = function () {
    var elems = [],
      imgs = doc.getElementsByTagName('img');

    for (var h = 0, len = imgs.length; h < len; h++) {
      var currImg = imgs[h];

      if (currImg.parentNode.nodeName.toUpperCase() === 'PICTURE' ||
      (currImg.getAttribute('srcset') !== null) || currImg[pf.ns] && currImg[pf.ns].srcset !== null) {
        elems.push(currImg);
      }
    }
    return elems;
  };

  pf.getMatch = function (img, picture) {
    var sources = picture.childNodes,
      match;

    // Go through each child, and if they have media queries, evaluate them
    for (var j = 0, slen = sources.length; j < slen; j++) {
      var source = sources[j];

      // ignore non-element nodes
      if (source.nodeType !== 1) {
        continue;
      }

      // Hitting the `img` element that started everything stops the search for `sources`.
      // If no previous `source` matches, the `img` itself is evaluated later.
      if (source === img) {
        return match;
      }

      // ignore non-`source` nodes
      if (source.nodeName.toUpperCase() !== 'SOURCE') {
        continue;
      }
      // if it's a source element that has the `src` property set, throw a warning in the console
      if (source.getAttribute('src') !== null && typeof console !== undefined) {
        console.warn('The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.');
      }

      var media = source.getAttribute('media');

      // if source does not have a srcset attribute, skip
      if (!source.getAttribute('srcset')) {
        continue;
      }

      // if there's no media specified, OR w.matchMedia is supported
      if ((!media || pf.matchesMedia(media))) {
        var typeSupported = pf.verifyTypeSupport(source);

        if (typeSupported === true) {
          match = source;
          break;
        } else if (typeSupported === 'pending') {
          return false;
        }
      }
    }

    return match;
  };

  function picturefill(opt) {
    var elements,
      element,
      parent,
      firstMatch,
      candidates,
      options = opt || {};

    elements = options.elements || pf.getAllElements();

    // Loop through all elements
    for (var i = 0, plen = elements.length; i < plen; i++) {
      element = elements[i];
      parent = element.parentNode;
      firstMatch = undefined;
      candidates = undefined;

      // immediately skip non-`img` nodes
      if (element.nodeName.toUpperCase() !== 'IMG') {
        continue;
      }

      // expando for caching data on the img
      if (!element[pf.ns]) {
        element[pf.ns] = {};
      }

      // if the element has already been evaluated, skip it unless
      // `options.reevaluate` is set to true ( this, for example,
      // is set to true when running `picturefill` on `resize` ).
      if (!options.reevaluate && element[pf.ns].evaluated) {
        continue;
      }

      // if `img` is in a `picture` element
      if (parent && parent.nodeName.toUpperCase() === 'PICTURE') {

        // IE9 video workaround
        pf.removeVideoShim(parent);

        // return the first match which might undefined
        // returns false if there is a pending source
        // TODO the return type here is brutal, cleanup
        firstMatch = pf.getMatch(element, parent);

        // if any sources are pending in this picture due to async type test(s)
        // remove the evaluated attr and skip for now ( the pending test will
        // rerun picturefill on this element when complete)
        if (firstMatch === false) {
          continue;
        }
      } else {
        firstMatch = undefined;
      }

      // Cache and remove `srcset` if present and we’re going to be doing `picture`/`srcset`/`sizes` polyfilling to it.
      if ((parent && parent.nodeName.toUpperCase() === 'PICTURE') ||
      (!pf.sizesSupported && (element.srcset && regWDesc.test(element.srcset)))) {
        pf.dodgeSrcset(element);
      }

      if (firstMatch) {
        candidates = pf.processSourceSet(firstMatch);
        pf.applyBestCandidate(candidates, element);
      } else {
        // No sources matched, so we’re down to processing the inner `img` as a source.
        candidates = pf.processSourceSet(element);

        if (element.srcset === undefined || element[pf.ns].srcset) {
          // Either `srcset` is completely unsupported, or we need to polyfill `sizes` functionality.
          pf.applyBestCandidate(candidates, element);
        } // Else, resolution-only `srcset` is supported natively.
      }

      // set evaluated to true to avoid unnecessary reparsing
      element[pf.ns].evaluated = true;
    }
  }

  /**
   * Sets up picture polyfill by polling the document and running
   * the polyfill every 250ms until the document is ready.
   * Also attaches picturefill on resize
   */
  function runPicturefill() {
    pf.initTypeDetects();
    picturefill();
    var intervalId = setInterval(function () {
      // When the document has finished loading, stop checking for new images
      // https://github.com/ded/domready/blob/master/ready.js#L15
      picturefill();

      if (/^loaded|^i|^c/.test(doc.readyState)) {
        clearInterval(intervalId);
        return;
      }
    }, 250);

    var resizeTimer;
    var handleResize = function () {
      picturefill({reevaluate: true});
    };
    function checkResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 60);
    }

    if (w.addEventListener) {
      w.addEventListener('resize', checkResize, false);
    } else if (w.attachEvent) {
      w.attachEvent('onresize', checkResize);
    }
  }

  runPicturefill();

  /* expose methods for testing */
  picturefill._ = pf;

  expose(picturefill);

})(window, window.document, new window.Image());

/**
 * Swiper 6.4.15
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2021 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: February 18, 2021
 */

! function(e, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Swiper = t() }(this, (function() { "use strict";

  function e(e, t) { for (var a = 0; a < t.length; a++) { var i = t[a];
      i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i) } }

  function t() { return (t = Object.assign || function(e) { for (var t = 1; t < arguments.length; t++) { var a = arguments[t]; for (var i in a) Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i]) } return e }).apply(this, arguments) }

  function a(e) { return null !== e && "object" == typeof e && "constructor" in e && e.constructor === Object }

  function i(e, t) { void 0 === e && (e = {}), void 0 === t && (t = {}), Object.keys(t).forEach((function(s) { void 0 === e[s] ? e[s] = t[s] : a(t[s]) && a(e[s]) && Object.keys(t[s]).length > 0 && i(e[s], t[s]) })) } var s = { body: {}, addEventListener: function() {}, removeEventListener: function() {}, activeElement: { blur: function() {}, nodeName: "" }, querySelector: function() { return null }, querySelectorAll: function() { return [] }, getElementById: function() { return null }, createEvent: function() { return { initEvent: function() {} } }, createElement: function() { return { children: [], childNodes: [], style: {}, setAttribute: function() {}, getElementsByTagName: function() { return [] } } }, createElementNS: function() { return {} }, importNode: function() { return null }, location: { hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: "" } };

  function r() { var e = "undefined" != typeof document ? document : {}; return i(e, s), e } var n = { document: s, navigator: { userAgent: "" }, location: { hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: "" }, history: { replaceState: function() {}, pushState: function() {}, go: function() {}, back: function() {} }, CustomEvent: function() { return this }, addEventListener: function() {}, removeEventListener: function() {}, getComputedStyle: function() { return { getPropertyValue: function() { return "" } } }, Image: function() {}, Date: function() {}, screen: {}, setTimeout: function() {}, clearTimeout: function() {}, matchMedia: function() { return {} }, requestAnimationFrame: function(e) { return "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0) }, cancelAnimationFrame: function(e) { "undefined" != typeof setTimeout && clearTimeout(e) } };

  function l() { var e = "undefined" != typeof window ? window : {}; return i(e, n), e }

  function o(e) { return (o = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) { return e.__proto__ || Object.getPrototypeOf(e) })(e) }

  function d(e, t) { return (d = Object.setPrototypeOf || function(e, t) { return e.__proto__ = t, e })(e, t) }

  function p() { if ("undefined" == typeof Reflect || !Reflect.construct) return !1; if (Reflect.construct.sham) return !1; if ("function" == typeof Proxy) return !0; try { return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))), !0 } catch (e) { return !1 } }

  function u(e, t, a) { return (u = p() ? Reflect.construct : function(e, t, a) { var i = [null];
      i.push.apply(i, t); var s = new(Function.bind.apply(e, i)); return a && d(s, a.prototype), s }).apply(null, arguments) }

  function c(e) { var t = "function" == typeof Map ? new Map : void 0; return (c = function(e) { if (null === e || (a = e, -1 === Function.toString.call(a).indexOf("[native code]"))) return e; var a; if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== t) { if (t.has(e)) return t.get(e);
        t.set(e, i) }

      function i() { return u(e, arguments, o(this).constructor) } return i.prototype = Object.create(e.prototype, { constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 } }), d(i, e) })(e) } var h = function(e) { var t, a;

    function i(t) { var a, i, s; return a = e.call.apply(e, [this].concat(t)) || this, i = function(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e }(a), s = i.__proto__, Object.defineProperty(i, "__proto__", { get: function() { return s }, set: function(e) { s.__proto__ = e } }), a } return a = e, (t = i).prototype = Object.create(a.prototype), t.prototype.constructor = t, t.__proto__ = a, i }(c(Array));

  function v(e) { void 0 === e && (e = []); var t = []; return e.forEach((function(e) { Array.isArray(e) ? t.push.apply(t, v(e)) : t.push(e) })), t }

  function f(e, t) { return Array.prototype.filter.call(e, t) }

  function m(e, t) { var a = l(),
      i = r(),
      s = []; if (!t && e instanceof h) return e; if (!e) return new h(s); if ("string" == typeof e) { var n = e.trim(); if (n.indexOf("<") >= 0 && n.indexOf(">") >= 0) { var o = "div";
        0 === n.indexOf("<li") && (o = "ul"), 0 === n.indexOf("<tr") && (o = "tbody"), 0 !== n.indexOf("<td") && 0 !== n.indexOf("<th") || (o = "tr"), 0 === n.indexOf("<tbody") && (o = "table"), 0 === n.indexOf("<option") && (o = "select"); var d = i.createElement(o);
        d.innerHTML = n; for (var p = 0; p < d.childNodes.length; p += 1) s.push(d.childNodes[p]) } else s = function(e, t) { if ("string" != typeof e) return [e]; for (var a = [], i = t.querySelectorAll(e), s = 0; s < i.length; s += 1) a.push(i[s]); return a }(e.trim(), t || i) } else if (e.nodeType || e === a || e === i) s.push(e);
    else if (Array.isArray(e)) { if (e instanceof h) return e;
      s = e } return new h(function(e) { for (var t = [], a = 0; a < e.length; a += 1) - 1 === t.indexOf(e[a]) && t.push(e[a]); return t }(s)) }
  m.fn = h.prototype; var g, w, y, b = { addClass: function() { for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++) t[a] = arguments[a]; var i = v(t.map((function(e) { return e.split(" ") }))); return this.forEach((function(e) { var t;
        (t = e.classList).add.apply(t, i) })), this }, removeClass: function() { for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++) t[a] = arguments[a]; var i = v(t.map((function(e) { return e.split(" ") }))); return this.forEach((function(e) { var t;
        (t = e.classList).remove.apply(t, i) })), this }, hasClass: function() { for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++) t[a] = arguments[a]; var i = v(t.map((function(e) { return e.split(" ") }))); return f(this, (function(e) { return i.filter((function(t) { return e.classList.contains(t) })).length > 0 })).length > 0 }, toggleClass: function() { for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++) t[a] = arguments[a]; var i = v(t.map((function(e) { return e.split(" ") })));
      this.forEach((function(e) { i.forEach((function(t) { e.classList.toggle(t) })) })) }, attr: function(e, t) { if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0; for (var a = 0; a < this.length; a += 1)
        if (2 === arguments.length) this[a].setAttribute(e, t);
        else
          for (var i in e) this[a][i] = e[i], this[a].setAttribute(i, e[i]);
      return this }, removeAttr: function(e) { for (var t = 0; t < this.length; t += 1) this[t].removeAttribute(e); return this }, transform: function(e) { for (var t = 0; t < this.length; t += 1) this[t].style.transform = e; return this }, transition: function(e) { for (var t = 0; t < this.length; t += 1) this[t].style.transitionDuration = "string" != typeof e ? e + "ms" : e; return this }, on: function() { for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++) t[a] = arguments[a]; var i = t[0],
        s = t[1],
        r = t[2],
        n = t[3];

      function l(e) { var t = e.target; if (t) { var a = e.target.dom7EventData || []; if (a.indexOf(e) < 0 && a.unshift(e), m(t).is(s)) r.apply(t, a);
          else
            for (var i = m(t).parents(), n = 0; n < i.length; n += 1) m(i[n]).is(s) && r.apply(i[n], a) } }

      function o(e) { var t = e && e.target && e.target.dom7EventData || [];
        t.indexOf(e) < 0 && t.unshift(e), r.apply(this, t) } "function" == typeof t[1] && (i = t[0], r = t[1], n = t[2], s = void 0), n || (n = !1); for (var d, p = i.split(" "), u = 0; u < this.length; u += 1) { var c = this[u]; if (s)
          for (d = 0; d < p.length; d += 1) { var h = p[d];
            c.dom7LiveListeners || (c.dom7LiveListeners = {}), c.dom7LiveListeners[h] || (c.dom7LiveListeners[h] = []), c.dom7LiveListeners[h].push({ listener: r, proxyListener: l }), c.addEventListener(h, l, n) } else
            for (d = 0; d < p.length; d += 1) { var v = p[d];
              c.dom7Listeners || (c.dom7Listeners = {}), c.dom7Listeners[v] || (c.dom7Listeners[v] = []), c.dom7Listeners[v].push({ listener: r, proxyListener: o }), c.addEventListener(v, o, n) } } return this }, off: function() { for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++) t[a] = arguments[a]; var i = t[0],
        s = t[1],
        r = t[2],
        n = t[3]; "function" == typeof t[1] && (i = t[0], r = t[1], n = t[2], s = void 0), n || (n = !1); for (var l = i.split(" "), o = 0; o < l.length; o += 1)
        for (var d = l[o], p = 0; p < this.length; p += 1) { var u = this[p],
            c = void 0; if (!s && u.dom7Listeners ? c = u.dom7Listeners[d] : s && u.dom7LiveListeners && (c = u.dom7LiveListeners[d]), c && c.length)
            for (var h = c.length - 1; h >= 0; h -= 1) { var v = c[h];
              r && v.listener === r || r && v.listener && v.listener.dom7proxy && v.listener.dom7proxy === r ? (u.removeEventListener(d, v.proxyListener, n), c.splice(h, 1)) : r || (u.removeEventListener(d, v.proxyListener, n), c.splice(h, 1)) } }
      return this }, trigger: function() { for (var e = l(), t = arguments.length, a = new Array(t), i = 0; i < t; i++) a[i] = arguments[i]; for (var s = a[0].split(" "), r = a[1], n = 0; n < s.length; n += 1)
        for (var o = s[n], d = 0; d < this.length; d += 1) { var p = this[d]; if (e.CustomEvent) { var u = new e.CustomEvent(o, { detail: r, bubbles: !0, cancelable: !0 });
            p.dom7EventData = a.filter((function(e, t) { return t > 0 })), p.dispatchEvent(u), p.dom7EventData = [], delete p.dom7EventData } }
      return this }, transitionEnd: function(e) { var t = this; return e && t.on("transitionend", (function a(i) { i.target === this && (e.call(this, i), t.off("transitionend", a)) })), this }, outerWidth: function(e) { if (this.length > 0) { if (e) { var t = this.styles(); return this[0].offsetWidth + parseFloat(t.getPropertyValue("margin-right")) + parseFloat(t.getPropertyValue("margin-left")) } return this[0].offsetWidth } return null }, outerHeight: function(e) { if (this.length > 0) { if (e) { var t = this.styles(); return this[0].offsetHeight + parseFloat(t.getPropertyValue("margin-top")) + parseFloat(t.getPropertyValue("margin-bottom")) } return this[0].offsetHeight } return null }, styles: function() { var e = l(); return this[0] ? e.getComputedStyle(this[0], null) : {} }, offset: function() { if (this.length > 0) { var e = l(),
          t = r(),
          a = this[0],
          i = a.getBoundingClientRect(),
          s = t.body,
          n = a.clientTop || s.clientTop || 0,
          o = a.clientLeft || s.clientLeft || 0,
          d = a === e ? e.scrollY : a.scrollTop,
          p = a === e ? e.scrollX : a.scrollLeft; return { top: i.top + d - n, left: i.left + p - o } } return null }, css: function(e, t) { var a, i = l(); if (1 === arguments.length) { if ("string" != typeof e) { for (a = 0; a < this.length; a += 1)
            for (var s in e) this[a].style[s] = e[s]; return this } if (this[0]) return i.getComputedStyle(this[0], null).getPropertyValue(e) } if (2 === arguments.length && "string" == typeof e) { for (a = 0; a < this.length; a += 1) this[a].style[e] = t; return this } return this }, each: function(e) { return e ? (this.forEach((function(t, a) { e.apply(t, [t, a]) })), this) : this }, html: function(e) { if (void 0 === e) return this[0] ? this[0].innerHTML : null; for (var t = 0; t < this.length; t += 1) this[t].innerHTML = e; return this }, text: function(e) { if (void 0 === e) return this[0] ? this[0].textContent.trim() : null; for (var t = 0; t < this.length; t += 1) this[t].textContent = e; return this }, is: function(e) { var t, a, i = l(),
        s = r(),
        n = this[0]; if (!n || void 0 === e) return !1; if ("string" == typeof e) { if (n.matches) return n.matches(e); if (n.webkitMatchesSelector) return n.webkitMatchesSelector(e); if (n.msMatchesSelector) return n.msMatchesSelector(e); for (t = m(e), a = 0; a < t.length; a += 1)
          if (t[a] === n) return !0;
        return !1 } if (e === s) return n === s; if (e === i) return n === i; if (e.nodeType || e instanceof h) { for (t = e.nodeType ? [e] : e, a = 0; a < t.length; a += 1)
          if (t[a] === n) return !0;
        return !1 } return !1 }, index: function() { var e, t = this[0]; if (t) { for (e = 0; null !== (t = t.previousSibling);) 1 === t.nodeType && (e += 1); return e } }, eq: function(e) { if (void 0 === e) return this; var t = this.length; if (e > t - 1) return m([]); if (e < 0) { var a = t + e; return m(a < 0 ? [] : [this[a]]) } return m([this[e]]) }, append: function() { for (var e, t = r(), a = 0; a < arguments.length; a += 1) { e = a < 0 || arguments.length <= a ? void 0 : arguments[a]; for (var i = 0; i < this.length; i += 1)
          if ("string" == typeof e) { var s = t.createElement("div"); for (s.innerHTML = e; s.firstChild;) this[i].appendChild(s.firstChild) } else if (e instanceof h)
          for (var n = 0; n < e.length; n += 1) this[i].appendChild(e[n]);
        else this[i].appendChild(e) } return this }, prepend: function(e) { var t, a, i = r(); for (t = 0; t < this.length; t += 1)
        if ("string" == typeof e) { var s = i.createElement("div"); for (s.innerHTML = e, a = s.childNodes.length - 1; a >= 0; a -= 1) this[t].insertBefore(s.childNodes[a], this[t].childNodes[0]) } else if (e instanceof h)
        for (a = 0; a < e.length; a += 1) this[t].insertBefore(e[a], this[t].childNodes[0]);
      else this[t].insertBefore(e, this[t].childNodes[0]); return this }, next: function(e) { return this.length > 0 ? e ? this[0].nextElementSibling && m(this[0].nextElementSibling).is(e) ? m([this[0].nextElementSibling]) : m([]) : this[0].nextElementSibling ? m([this[0].nextElementSibling]) : m([]) : m([]) }, nextAll: function(e) { var t = [],
        a = this[0]; if (!a) return m([]); for (; a.nextElementSibling;) { var i = a.nextElementSibling;
        e ? m(i).is(e) && t.push(i) : t.push(i), a = i } return m(t) }, prev: function(e) { if (this.length > 0) { var t = this[0]; return e ? t.previousElementSibling && m(t.previousElementSibling).is(e) ? m([t.previousElementSibling]) : m([]) : t.previousElementSibling ? m([t.previousElementSibling]) : m([]) } return m([]) }, prevAll: function(e) { var t = [],
        a = this[0]; if (!a) return m([]); for (; a.previousElementSibling;) { var i = a.previousElementSibling;
        e ? m(i).is(e) && t.push(i) : t.push(i), a = i } return m(t) }, parent: function(e) { for (var t = [], a = 0; a < this.length; a += 1) null !== this[a].parentNode && (e ? m(this[a].parentNode).is(e) && t.push(this[a].parentNode) : t.push(this[a].parentNode)); return m(t) }, parents: function(e) { for (var t = [], a = 0; a < this.length; a += 1)
        for (var i = this[a].parentNode; i;) e ? m(i).is(e) && t.push(i) : t.push(i), i = i.parentNode; return m(t) }, closest: function(e) { var t = this; return void 0 === e ? m([]) : (t.is(e) || (t = t.parents(e).eq(0)), t) }, find: function(e) { for (var t = [], a = 0; a < this.length; a += 1)
        for (var i = this[a].querySelectorAll(e), s = 0; s < i.length; s += 1) t.push(i[s]); return m(t) }, children: function(e) { for (var t = [], a = 0; a < this.length; a += 1)
        for (var i = this[a].children, s = 0; s < i.length; s += 1) e && !m(i[s]).is(e) || t.push(i[s]); return m(t) }, filter: function(e) { return m(f(this, e)) }, remove: function() { for (var e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]); return this } };

  function E(e, t) { return void 0 === t && (t = 0), setTimeout(e, t) }

  function x() { return Date.now() }

  function T(e, t) { void 0 === t && (t = "x"); var a, i, s, r = l(),
      n = r.getComputedStyle(e, null); return r.WebKitCSSMatrix ? ((i = n.transform || n.webkitTransform).split(",").length > 6 && (i = i.split(", ").map((function(e) { return e.replace(",", ".") })).join(", ")), s = new r.WebKitCSSMatrix("none" === i ? "" : i)) : a = (s = n.MozTransform || n.OTransform || n.MsTransform || n.msTransform || n.transform || n.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")).toString().split(","), "x" === t && (i = r.WebKitCSSMatrix ? s.m41 : 16 === a.length ? parseFloat(a[12]) : parseFloat(a[4])), "y" === t && (i = r.WebKitCSSMatrix ? s.m42 : 16 === a.length ? parseFloat(a[13]) : parseFloat(a[5])), i || 0 }

  function C(e) { return "object" == typeof e && null !== e && e.constructor && e.constructor === Object }

  function S() { for (var e = Object(arguments.length <= 0 ? void 0 : arguments[0]), t = 1; t < arguments.length; t += 1) { var a = t < 0 || arguments.length <= t ? void 0 : arguments[t]; if (null != a)
        for (var i = Object.keys(Object(a)), s = 0, r = i.length; s < r; s += 1) { var n = i[s],
            l = Object.getOwnPropertyDescriptor(a, n);
          void 0 !== l && l.enumerable && (C(e[n]) && C(a[n]) ? S(e[n], a[n]) : !C(e[n]) && C(a[n]) ? (e[n] = {}, S(e[n], a[n])) : e[n] = a[n]) } } return e }

  function M(e, t) { Object.keys(t).forEach((function(a) { C(t[a]) && Object.keys(t[a]).forEach((function(i) { "function" == typeof t[a][i] && (t[a][i] = t[a][i].bind(e)) })), e[a] = t[a] })) }

  function z() { return g || (g = function() { var e = l(),
        t = r(); return { touch: !!("ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch), pointerEvents: !!e.PointerEvent && "maxTouchPoints" in e.navigator && e.navigator.maxTouchPoints >= 0, observer: "MutationObserver" in e || "WebkitMutationObserver" in e, passiveListener: function() { var t = !1; try { var a = Object.defineProperty({}, "passive", { get: function() { t = !0 } });
            e.addEventListener("testPassiveListener", null, a) } catch (e) {} return t }(), gestures: "ongesturestart" in e } }()), g }

  function P(e) { return void 0 === e && (e = {}), w || (w = function(e) { var t = (void 0 === e ? {} : e).userAgent,
        a = z(),
        i = l(),
        s = i.navigator.platform,
        r = t || i.navigator.userAgent,
        n = { ios: !1, android: !1 },
        o = i.screen.width,
        d = i.screen.height,
        p = r.match(/(Android);?[\s\/]+([\d.]+)?/),
        u = r.match(/(iPad).*OS\s([\d_]+)/),
        c = r.match(/(iPod)(.*OS\s([\d_]+))?/),
        h = !u && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
        v = "Win32" === s,
        f = "MacIntel" === s; return !u && f && a.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(o + "x" + d) >= 0 && ((u = r.match(/(Version)\/([\d.]+)/)) || (u = [0, 1, "13_0_0"]), f = !1), p && !v && (n.os = "android", n.android = !0), (u || h || c) && (n.os = "ios", n.ios = !0), n }(e)), w }

  function k() { return y || (y = function() { var e, t = l(); return { isEdge: !!t.navigator.userAgent.match(/Edge/g), isSafari: (e = t.navigator.userAgent.toLowerCase(), e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0), isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent) } }()), y }
  Object.keys(b).forEach((function(e) { m.fn[e] = b[e] })); var L = { name: "resize", create: function() { var e = this;
        S(e, { resize: { resizeHandler: function() { e && !e.destroyed && e.initialized && (e.emit("beforeResize"), e.emit("resize")) }, orientationChangeHandler: function() { e && !e.destroyed && e.initialized && e.emit("orientationchange") } } }) }, on: { init: function(e) { var t = l();
          t.addEventListener("resize", e.resize.resizeHandler), t.addEventListener("orientationchange", e.resize.orientationChangeHandler) }, destroy: function(e) { var t = l();
          t.removeEventListener("resize", e.resize.resizeHandler), t.removeEventListener("orientationchange", e.resize.orientationChangeHandler) } } },
    $ = { attach: function(e, t) { void 0 === t && (t = {}); var a = l(),
          i = this,
          s = new(a.MutationObserver || a.WebkitMutationObserver)((function(e) { if (1 !== e.length) { var t = function() { i.emit("observerUpdate", e[0]) };
              a.requestAnimationFrame ? a.requestAnimationFrame(t) : a.setTimeout(t, 0) } else i.emit("observerUpdate", e[0]) }));
        s.observe(e, { attributes: void 0 === t.attributes || t.attributes, childList: void 0 === t.childList || t.childList, characterData: void 0 === t.characterData || t.characterData }), i.observer.observers.push(s) }, init: function() { var e = this; if (e.support.observer && e.params.observer) { if (e.params.observeParents)
            for (var t = e.$el.parents(), a = 0; a < t.length; a += 1) e.observer.attach(t[a]);
          e.observer.attach(e.$el[0], { childList: e.params.observeSlideChildren }), e.observer.attach(e.$wrapperEl[0], { attributes: !1 }) } }, destroy: function() { this.observer.observers.forEach((function(e) { e.disconnect() })), this.observer.observers = [] } },
    I = { name: "observer", params: { observer: !1, observeParents: !1, observeSlideChildren: !1 }, create: function() { M(this, { observer: t({}, $, { observers: [] }) }) }, on: { init: function(e) { e.observer.init() }, destroy: function(e) { e.observer.destroy() } } };

  function O(e) { var t = this,
      a = r(),
      i = l(),
      s = t.touchEventsData,
      n = t.params,
      o = t.touches; if (!t.animating || !n.preventInteractionOnTransition) { var d = e;
      d.originalEvent && (d = d.originalEvent); var p = m(d.target); if ("wrapper" !== n.touchEventsTarget || p.closest(t.wrapperEl).length)
        if (s.isTouchEvent = "touchstart" === d.type, s.isTouchEvent || !("which" in d) || 3 !== d.which)
          if (!(!s.isTouchEvent && "button" in d && d.button > 0))
            if (!s.isTouched || !s.isMoved)
              if (!!n.noSwipingClass && "" !== n.noSwipingClass && d.target && d.target.shadowRoot && e.path && e.path[0] && (p = m(e.path[0])), n.noSwiping && p.closest(n.noSwipingSelector ? n.noSwipingSelector : "." + n.noSwipingClass)[0]) t.allowClick = !0;
              else if (!n.swipeHandler || p.closest(n.swipeHandler)[0]) { o.currentX = "touchstart" === d.type ? d.targetTouches[0].pageX : d.pageX, o.currentY = "touchstart" === d.type ? d.targetTouches[0].pageY : d.pageY; var u = o.currentX,
          c = o.currentY,
          h = n.edgeSwipeDetection || n.iOSEdgeSwipeDetection,
          v = n.edgeSwipeThreshold || n.iOSEdgeSwipeThreshold; if (h && (u <= v || u >= i.innerWidth - v)) { if ("prevent" !== h) return;
          e.preventDefault() } if (S(s, { isTouched: !0, isMoved: !1, allowTouchCallbacks: !0, isScrolling: void 0, startMoving: void 0 }), o.startX = u, o.startY = c, s.touchStartTime = x(), t.allowClick = !0, t.updateSize(), t.swipeDirection = void 0, n.threshold > 0 && (s.allowThresholdMove = !1), "touchstart" !== d.type) { var f = !0;
          p.is(s.formElements) && (f = !1), a.activeElement && m(a.activeElement).is(s.formElements) && a.activeElement !== p[0] && a.activeElement.blur(); var g = f && t.allowTouchMove && n.touchStartPreventDefault;!n.touchStartForcePreventDefault && !g || p[0].isContentEditable || d.preventDefault() }
        t.emit("touchStart", d) } } }

  function A(e) { var t = r(),
      a = this,
      i = a.touchEventsData,
      s = a.params,
      n = a.touches,
      l = a.rtlTranslate,
      o = e; if (o.originalEvent && (o = o.originalEvent), i.isTouched) { if (!i.isTouchEvent || "touchmove" === o.type) { var d = "touchmove" === o.type && o.targetTouches && (o.targetTouches[0] || o.changedTouches[0]),
          p = "touchmove" === o.type ? d.pageX : o.pageX,
          u = "touchmove" === o.type ? d.pageY : o.pageY; if (o.preventedByNestedSwiper) return n.startX = p, void(n.startY = u); if (!a.allowTouchMove) return a.allowClick = !1, void(i.isTouched && (S(n, { startX: p, startY: u, currentX: p, currentY: u }), i.touchStartTime = x())); if (i.isTouchEvent && s.touchReleaseOnEdges && !s.loop)
          if (a.isVertical()) { if (u < n.startY && a.translate <= a.maxTranslate() || u > n.startY && a.translate >= a.minTranslate()) return i.isTouched = !1, void(i.isMoved = !1) } else if (p < n.startX && a.translate <= a.maxTranslate() || p > n.startX && a.translate >= a.minTranslate()) return; if (i.isTouchEvent && t.activeElement && o.target === t.activeElement && m(o.target).is(i.formElements)) return i.isMoved = !0, void(a.allowClick = !1); if (i.allowTouchCallbacks && a.emit("touchMove", o), !(o.targetTouches && o.targetTouches.length > 1)) { n.currentX = p, n.currentY = u; var c = n.currentX - n.startX,
            h = n.currentY - n.startY; if (!(a.params.threshold && Math.sqrt(Math.pow(c, 2) + Math.pow(h, 2)) < a.params.threshold)) { var v; if (void 0 === i.isScrolling) a.isHorizontal() && n.currentY === n.startY || a.isVertical() && n.currentX === n.startX ? i.isScrolling = !1 : c * c + h * h >= 25 && (v = 180 * Math.atan2(Math.abs(h), Math.abs(c)) / Math.PI, i.isScrolling = a.isHorizontal() ? v > s.touchAngle : 90 - v > s.touchAngle); if (i.isScrolling && a.emit("touchMoveOpposite", o), void 0 === i.startMoving && (n.currentX === n.startX && n.currentY === n.startY || (i.startMoving = !0)), i.isScrolling) i.isTouched = !1;
            else if (i.startMoving) { a.allowClick = !1, !s.cssMode && o.cancelable && o.preventDefault(), s.touchMoveStopPropagation && !s.nested && o.stopPropagation(), i.isMoved || (s.loop && a.loopFix(), i.startTranslate = a.getTranslate(), a.setTransition(0), a.animating && a.$wrapperEl.trigger("webkitTransitionEnd transitionend"), i.allowMomentumBounce = !1, !s.grabCursor || !0 !== a.allowSlideNext && !0 !== a.allowSlidePrev || a.setGrabCursor(!0), a.emit("sliderFirstMove", o)), a.emit("sliderMove", o), i.isMoved = !0; var f = a.isHorizontal() ? c : h;
              n.diff = f, f *= s.touchRatio, l && (f = -f), a.swipeDirection = f > 0 ? "prev" : "next", i.currentTranslate = f + i.startTranslate; var g = !0,
                w = s.resistanceRatio; if (s.touchReleaseOnEdges && (w = 0), f > 0 && i.currentTranslate > a.minTranslate() ? (g = !1, s.resistance && (i.currentTranslate = a.minTranslate() - 1 + Math.pow(-a.minTranslate() + i.startTranslate + f, w))) : f < 0 && i.currentTranslate < a.maxTranslate() && (g = !1, s.resistance && (i.currentTranslate = a.maxTranslate() + 1 - Math.pow(a.maxTranslate() - i.startTranslate - f, w))), g && (o.preventedByNestedSwiper = !0), !a.allowSlideNext && "next" === a.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate), !a.allowSlidePrev && "prev" === a.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate), s.threshold > 0) { if (!(Math.abs(f) > s.threshold || i.allowThresholdMove)) return void(i.currentTranslate = i.startTranslate); if (!i.allowThresholdMove) return i.allowThresholdMove = !0, n.startX = n.currentX, n.startY = n.currentY, i.currentTranslate = i.startTranslate, void(n.diff = a.isHorizontal() ? n.currentX - n.startX : n.currentY - n.startY) }
              s.followFinger && !s.cssMode && ((s.freeMode || s.watchSlidesProgress || s.watchSlidesVisibility) && (a.updateActiveIndex(), a.updateSlidesClasses()), s.freeMode && (0 === i.velocities.length && i.velocities.push({ position: n[a.isHorizontal() ? "startX" : "startY"], time: i.touchStartTime }), i.velocities.push({ position: n[a.isHorizontal() ? "currentX" : "currentY"], time: x() })), a.updateProgress(i.currentTranslate), a.setTranslate(i.currentTranslate)) } } } } } else i.startMoving && i.isScrolling && a.emit("touchMoveOpposite", o) }

  function D(e) { var t = this,
      a = t.touchEventsData,
      i = t.params,
      s = t.touches,
      r = t.rtlTranslate,
      n = t.$wrapperEl,
      l = t.slidesGrid,
      o = t.snapGrid,
      d = e; if (d.originalEvent && (d = d.originalEvent), a.allowTouchCallbacks && t.emit("touchEnd", d), a.allowTouchCallbacks = !1, !a.isTouched) return a.isMoved && i.grabCursor && t.setGrabCursor(!1), a.isMoved = !1, void(a.startMoving = !1);
    i.grabCursor && a.isMoved && a.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1); var p, u = x(),
      c = u - a.touchStartTime; if (t.allowClick && (t.updateClickedSlide(d), t.emit("tap click", d), c < 300 && u - a.lastClickTime < 300 && t.emit("doubleTap doubleClick", d)), a.lastClickTime = x(), E((function() { t.destroyed || (t.allowClick = !0) })), !a.isTouched || !a.isMoved || !t.swipeDirection || 0 === s.diff || a.currentTranslate === a.startTranslate) return a.isTouched = !1, a.isMoved = !1, void(a.startMoving = !1); if (a.isTouched = !1, a.isMoved = !1, a.startMoving = !1, p = i.followFinger ? r ? t.translate : -t.translate : -a.currentTranslate, !i.cssMode)
      if (i.freeMode) { if (p < -t.minTranslate()) return void t.slideTo(t.activeIndex); if (p > -t.maxTranslate()) return void(t.slides.length < o.length ? t.slideTo(o.length - 1) : t.slideTo(t.slides.length - 1)); if (i.freeModeMomentum) { if (a.velocities.length > 1) { var h = a.velocities.pop(),
              v = a.velocities.pop(),
              f = h.position - v.position,
              m = h.time - v.time;
            t.velocity = f / m, t.velocity /= 2, Math.abs(t.velocity) < i.freeModeMinimumVelocity && (t.velocity = 0), (m > 150 || x() - h.time > 300) && (t.velocity = 0) } else t.velocity = 0;
          t.velocity *= i.freeModeMomentumVelocityRatio, a.velocities.length = 0; var g = 1e3 * i.freeModeMomentumRatio,
            w = t.velocity * g,
            y = t.translate + w;
          r && (y = -y); var b, T, C = !1,
            S = 20 * Math.abs(t.velocity) * i.freeModeMomentumBounceRatio; if (y < t.maxTranslate()) i.freeModeMomentumBounce ? (y + t.maxTranslate() < -S && (y = t.maxTranslate() - S), b = t.maxTranslate(), C = !0, a.allowMomentumBounce = !0) : y = t.maxTranslate(), i.loop && i.centeredSlides && (T = !0);
          else if (y > t.minTranslate()) i.freeModeMomentumBounce ? (y - t.minTranslate() > S && (y = t.minTranslate() + S), b = t.minTranslate(), C = !0, a.allowMomentumBounce = !0) : y = t.minTranslate(), i.loop && i.centeredSlides && (T = !0);
          else if (i.freeModeSticky) { for (var M, z = 0; z < o.length; z += 1)
              if (o[z] > -y) { M = z; break }
            y = -(y = Math.abs(o[M] - y) < Math.abs(o[M - 1] - y) || "next" === t.swipeDirection ? o[M] : o[M - 1]) } if (T && t.once("transitionEnd", (function() { t.loopFix() })), 0 !== t.velocity) { if (g = r ? Math.abs((-y - t.translate) / t.velocity) : Math.abs((y - t.translate) / t.velocity), i.freeModeSticky) { var P = Math.abs((r ? -y : y) - t.translate),
                k = t.slidesSizesGrid[t.activeIndex];
              g = P < k ? i.speed : P < 2 * k ? 1.5 * i.speed : 2.5 * i.speed } } else if (i.freeModeSticky) return void t.slideToClosest();
          i.freeModeMomentumBounce && C ? (t.updateProgress(b), t.setTransition(g), t.setTranslate(y), t.transitionStart(!0, t.swipeDirection), t.animating = !0, n.transitionEnd((function() { t && !t.destroyed && a.allowMomentumBounce && (t.emit("momentumBounce"), t.setTransition(i.speed), setTimeout((function() { t.setTranslate(b), n.transitionEnd((function() { t && !t.destroyed && t.transitionEnd() })) }), 0)) }))) : t.velocity ? (t.updateProgress(y), t.setTransition(g), t.setTranslate(y), t.transitionStart(!0, t.swipeDirection), t.animating || (t.animating = !0, n.transitionEnd((function() { t && !t.destroyed && t.transitionEnd() })))) : t.updateProgress(y), t.updateActiveIndex(), t.updateSlidesClasses() } else if (i.freeModeSticky) return void t.slideToClosest();
        (!i.freeModeMomentum || c >= i.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses()) } else { for (var L = 0, $ = t.slidesSizesGrid[0], I = 0; I < l.length; I += I < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup) { var O = I < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
          void 0 !== l[I + O] ? p >= l[I] && p < l[I + O] && (L = I, $ = l[I + O] - l[I]) : p >= l[I] && (L = I, $ = l[l.length - 1] - l[l.length - 2]) } var A = (p - l[L]) / $,
          D = L < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup; if (c > i.longSwipesMs) { if (!i.longSwipes) return void t.slideTo(t.activeIndex); "next" === t.swipeDirection && (A >= i.longSwipesRatio ? t.slideTo(L + D) : t.slideTo(L)), "prev" === t.swipeDirection && (A > 1 - i.longSwipesRatio ? t.slideTo(L + D) : t.slideTo(L)) } else { if (!i.shortSwipes) return void t.slideTo(t.activeIndex);
          t.navigation && (d.target === t.navigation.nextEl || d.target === t.navigation.prevEl) ? d.target === t.navigation.nextEl ? t.slideTo(L + D) : t.slideTo(L) : ("next" === t.swipeDirection && t.slideTo(L + D), "prev" === t.swipeDirection && t.slideTo(L)) } } }

  function G() { var e = this,
      t = e.params,
      a = e.el; if (!a || 0 !== a.offsetWidth) { t.breakpoints && e.setBreakpoint(); var i = e.allowSlideNext,
        s = e.allowSlidePrev,
        r = e.snapGrid;
      e.allowSlideNext = !0, e.allowSlidePrev = !0, e.updateSize(), e.updateSlides(), e.updateSlidesClasses(), ("auto" === t.slidesPerView || t.slidesPerView > 1) && e.isEnd && !e.isBeginning && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0), e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(), e.allowSlidePrev = s, e.allowSlideNext = i, e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow() } }

  function N(e) { var t = this;
    t.allowClick || (t.params.preventClicks && e.preventDefault(), t.params.preventClicksPropagation && t.animating && (e.stopPropagation(), e.stopImmediatePropagation())) }

  function B() { var e = this,
      t = e.wrapperEl,
      a = e.rtlTranslate;
    e.previousTranslate = e.translate, e.isHorizontal() ? e.translate = a ? t.scrollWidth - t.offsetWidth - t.scrollLeft : -t.scrollLeft : e.translate = -t.scrollTop, -0 === e.translate && (e.translate = 0), e.updateActiveIndex(), e.updateSlidesClasses(); var i = e.maxTranslate() - e.minTranslate();
    (0 === i ? 0 : (e.translate - e.minTranslate()) / i) !== e.progress && e.updateProgress(a ? -e.translate : e.translate), e.emit("setTranslate", e.translate, !1) } var H = !1;

  function X() {} var Y = { init: !0, direction: "horizontal", touchEventsTarget: "container", initialSlide: 0, speed: 300, cssMode: !1, updateOnWindowResize: !0, nested: !1, width: null, height: null, preventInteractionOnTransition: !1, userAgent: null, url: null, edgeSwipeDetection: !1, edgeSwipeThreshold: 20, freeMode: !1, freeModeMomentum: !0, freeModeMomentumRatio: 1, freeModeMomentumBounce: !0, freeModeMomentumBounceRatio: 1, freeModeMomentumVelocityRatio: 1, freeModeSticky: !1, freeModeMinimumVelocity: .02, autoHeight: !1, setWrapperSize: !1, virtualTranslate: !1, effect: "slide", breakpoints: void 0, spaceBetween: 0, slidesPerView: 1, slidesPerColumn: 1, slidesPerColumnFill: "column", slidesPerGroup: 1, slidesPerGroupSkip: 0, centeredSlides: !1, centeredSlidesBounds: !1, slidesOffsetBefore: 0, slidesOffsetAfter: 0, normalizeSlideIndex: !0, centerInsufficientSlides: !1, watchOverflow: !1, roundLengths: !1, touchRatio: 1, touchAngle: 45, simulateTouch: !0, shortSwipes: !0, longSwipes: !0, longSwipesRatio: .5, longSwipesMs: 300, followFinger: !0, allowTouchMove: !0, threshold: 0, touchMoveStopPropagation: !1, touchStartPreventDefault: !0, touchStartForcePreventDefault: !1, touchReleaseOnEdges: !1, uniqueNavElements: !0, resistance: !0, resistanceRatio: .85, watchSlidesProgress: !1, watchSlidesVisibility: !1, grabCursor: !1, preventClicks: !0, preventClicksPropagation: !0, slideToClickedSlide: !1, preloadImages: !0, updateOnImagesReady: !0, loop: !1, loopAdditionalSlides: 0, loopedSlides: null, loopFillGroupWithBlank: !1, loopPreventsSlide: !0, allowSlidePrev: !0, allowSlideNext: !0, swipeHandler: null, noSwiping: !0, noSwipingClass: "swiper-no-swiping", noSwipingSelector: null, passiveListeners: !0, containerModifierClass: "swiper-container-", slideClass: "swiper-slide", slideBlankClass: "swiper-slide-invisible-blank", slideActiveClass: "swiper-slide-active", slideDuplicateActiveClass: "swiper-slide-duplicate-active", slideVisibleClass: "swiper-slide-visible", slideDuplicateClass: "swiper-slide-duplicate", slideNextClass: "swiper-slide-next", slideDuplicateNextClass: "swiper-slide-duplicate-next", slidePrevClass: "swiper-slide-prev", slideDuplicatePrevClass: "swiper-slide-duplicate-prev", wrapperClass: "swiper-wrapper", runCallbacksOnInit: !0, _emitClasses: !1 },
    R = { modular: { useParams: function(e) { var t = this;
          t.modules && Object.keys(t.modules).forEach((function(a) { var i = t.modules[a];
            i.params && S(e, i.params) })) }, useModules: function(e) { void 0 === e && (e = {}); var t = this;
          t.modules && Object.keys(t.modules).forEach((function(a) { var i = t.modules[a],
              s = e[a] || {};
            i.on && t.on && Object.keys(i.on).forEach((function(e) { t.on(e, i.on[e]) })), i.create && i.create.bind(t)(s) })) } }, eventsEmitter: { on: function(e, t, a) { var i = this; if ("function" != typeof t) return i; var s = a ? "unshift" : "push"; return e.split(" ").forEach((function(e) { i.eventsListeners[e] || (i.eventsListeners[e] = []), i.eventsListeners[e][s](t) })), i }, once: function(e, t, a) { var i = this; if ("function" != typeof t) return i;

          function s() { i.off(e, s), s.__emitterProxy && delete s.__emitterProxy; for (var a = arguments.length, r = new Array(a), n = 0; n < a; n++) r[n] = arguments[n];
            t.apply(i, r) } return s.__emitterProxy = t, i.on(e, s, a) }, onAny: function(e, t) { var a = this; if ("function" != typeof e) return a; var i = t ? "unshift" : "push"; return a.eventsAnyListeners.indexOf(e) < 0 && a.eventsAnyListeners[i](e), a }, offAny: function(e) { var t = this; if (!t.eventsAnyListeners) return t; var a = t.eventsAnyListeners.indexOf(e); return a >= 0 && t.eventsAnyListeners.splice(a, 1), t }, off: function(e, t) { var a = this; return a.eventsListeners ? (e.split(" ").forEach((function(e) { void 0 === t ? a.eventsListeners[e] = [] : a.eventsListeners[e] && a.eventsListeners[e].forEach((function(i, s) {
              (i === t || i.__emitterProxy && i.__emitterProxy === t) && a.eventsListeners[e].splice(s, 1) })) })), a) : a }, emit: function() { var e, t, a, i = this; if (!i.eventsListeners) return i; for (var s = arguments.length, r = new Array(s), n = 0; n < s; n++) r[n] = arguments[n]; "string" == typeof r[0] || Array.isArray(r[0]) ? (e = r[0], t = r.slice(1, r.length), a = i) : (e = r[0].events, t = r[0].data, a = r[0].context || i), t.unshift(a); var l = Array.isArray(e) ? e : e.split(" "); return l.forEach((function(e) { i.eventsAnyListeners && i.eventsAnyListeners.length && i.eventsAnyListeners.forEach((function(i) { i.apply(a, [e].concat(t)) })), i.eventsListeners && i.eventsListeners[e] && i.eventsListeners[e].forEach((function(e) { e.apply(a, t) })) })), i } }, update: { updateSize: function() { var e, t, a = this,
            i = a.$el;
          e = void 0 !== a.params.width && null !== a.params.width ? a.params.width : i[0].clientWidth, t = void 0 !== a.params.height && null !== a.params.height ? a.params.height : i[0].clientHeight, 0 === e && a.isHorizontal() || 0 === t && a.isVertical() || (e = e - parseInt(i.css("padding-left") || 0, 10) - parseInt(i.css("padding-right") || 0, 10), t = t - parseInt(i.css("padding-top") || 0, 10) - parseInt(i.css("padding-bottom") || 0, 10), Number.isNaN(e) && (e = 0), Number.isNaN(t) && (t = 0), S(a, { width: e, height: t, size: a.isHorizontal() ? e : t })) }, updateSlides: function() { var e = this,
            t = function(t) { return e.isHorizontal() ? t : { width: "height", "margin-top": "margin-left", "margin-bottom ": "margin-right", "margin-left": "margin-top", "margin-right": "margin-bottom", "padding-left": "padding-top", "padding-right": "padding-bottom", marginRight: "marginBottom" }[t] },
            a = function(e, a) { return parseFloat(e.getPropertyValue(t(a)) || 0) },
            i = l(),
            s = e.params,
            r = e.$wrapperEl,
            n = e.size,
            o = e.rtlTranslate,
            d = e.wrongRTL,
            p = e.virtual && s.virtual.enabled,
            u = p ? e.virtual.slides.length : e.slides.length,
            c = r.children("." + e.params.slideClass),
            h = p ? e.virtual.slides.length : c.length,
            v = [],
            f = [],
            m = [],
            g = s.slidesOffsetBefore; "function" == typeof g && (g = s.slidesOffsetBefore.call(e)); var w = s.slidesOffsetAfter; "function" == typeof w && (w = s.slidesOffsetAfter.call(e)); var y = e.snapGrid.length,
            b = e.slidesGrid.length,
            E = s.spaceBetween,
            x = -g,
            T = 0,
            C = 0; if (void 0 !== n) { var M, z; "string" == typeof E && E.indexOf("%") >= 0 && (E = parseFloat(E.replace("%", "")) / 100 * n), e.virtualSize = -E, o ? c.css({ marginLeft: "", marginTop: "" }) : c.css({ marginRight: "", marginBottom: "" }), s.slidesPerColumn > 1 && (M = Math.floor(h / s.slidesPerColumn) === h / e.params.slidesPerColumn ? h : Math.ceil(h / s.slidesPerColumn) * s.slidesPerColumn, "auto" !== s.slidesPerView && "row" === s.slidesPerColumnFill && (M = Math.max(M, s.slidesPerView * s.slidesPerColumn))); for (var P, k, L, $ = s.slidesPerColumn, I = M / $, O = Math.floor(h / s.slidesPerColumn), A = 0; A < h; A += 1) { z = 0; var D = c.eq(A); if (s.slidesPerColumn > 1) { var G = void 0,
                  N = void 0,
                  B = void 0; if ("row" === s.slidesPerColumnFill && s.slidesPerGroup > 1) { var H = Math.floor(A / (s.slidesPerGroup * s.slidesPerColumn)),
                    X = A - s.slidesPerColumn * s.slidesPerGroup * H,
                    Y = 0 === H ? s.slidesPerGroup : Math.min(Math.ceil((h - H * $ * s.slidesPerGroup) / $), s.slidesPerGroup);
                  G = (N = X - (B = Math.floor(X / Y)) * Y + H * s.slidesPerGroup) + B * M / $, D.css({ "-webkit-box-ordinal-group": G, "-moz-box-ordinal-group": G, "-ms-flex-order": G, "-webkit-order": G, order: G }) } else "column" === s.slidesPerColumnFill ? (B = A - (N = Math.floor(A / $)) * $, (N > O || N === O && B === $ - 1) && (B += 1) >= $ && (B = 0, N += 1)) : N = A - (B = Math.floor(A / I)) * I;
                D.css(t("margin-top"), 0 !== B && s.spaceBetween && s.spaceBetween + "px") } if ("none" !== D.css("display")) { if ("auto" === s.slidesPerView) { var R = i.getComputedStyle(D[0], null),
                    V = D[0].style.transform,
                    W = D[0].style.webkitTransform; if (V && (D[0].style.transform = "none"), W && (D[0].style.webkitTransform = "none"), s.roundLengths) z = e.isHorizontal() ? D.outerWidth(!0) : D.outerHeight(!0);
                  else { var F = a(R, "width"),
                      q = a(R, "padding-left"),
                      j = a(R, "padding-right"),
                      _ = a(R, "margin-left"),
                      U = a(R, "margin-right"),
                      K = R.getPropertyValue(R, "box-sizing"); if (K && "border-box" === K) z = F + _ + U;
                    else { var Z = D[0],
                        J = Z.clientWidth;
                      z = F + q + j + _ + U + (Z.offsetWidth - J) } }
                  V && (D[0].style.transform = V), W && (D[0].style.webkitTransform = W), s.roundLengths && (z = Math.floor(z)) } else z = (n - (s.slidesPerView - 1) * E) / s.slidesPerView, s.roundLengths && (z = Math.floor(z)), c[A] && (c[A].style[t("width")] = z + "px");
                c[A] && (c[A].swiperSlideSize = z), m.push(z), s.centeredSlides ? (x = x + z / 2 + T / 2 + E, 0 === T && 0 !== A && (x = x - n / 2 - E), 0 === A && (x = x - n / 2 - E), Math.abs(x) < .001 && (x = 0), s.roundLengths && (x = Math.floor(x)), C % s.slidesPerGroup == 0 && v.push(x), f.push(x)) : (s.roundLengths && (x = Math.floor(x)), (C - Math.min(e.params.slidesPerGroupSkip, C)) % e.params.slidesPerGroup == 0 && v.push(x), f.push(x), x = x + z + E), e.virtualSize += z + E, T = z, C += 1 } } if (e.virtualSize = Math.max(e.virtualSize, n) + w, o && d && ("slide" === s.effect || "coverflow" === s.effect) && r.css({ width: e.virtualSize + s.spaceBetween + "px" }), s.setWrapperSize) r.css(((k = {})[t("width")] = e.virtualSize + s.spaceBetween + "px", k)); if (s.slidesPerColumn > 1)
              if (e.virtualSize = (z + s.spaceBetween) * M, e.virtualSize = Math.ceil(e.virtualSize / s.slidesPerColumn) - s.spaceBetween, r.css(((L = {})[t("width")] = e.virtualSize + s.spaceBetween + "px", L)), s.centeredSlides) { P = []; for (var Q = 0; Q < v.length; Q += 1) { var ee = v[Q];
                  s.roundLengths && (ee = Math.floor(ee)), v[Q] < e.virtualSize + v[0] && P.push(ee) }
                v = P }
            if (!s.centeredSlides) { P = []; for (var te = 0; te < v.length; te += 1) { var ae = v[te];
                s.roundLengths && (ae = Math.floor(ae)), v[te] <= e.virtualSize - n && P.push(ae) }
              v = P, Math.floor(e.virtualSize - n) - Math.floor(v[v.length - 1]) > 1 && v.push(e.virtualSize - n) } if (0 === v.length && (v = [0]), 0 !== s.spaceBetween) { var ie, se = e.isHorizontal() && o ? "marginLeft" : t("marginRight");
              c.filter((function(e, t) { return !s.cssMode || t !== c.length - 1 })).css(((ie = {})[se] = E + "px", ie)) } if (s.centeredSlides && s.centeredSlidesBounds) { var re = 0;
              m.forEach((function(e) { re += e + (s.spaceBetween ? s.spaceBetween : 0) })); var ne = (re -= s.spaceBetween) - n;
              v = v.map((function(e) { return e < 0 ? -g : e > ne ? ne + w : e })) } if (s.centerInsufficientSlides) { var le = 0; if (m.forEach((function(e) { le += e + (s.spaceBetween ? s.spaceBetween : 0) })), (le -= s.spaceBetween) < n) { var oe = (n - le) / 2;
                v.forEach((function(e, t) { v[t] = e - oe })), f.forEach((function(e, t) { f[t] = e + oe })) } }
            S(e, { slides: c, snapGrid: v, slidesGrid: f, slidesSizesGrid: m }), h !== u && e.emit("slidesLengthChange"), v.length !== y && (e.params.watchOverflow && e.checkOverflow(), e.emit("snapGridLengthChange")), f.length !== b && e.emit("slidesGridLengthChange"), (s.watchSlidesProgress || s.watchSlidesVisibility) && e.updateSlidesOffset() } }, updateAutoHeight: function(e) { var t, a = this,
            i = [],
            s = 0; if ("number" == typeof e ? a.setTransition(e) : !0 === e && a.setTransition(a.params.speed), "auto" !== a.params.slidesPerView && a.params.slidesPerView > 1)
            if (a.params.centeredSlides) a.visibleSlides.each((function(e) { i.push(e) }));
            else
              for (t = 0; t < Math.ceil(a.params.slidesPerView); t += 1) { var r = a.activeIndex + t; if (r > a.slides.length) break;
                i.push(a.slides.eq(r)[0]) } else i.push(a.slides.eq(a.activeIndex)[0]);
          for (t = 0; t < i.length; t += 1)
            if (void 0 !== i[t]) { var n = i[t].offsetHeight;
              s = n > s ? n : s }
          s && a.$wrapperEl.css("height", s + "px") }, updateSlidesOffset: function() { for (var e = this.slides, t = 0; t < e.length; t += 1) e[t].swiperSlideOffset = this.isHorizontal() ? e[t].offsetLeft : e[t].offsetTop }, updateSlidesProgress: function(e) { void 0 === e && (e = this && this.translate || 0); var t = this,
            a = t.params,
            i = t.slides,
            s = t.rtlTranslate; if (0 !== i.length) { void 0 === i[0].swiperSlideOffset && t.updateSlidesOffset(); var r = -e;
            s && (r = e), i.removeClass(a.slideVisibleClass), t.visibleSlidesIndexes = [], t.visibleSlides = []; for (var n = 0; n < i.length; n += 1) { var l = i[n],
                o = (r + (a.centeredSlides ? t.minTranslate() : 0) - l.swiperSlideOffset) / (l.swiperSlideSize + a.spaceBetween); if (a.watchSlidesVisibility || a.centeredSlides && a.autoHeight) { var d = -(r - l.swiperSlideOffset),
                  p = d + t.slidesSizesGrid[n];
                (d >= 0 && d < t.size - 1 || p > 1 && p <= t.size || d <= 0 && p >= t.size) && (t.visibleSlides.push(l), t.visibleSlidesIndexes.push(n), i.eq(n).addClass(a.slideVisibleClass)) }
              l.progress = s ? -o : o }
            t.visibleSlides = m(t.visibleSlides) } }, updateProgress: function(e) { var t = this; if (void 0 === e) { var a = t.rtlTranslate ? -1 : 1;
            e = t && t.translate && t.translate * a || 0 } var i = t.params,
            s = t.maxTranslate() - t.minTranslate(),
            r = t.progress,
            n = t.isBeginning,
            l = t.isEnd,
            o = n,
            d = l;
          0 === s ? (r = 0, n = !0, l = !0) : (n = (r = (e - t.minTranslate()) / s) <= 0, l = r >= 1), S(t, { progress: r, isBeginning: n, isEnd: l }), (i.watchSlidesProgress || i.watchSlidesVisibility || i.centeredSlides && i.autoHeight) && t.updateSlidesProgress(e), n && !o && t.emit("reachBeginning toEdge"), l && !d && t.emit("reachEnd toEdge"), (o && !n || d && !l) && t.emit("fromEdge"), t.emit("progress", r) }, updateSlidesClasses: function() { var e, t = this,
            a = t.slides,
            i = t.params,
            s = t.$wrapperEl,
            r = t.activeIndex,
            n = t.realIndex,
            l = t.virtual && i.virtual.enabled;
          a.removeClass(i.slideActiveClass + " " + i.slideNextClass + " " + i.slidePrevClass + " " + i.slideDuplicateActiveClass + " " + i.slideDuplicateNextClass + " " + i.slideDuplicatePrevClass), (e = l ? t.$wrapperEl.find("." + i.slideClass + '[data-swiper-slide-index="' + r + '"]') : a.eq(r)).addClass(i.slideActiveClass), i.loop && (e.hasClass(i.slideDuplicateClass) ? s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass + ')[data-swiper-slide-index="' + n + '"]').addClass(i.slideDuplicateActiveClass) : s.children("." + i.slideClass + "." + i.slideDuplicateClass + '[data-swiper-slide-index="' + n + '"]').addClass(i.slideDuplicateActiveClass)); var o = e.nextAll("." + i.slideClass).eq(0).addClass(i.slideNextClass);
          i.loop && 0 === o.length && (o = a.eq(0)).addClass(i.slideNextClass); var d = e.prevAll("." + i.slideClass).eq(0).addClass(i.slidePrevClass);
          i.loop && 0 === d.length && (d = a.eq(-1)).addClass(i.slidePrevClass), i.loop && (o.hasClass(i.slideDuplicateClass) ? s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass + ')[data-swiper-slide-index="' + o.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicateNextClass) : s.children("." + i.slideClass + "." + i.slideDuplicateClass + '[data-swiper-slide-index="' + o.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicateNextClass), d.hasClass(i.slideDuplicateClass) ? s.children("." + i.slideClass + ":not(." + i.slideDuplicateClass + ')[data-swiper-slide-index="' + d.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicatePrevClass) : s.children("." + i.slideClass + "." + i.slideDuplicateClass + '[data-swiper-slide-index="' + d.attr("data-swiper-slide-index") + '"]').addClass(i.slideDuplicatePrevClass)), t.emitSlidesClasses() }, updateActiveIndex: function(e) { var t, a = this,
            i = a.rtlTranslate ? a.translate : -a.translate,
            s = a.slidesGrid,
            r = a.snapGrid,
            n = a.params,
            l = a.activeIndex,
            o = a.realIndex,
            d = a.snapIndex,
            p = e; if (void 0 === p) { for (var u = 0; u < s.length; u += 1) void 0 !== s[u + 1] ? i >= s[u] && i < s[u + 1] - (s[u + 1] - s[u]) / 2 ? p = u : i >= s[u] && i < s[u + 1] && (p = u + 1) : i >= s[u] && (p = u);
            n.normalizeSlideIndex && (p < 0 || void 0 === p) && (p = 0) } if (r.indexOf(i) >= 0) t = r.indexOf(i);
          else { var c = Math.min(n.slidesPerGroupSkip, p);
            t = c + Math.floor((p - c) / n.slidesPerGroup) } if (t >= r.length && (t = r.length - 1), p !== l) { var h = parseInt(a.slides.eq(p).attr("data-swiper-slide-index") || p, 10);
            S(a, { snapIndex: t, realIndex: h, previousIndex: l, activeIndex: p }), a.emit("activeIndexChange"), a.emit("snapIndexChange"), o !== h && a.emit("realIndexChange"), (a.initialized || a.params.runCallbacksOnInit) && a.emit("slideChange") } else t !== d && (a.snapIndex = t, a.emit("snapIndexChange")) }, updateClickedSlide: function(e) { var t = this,
            a = t.params,
            i = m(e.target).closest("." + a.slideClass)[0],
            s = !1; if (i)
            for (var r = 0; r < t.slides.length; r += 1) t.slides[r] === i && (s = !0); if (!i || !s) return t.clickedSlide = void 0, void(t.clickedIndex = void 0);
          t.clickedSlide = i, t.virtual && t.params.virtual.enabled ? t.clickedIndex = parseInt(m(i).attr("data-swiper-slide-index"), 10) : t.clickedIndex = m(i).index(), a.slideToClickedSlide && void 0 !== t.clickedIndex && t.clickedIndex !== t.activeIndex && t.slideToClickedSlide() } }, translate: { getTranslate: function(e) { void 0 === e && (e = this.isHorizontal() ? "x" : "y"); var t = this,
            a = t.params,
            i = t.rtlTranslate,
            s = t.translate,
            r = t.$wrapperEl; if (a.virtualTranslate) return i ? -s : s; if (a.cssMode) return s; var n = T(r[0], e); return i && (n = -n), n || 0 }, setTranslate: function(e, t) { var a = this,
            i = a.rtlTranslate,
            s = a.params,
            r = a.$wrapperEl,
            n = a.wrapperEl,
            l = a.progress,
            o = 0,
            d = 0;
          a.isHorizontal() ? o = i ? -e : e : d = e, s.roundLengths && (o = Math.floor(o), d = Math.floor(d)), s.cssMode ? n[a.isHorizontal() ? "scrollLeft" : "scrollTop"] = a.isHorizontal() ? -o : -d : s.virtualTranslate || r.transform("translate3d(" + o + "px, " + d + "px, 0px)"), a.previousTranslate = a.translate, a.translate = a.isHorizontal() ? o : d; var p = a.maxTranslate() - a.minTranslate();
          (0 === p ? 0 : (e - a.minTranslate()) / p) !== l && a.updateProgress(e), a.emit("setTranslate", a.translate, t) }, minTranslate: function() { return -this.snapGrid[0] }, maxTranslate: function() { return -this.snapGrid[this.snapGrid.length - 1] }, translateTo: function(e, t, a, i, s) { void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === a && (a = !0), void 0 === i && (i = !0); var r = this,
            n = r.params,
            l = r.wrapperEl; if (r.animating && n.preventInteractionOnTransition) return !1; var o, d = r.minTranslate(),
            p = r.maxTranslate(); if (o = i && e > d ? d : i && e < p ? p : e, r.updateProgress(o), n.cssMode) { var u, c = r.isHorizontal(); if (0 === t) l[c ? "scrollLeft" : "scrollTop"] = -o;
            else if (l.scrollTo) l.scrollTo(((u = {})[c ? "left" : "top"] = -o, u.behavior = "smooth", u));
            else l[c ? "scrollLeft" : "scrollTop"] = -o; return !0 } return 0 === t ? (r.setTransition(0), r.setTranslate(o), a && (r.emit("beforeTransitionStart", t, s), r.emit("transitionEnd"))) : (r.setTransition(t), r.setTranslate(o), a && (r.emit("beforeTransitionStart", t, s), r.emit("transitionStart")), r.animating || (r.animating = !0, r.onTranslateToWrapperTransitionEnd || (r.onTranslateToWrapperTransitionEnd = function(e) { r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onTranslateToWrapperTransitionEnd), r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd), r.onTranslateToWrapperTransitionEnd = null, delete r.onTranslateToWrapperTransitionEnd, a && r.emit("transitionEnd")) }), r.$wrapperEl[0].addEventListener("transitionend", r.onTranslateToWrapperTransitionEnd), r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd))), !0 } }, transition: { setTransition: function(e, t) { var a = this;
          a.params.cssMode || a.$wrapperEl.transition(e), a.emit("setTransition", e, t) }, transitionStart: function(e, t) { void 0 === e && (e = !0); var a = this,
            i = a.activeIndex,
            s = a.params,
            r = a.previousIndex; if (!s.cssMode) { s.autoHeight && a.updateAutoHeight(); var n = t; if (n || (n = i > r ? "next" : i < r ? "prev" : "reset"), a.emit("transitionStart"), e && i !== r) { if ("reset" === n) return void a.emit("slideResetTransitionStart");
              a.emit("slideChangeTransitionStart"), "next" === n ? a.emit("slideNextTransitionStart") : a.emit("slidePrevTransitionStart") } } }, transitionEnd: function(e, t) { void 0 === e && (e = !0); var a = this,
            i = a.activeIndex,
            s = a.previousIndex,
            r = a.params; if (a.animating = !1, !r.cssMode) { a.setTransition(0); var n = t; if (n || (n = i > s ? "next" : i < s ? "prev" : "reset"), a.emit("transitionEnd"), e && i !== s) { if ("reset" === n) return void a.emit("slideResetTransitionEnd");
              a.emit("slideChangeTransitionEnd"), "next" === n ? a.emit("slideNextTransitionEnd") : a.emit("slidePrevTransitionEnd") } } } }, slide: { slideTo: function(e, t, a, i) { if (void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === a && (a = !0), "number" != typeof e && "string" != typeof e) throw new Error("The 'index' argument cannot have type other than 'number' or 'string'. [" + typeof e + "] given."); if ("string" == typeof e) { var s = parseInt(e, 10); if (!isFinite(s)) throw new Error("The passed-in 'index' (string) couldn't be converted to 'number'. [" + e + "] given.");
            e = s } var r = this,
            n = e;
          n < 0 && (n = 0); var l = r.params,
            o = r.snapGrid,
            d = r.slidesGrid,
            p = r.previousIndex,
            u = r.activeIndex,
            c = r.rtlTranslate,
            h = r.wrapperEl; if (r.animating && l.preventInteractionOnTransition) return !1; var v = Math.min(r.params.slidesPerGroupSkip, n),
            f = v + Math.floor((n - v) / r.params.slidesPerGroup);
          f >= o.length && (f = o.length - 1), (u || l.initialSlide || 0) === (p || 0) && a && r.emit("beforeSlideChangeStart"); var m, g = -o[f]; if (r.updateProgress(g), l.normalizeSlideIndex)
            for (var w = 0; w < d.length; w += 1) { var y = -Math.floor(100 * g),
                b = Math.floor(100 * d[w]),
                E = Math.floor(100 * d[w + 1]);
              void 0 !== d[w + 1] ? y >= b && y < E - (E - b) / 2 ? n = w : y >= b && y < E && (n = w + 1) : y >= b && (n = w) }
          if (r.initialized && n !== u) { if (!r.allowSlideNext && g < r.translate && g < r.minTranslate()) return !1; if (!r.allowSlidePrev && g > r.translate && g > r.maxTranslate() && (u || 0) !== n) return !1 } if (m = n > u ? "next" : n < u ? "prev" : "reset", c && -g === r.translate || !c && g === r.translate) return r.updateActiveIndex(n), l.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== l.effect && r.setTranslate(g), "reset" !== m && (r.transitionStart(a, m), r.transitionEnd(a, m)), !1; if (l.cssMode) { var x, T = r.isHorizontal(),
              C = -g; if (c && (C = h.scrollWidth - h.offsetWidth - C), 0 === t) h[T ? "scrollLeft" : "scrollTop"] = C;
            else if (h.scrollTo) h.scrollTo(((x = {})[T ? "left" : "top"] = C, x.behavior = "smooth", x));
            else h[T ? "scrollLeft" : "scrollTop"] = C; return !0 } return 0 === t ? (r.setTransition(0), r.setTranslate(g), r.updateActiveIndex(n), r.updateSlidesClasses(), r.emit("beforeTransitionStart", t, i), r.transitionStart(a, m), r.transitionEnd(a, m)) : (r.setTransition(t), r.setTranslate(g), r.updateActiveIndex(n), r.updateSlidesClasses(), r.emit("beforeTransitionStart", t, i), r.transitionStart(a, m), r.animating || (r.animating = !0, r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function(e) { r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd), r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(a, m)) }), r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd))), !0 }, slideToLoop: function(e, t, a, i) { void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === a && (a = !0); var s = this,
            r = e; return s.params.loop && (r += s.loopedSlides), s.slideTo(r, t, a, i) }, slideNext: function(e, t, a) { void 0 === e && (e = this.params.speed), void 0 === t && (t = !0); var i = this,
            s = i.params,
            r = i.animating,
            n = i.activeIndex < s.slidesPerGroupSkip ? 1 : s.slidesPerGroup; if (s.loop) { if (r && s.loopPreventsSlide) return !1;
            i.loopFix(), i._clientLeft = i.$wrapperEl[0].clientLeft } return i.slideTo(i.activeIndex + n, e, t, a) }, slidePrev: function(e, t, a) { void 0 === e && (e = this.params.speed), void 0 === t && (t = !0); var i = this,
            s = i.params,
            r = i.animating,
            n = i.snapGrid,
            l = i.slidesGrid,
            o = i.rtlTranslate; if (s.loop) { if (r && s.loopPreventsSlide) return !1;
            i.loopFix(), i._clientLeft = i.$wrapperEl[0].clientLeft }

          function d(e) { return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e) } var p = d(o ? i.translate : -i.translate),
            u = n.map((function(e) { return d(e) }));
          n[u.indexOf(p)]; var c, h = n[u.indexOf(p) - 1]; return void 0 === h && s.cssMode && n.forEach((function(e) {!h && p >= e && (h = e) })), void 0 !== h && (c = l.indexOf(h)) < 0 && (c = i.activeIndex - 1), i.slideTo(c, e, t, a) }, slideReset: function(e, t, a) { return void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), this.slideTo(this.activeIndex, e, t, a) }, slideToClosest: function(e, t, a, i) { void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), void 0 === i && (i = .5); var s = this,
            r = s.activeIndex,
            n = Math.min(s.params.slidesPerGroupSkip, r),
            l = n + Math.floor((r - n) / s.params.slidesPerGroup),
            o = s.rtlTranslate ? s.translate : -s.translate; if (o >= s.snapGrid[l]) { var d = s.snapGrid[l];
            o - d > (s.snapGrid[l + 1] - d) * i && (r += s.params.slidesPerGroup) } else { var p = s.snapGrid[l - 1];
            o - p <= (s.snapGrid[l] - p) * i && (r -= s.params.slidesPerGroup) } return r = Math.max(r, 0), r = Math.min(r, s.slidesGrid.length - 1), s.slideTo(r, e, t, a) }, slideToClickedSlide: function() { var e, t = this,
            a = t.params,
            i = t.$wrapperEl,
            s = "auto" === a.slidesPerView ? t.slidesPerViewDynamic() : a.slidesPerView,
            r = t.clickedIndex; if (a.loop) { if (t.animating) return;
            e = parseInt(m(t.clickedSlide).attr("data-swiper-slide-index"), 10), a.centeredSlides ? r < t.loopedSlides - s / 2 || r > t.slides.length - t.loopedSlides + s / 2 ? (t.loopFix(), r = i.children("." + a.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + a.slideDuplicateClass + ")").eq(0).index(), E((function() { t.slideTo(r) }))) : t.slideTo(r) : r > t.slides.length - s ? (t.loopFix(), r = i.children("." + a.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + a.slideDuplicateClass + ")").eq(0).index(), E((function() { t.slideTo(r) }))) : t.slideTo(r) } else t.slideTo(r) } }, loop: { loopCreate: function() { var e = this,
            t = r(),
            a = e.params,
            i = e.$wrapperEl;
          i.children("." + a.slideClass + "." + a.slideDuplicateClass).remove(); var s = i.children("." + a.slideClass); if (a.loopFillGroupWithBlank) { var n = a.slidesPerGroup - s.length % a.slidesPerGroup; if (n !== a.slidesPerGroup) { for (var l = 0; l < n; l += 1) { var o = m(t.createElement("div")).addClass(a.slideClass + " " + a.slideBlankClass);
                i.append(o) }
              s = i.children("." + a.slideClass) } } "auto" !== a.slidesPerView || a.loopedSlides || (a.loopedSlides = s.length), e.loopedSlides = Math.ceil(parseFloat(a.loopedSlides || a.slidesPerView, 10)), e.loopedSlides += a.loopAdditionalSlides, e.loopedSlides > s.length && (e.loopedSlides = s.length); var d = [],
            p = [];
          s.each((function(t, a) { var i = m(t);
            a < e.loopedSlides && p.push(t), a < s.length && a >= s.length - e.loopedSlides && d.push(t), i.attr("data-swiper-slide-index", a) })); for (var u = 0; u < p.length; u += 1) i.append(m(p[u].cloneNode(!0)).addClass(a.slideDuplicateClass)); for (var c = d.length - 1; c >= 0; c -= 1) i.prepend(m(d[c].cloneNode(!0)).addClass(a.slideDuplicateClass)) }, loopFix: function() { var e = this;
          e.emit("beforeLoopFix"); var t, a = e.activeIndex,
            i = e.slides,
            s = e.loopedSlides,
            r = e.allowSlidePrev,
            n = e.allowSlideNext,
            l = e.snapGrid,
            o = e.rtlTranslate;
          e.allowSlidePrev = !0, e.allowSlideNext = !0; var d = -l[a] - e.getTranslate(); if (a < s) t = i.length - 3 * s + a, t += s, e.slideTo(t, 0, !1, !0) && 0 !== d && e.setTranslate((o ? -e.translate : e.translate) - d);
          else if (a >= i.length - s) { t = -i.length + a + s, t += s, e.slideTo(t, 0, !1, !0) && 0 !== d && e.setTranslate((o ? -e.translate : e.translate) - d) }
          e.allowSlidePrev = r, e.allowSlideNext = n, e.emit("loopFix") }, loopDestroy: function() { var e = this,
            t = e.$wrapperEl,
            a = e.params,
            i = e.slides;
          t.children("." + a.slideClass + "." + a.slideDuplicateClass + ",." + a.slideClass + "." + a.slideBlankClass).remove(), i.removeAttr("data-swiper-slide-index") } }, grabCursor: { setGrabCursor: function(e) { var t = this; if (!(t.support.touch || !t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode)) { var a = t.el;
            a.style.cursor = "move", a.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab", a.style.cursor = e ? "-moz-grabbin" : "-moz-grab", a.style.cursor = e ? "grabbing" : "grab" } }, unsetGrabCursor: function() { var e = this;
          e.support.touch || e.params.watchOverflow && e.isLocked || e.params.cssMode || (e.el.style.cursor = "") } }, manipulation: { appendSlide: function(e) { var t = this,
            a = t.$wrapperEl,
            i = t.params; if (i.loop && t.loopDestroy(), "object" == typeof e && "length" in e)
            for (var s = 0; s < e.length; s += 1) e[s] && a.append(e[s]);
          else a.append(e);
          i.loop && t.loopCreate(), i.observer && t.support.observer || t.update() }, prependSlide: function(e) { var t = this,
            a = t.params,
            i = t.$wrapperEl,
            s = t.activeIndex;
          a.loop && t.loopDestroy(); var r = s + 1; if ("object" == typeof e && "length" in e) { for (var n = 0; n < e.length; n += 1) e[n] && i.prepend(e[n]);
            r = s + e.length } else i.prepend(e);
          a.loop && t.loopCreate(), a.observer && t.support.observer || t.update(), t.slideTo(r, 0, !1) }, addSlide: function(e, t) { var a = this,
            i = a.$wrapperEl,
            s = a.params,
            r = a.activeIndex;
          s.loop && (r -= a.loopedSlides, a.loopDestroy(), a.slides = i.children("." + s.slideClass)); var n = a.slides.length; if (e <= 0) a.prependSlide(t);
          else if (e >= n) a.appendSlide(t);
          else { for (var l = r > e ? r + 1 : r, o = [], d = n - 1; d >= e; d -= 1) { var p = a.slides.eq(d);
              p.remove(), o.unshift(p) } if ("object" == typeof t && "length" in t) { for (var u = 0; u < t.length; u += 1) t[u] && i.append(t[u]);
              l = r > e ? r + t.length : r } else i.append(t); for (var c = 0; c < o.length; c += 1) i.append(o[c]);
            s.loop && a.loopCreate(), s.observer && a.support.observer || a.update(), s.loop ? a.slideTo(l + a.loopedSlides, 0, !1) : a.slideTo(l, 0, !1) } }, removeSlide: function(e) { var t = this,
            a = t.params,
            i = t.$wrapperEl,
            s = t.activeIndex;
          a.loop && (s -= t.loopedSlides, t.loopDestroy(), t.slides = i.children("." + a.slideClass)); var r, n = s; if ("object" == typeof e && "length" in e) { for (var l = 0; l < e.length; l += 1) r = e[l], t.slides[r] && t.slides.eq(r).remove(), r < n && (n -= 1);
            n = Math.max(n, 0) } else r = e, t.slides[r] && t.slides.eq(r).remove(), r < n && (n -= 1), n = Math.max(n, 0);
          a.loop && t.loopCreate(), a.observer && t.support.observer || t.update(), a.loop ? t.slideTo(n + t.loopedSlides, 0, !1) : t.slideTo(n, 0, !1) }, removeAllSlides: function() { for (var e = [], t = 0; t < this.slides.length; t += 1) e.push(t);
          this.removeSlide(e) } }, events: { attachEvents: function() { var e = this,
            t = r(),
            a = e.params,
            i = e.touchEvents,
            s = e.el,
            n = e.wrapperEl,
            l = e.device,
            o = e.support;
          e.onTouchStart = O.bind(e), e.onTouchMove = A.bind(e), e.onTouchEnd = D.bind(e), a.cssMode && (e.onScroll = B.bind(e)), e.onClick = N.bind(e); var d = !!a.nested; if (!o.touch && o.pointerEvents) s.addEventListener(i.start, e.onTouchStart, !1), t.addEventListener(i.move, e.onTouchMove, d), t.addEventListener(i.end, e.onTouchEnd, !1);
          else { if (o.touch) { var p = !("touchstart" !== i.start || !o.passiveListener || !a.passiveListeners) && { passive: !0, capture: !1 };
              s.addEventListener(i.start, e.onTouchStart, p), s.addEventListener(i.move, e.onTouchMove, o.passiveListener ? { passive: !1, capture: d } : d), s.addEventListener(i.end, e.onTouchEnd, p), i.cancel && s.addEventListener(i.cancel, e.onTouchEnd, p), H || (t.addEventListener("touchstart", X), H = !0) }(a.simulateTouch && !l.ios && !l.android || a.simulateTouch && !o.touch && l.ios) && (s.addEventListener("mousedown", e.onTouchStart, !1), t.addEventListener("mousemove", e.onTouchMove, d), t.addEventListener("mouseup", e.onTouchEnd, !1)) }(a.preventClicks || a.preventClicksPropagation) && s.addEventListener("click", e.onClick, !0), a.cssMode && n.addEventListener("scroll", e.onScroll), a.updateOnWindowResize ? e.on(l.ios || l.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", G, !0) : e.on("observerUpdate", G, !0) }, detachEvents: function() { var e = this,
            t = r(),
            a = e.params,
            i = e.touchEvents,
            s = e.el,
            n = e.wrapperEl,
            l = e.device,
            o = e.support,
            d = !!a.nested; if (!o.touch && o.pointerEvents) s.removeEventListener(i.start, e.onTouchStart, !1), t.removeEventListener(i.move, e.onTouchMove, d), t.removeEventListener(i.end, e.onTouchEnd, !1);
          else { if (o.touch) { var p = !("onTouchStart" !== i.start || !o.passiveListener || !a.passiveListeners) && { passive: !0, capture: !1 };
              s.removeEventListener(i.start, e.onTouchStart, p), s.removeEventListener(i.move, e.onTouchMove, d), s.removeEventListener(i.end, e.onTouchEnd, p), i.cancel && s.removeEventListener(i.cancel, e.onTouchEnd, p) }(a.simulateTouch && !l.ios && !l.android || a.simulateTouch && !o.touch && l.ios) && (s.removeEventListener("mousedown", e.onTouchStart, !1), t.removeEventListener("mousemove", e.onTouchMove, d), t.removeEventListener("mouseup", e.onTouchEnd, !1)) }(a.preventClicks || a.preventClicksPropagation) && s.removeEventListener("click", e.onClick, !0), a.cssMode && n.removeEventListener("scroll", e.onScroll), e.off(l.ios || l.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", G) } }, breakpoints: { setBreakpoint: function() { var e = this,
            t = e.activeIndex,
            a = e.initialized,
            i = e.loopedSlides,
            s = void 0 === i ? 0 : i,
            r = e.params,
            n = e.$el,
            l = r.breakpoints; if (l && (!l || 0 !== Object.keys(l).length)) { var o = e.getBreakpoint(l); if (o && e.currentBreakpoint !== o) { var d = o in l ? l[o] : void 0;
              d && ["slidesPerView", "spaceBetween", "slidesPerGroup", "slidesPerGroupSkip", "slidesPerColumn"].forEach((function(e) { var t = d[e];
                void 0 !== t && (d[e] = "slidesPerView" !== e || "AUTO" !== t && "auto" !== t ? "slidesPerView" === e ? parseFloat(t) : parseInt(t, 10) : "auto") })); var p = d || e.originalParams,
                u = r.slidesPerColumn > 1,
                c = p.slidesPerColumn > 1;
              u && !c ? (n.removeClass(r.containerModifierClass + "multirow " + r.containerModifierClass + "multirow-column"), e.emitContainerClasses()) : !u && c && (n.addClass(r.containerModifierClass + "multirow"), "column" === p.slidesPerColumnFill && n.addClass(r.containerModifierClass + "multirow-column"), e.emitContainerClasses()); var h = p.direction && p.direction !== r.direction,
                v = r.loop && (p.slidesPerView !== r.slidesPerView || h);
              h && a && e.changeDirection(), S(e.params, p), S(e, { allowTouchMove: e.params.allowTouchMove, allowSlideNext: e.params.allowSlideNext, allowSlidePrev: e.params.allowSlidePrev }), e.currentBreakpoint = o, e.emit("_beforeBreakpoint", p), v && a && (e.loopDestroy(), e.loopCreate(), e.updateSlides(), e.slideTo(t - s + e.loopedSlides, 0, !1)), e.emit("breakpoint", p) } } }, getBreakpoint: function(e) { var t = l(); if (e) { var a = !1,
              i = Object.keys(e).map((function(e) { if ("string" == typeof e && 0 === e.indexOf("@")) { var a = parseFloat(e.substr(1)); return { value: t.innerHeight * a, point: e } } return { value: e, point: e } }));
            i.sort((function(e, t) { return parseInt(e.value, 10) - parseInt(t.value, 10) })); for (var s = 0; s < i.length; s += 1) { var r = i[s],
                n = r.point;
              r.value <= t.innerWidth && (a = n) } return a || "max" } } }, checkOverflow: { checkOverflow: function() { var e = this,
            t = e.params,
            a = e.isLocked,
            i = e.slides.length > 0 && t.slidesOffsetBefore + t.spaceBetween * (e.slides.length - 1) + e.slides[0].offsetWidth * e.slides.length;
          t.slidesOffsetBefore && t.slidesOffsetAfter && i ? e.isLocked = i <= e.size : e.isLocked = 1 === e.snapGrid.length, e.allowSlideNext = !e.isLocked, e.allowSlidePrev = !e.isLocked, a !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock"), a && a !== e.isLocked && (e.isEnd = !1, e.navigation && e.navigation.update()) } }, classes: { addClasses: function() { var e, t, a, i = this,
            s = i.classNames,
            r = i.params,
            n = i.rtl,
            l = i.$el,
            o = i.device,
            d = i.support,
            p = (e = ["initialized", r.direction, { "pointer-events": d.pointerEvents && !d.touch }, { "free-mode": r.freeMode }, { autoheight: r.autoHeight }, { rtl: n }, { multirow: r.slidesPerColumn > 1 }, { "multirow-column": r.slidesPerColumn > 1 && "column" === r.slidesPerColumnFill }, { android: o.android }, { ios: o.ios }, { "css-mode": r.cssMode }], t = r.containerModifierClass, a = [], e.forEach((function(e) { "object" == typeof e ? Object.entries(e).forEach((function(e) { var i = e[0];
                e[1] && a.push(t + i) })) : "string" == typeof e && a.push(t + e) })), a);
          s.push.apply(s, p), l.addClass([].concat(s).join(" ")), i.emitContainerClasses() }, removeClasses: function() { var e = this,
            t = e.$el,
            a = e.classNames;
          t.removeClass(a.join(" ")), e.emitContainerClasses() } }, images: { loadImage: function(e, t, a, i, s, r) { var n, o = l();

          function d() { r && r() }
          m(e).parent("picture")[0] || e.complete && s ? d() : t ? ((n = new o.Image).onload = d, n.onerror = d, i && (n.sizes = i), a && (n.srcset = a), t && (n.src = t)) : d() }, preloadImages: function() { var e = this;

          function t() { null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1), e.imagesLoaded === e.imagesToLoad.length && (e.params.updateOnImagesReady && e.update(), e.emit("imagesReady"))) }
          e.imagesToLoad = e.$el.find("img"); for (var a = 0; a < e.imagesToLoad.length; a += 1) { var i = e.imagesToLoad[a];
            e.loadImage(i, i.currentSrc || i.getAttribute("src"), i.srcset || i.getAttribute("srcset"), i.sizes || i.getAttribute("sizes"), !0, t) } } } },
    V = {},
    W = function() {
      function t() { for (var e, a, i = arguments.length, s = new Array(i), r = 0; r < i; r++) s[r] = arguments[r]; if (1 === s.length && s[0].constructor && s[0].constructor === Object ? a = s[0] : (e = s[0], a = s[1]), a || (a = {}), a = S({}, a), e && !a.el && (a.el = e), a.el && m(a.el).length > 1) { var n = []; return m(a.el).each((function(e) { var i = S({}, a, { el: e });
            n.push(new t(i)) })), n } var l = this;
        l.support = z(), l.device = P({ userAgent: a.userAgent }), l.browser = k(), l.eventsListeners = {}, l.eventsAnyListeners = [], void 0 === l.modules && (l.modules = {}), Object.keys(l.modules).forEach((function(e) { var t = l.modules[e]; if (t.params) { var i = Object.keys(t.params)[0],
              s = t.params[i]; if ("object" != typeof s || null === s) return; if (!(i in a) || !("enabled" in s)) return;!0 === a[i] && (a[i] = { enabled: !0 }), "object" != typeof a[i] || "enabled" in a[i] || (a[i].enabled = !0), a[i] || (a[i] = { enabled: !1 }) } })); var o, d, p = S({}, Y); return l.useParams(p), l.params = S({}, p, V, a), l.originalParams = S({}, l.params), l.passedParams = S({}, a), l.params && l.params.on && Object.keys(l.params.on).forEach((function(e) { l.on(e, l.params.on[e]) })), l.params && l.params.onAny && l.onAny(l.params.onAny), l.$ = m, S(l, { el: e, classNames: [], slides: m(), slidesGrid: [], snapGrid: [], slidesSizesGrid: [], isHorizontal: function() { return "horizontal" === l.params.direction }, isVertical: function() { return "vertical" === l.params.direction }, activeIndex: 0, realIndex: 0, isBeginning: !0, isEnd: !1, translate: 0, previousTranslate: 0, progress: 0, velocity: 0, animating: !1, allowSlideNext: l.params.allowSlideNext, allowSlidePrev: l.params.allowSlidePrev, touchEvents: (o = ["touchstart", "touchmove", "touchend", "touchcancel"], d = ["mousedown", "mousemove", "mouseup"], l.support.pointerEvents && (d = ["pointerdown", "pointermove", "pointerup"]), l.touchEventsTouch = { start: o[0], move: o[1], end: o[2], cancel: o[3] }, l.touchEventsDesktop = { start: d[0], move: d[1], end: d[2] }, l.support.touch || !l.params.simulateTouch ? l.touchEventsTouch : l.touchEventsDesktop), touchEventsData: { isTouched: void 0, isMoved: void 0, allowTouchCallbacks: void 0, touchStartTime: void 0, isScrolling: void 0, currentTranslate: void 0, startTranslate: void 0, allowThresholdMove: void 0, formElements: "input, select, option, textarea, button, video, label", lastClickTime: x(), clickTimeout: void 0, velocities: [], allowMomentumBounce: void 0, isTouchEvent: void 0, startMoving: void 0 }, allowClick: !0, allowTouchMove: l.params.allowTouchMove, touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 }, imagesToLoad: [], imagesLoaded: 0 }), l.useModules(), l.emit("_swiper"), l.params.init && l.init(), l } var a, i, s, r = t.prototype; return r.emitContainerClasses = function() { var e = this; if (e.params._emitClasses && e.el) { var t = e.el.className.split(" ").filter((function(t) { return 0 === t.indexOf("swiper-container") || 0 === t.indexOf(e.params.containerModifierClass) }));
          e.emit("_containerClasses", t.join(" ")) } }, r.getSlideClasses = function(e) { var t = this; return e.className.split(" ").filter((function(e) { return 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass) })).join(" ") }, r.emitSlidesClasses = function() { var e = this; if (e.params._emitClasses && e.el) { var t = [];
          e.slides.each((function(a) { var i = e.getSlideClasses(a);
            t.push({ slideEl: a, classNames: i }), e.emit("_slideClass", a, i) })), e.emit("_slideClasses", t) } }, r.slidesPerViewDynamic = function() { var e = this,
          t = e.params,
          a = e.slides,
          i = e.slidesGrid,
          s = e.size,
          r = e.activeIndex,
          n = 1; if (t.centeredSlides) { for (var l, o = a[r].swiperSlideSize, d = r + 1; d < a.length; d += 1) a[d] && !l && (n += 1, (o += a[d].swiperSlideSize) > s && (l = !0)); for (var p = r - 1; p >= 0; p -= 1) a[p] && !l && (n += 1, (o += a[p].swiperSlideSize) > s && (l = !0)) } else
          for (var u = r + 1; u < a.length; u += 1) i[u] - i[r] < s && (n += 1); return n }, r.update = function() { var e = this; if (e && !e.destroyed) { var t = e.snapGrid,
            a = e.params;
          a.breakpoints && e.setBreakpoint(), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses(), e.params.freeMode ? (i(), e.params.autoHeight && e.updateAutoHeight()) : (("auto" === e.params.slidesPerView || e.params.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0)) || i(), a.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update") }

        function i() { var t = e.rtlTranslate ? -1 * e.translate : e.translate,
            a = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
          e.setTranslate(a), e.updateActiveIndex(), e.updateSlidesClasses() } }, r.changeDirection = function(e, t) { void 0 === t && (t = !0); var a = this,
          i = a.params.direction; return e || (e = "horizontal" === i ? "vertical" : "horizontal"), e === i || "horizontal" !== e && "vertical" !== e || (a.$el.removeClass("" + a.params.containerModifierClass + i).addClass("" + a.params.containerModifierClass + e), a.emitContainerClasses(), a.params.direction = e, a.slides.each((function(t) { "vertical" === e ? t.style.width = "" : t.style.height = "" })), a.emit("changeDirection"), t && a.update()), a }, r.mount = function(e) { var t = this; if (t.mounted) return !0; var a, i = m(e || t.params.el); return !!(e = i[0]) && (e.swiper = t, e && e.shadowRoot && e.shadowRoot.querySelector ? (a = m(e.shadowRoot.querySelector("." + t.params.wrapperClass))).children = function(e) { return i.children(e) } : a = i.children("." + t.params.wrapperClass), S(t, { $el: i, el: e, $wrapperEl: a, wrapperEl: a[0], mounted: !0, rtl: "rtl" === e.dir.toLowerCase() || "rtl" === i.css("direction"), rtlTranslate: "horizontal" === t.params.direction && ("rtl" === e.dir.toLowerCase() || "rtl" === i.css("direction")), wrongRTL: "-webkit-box" === a.css("display") }), !0) }, r.init = function(e) { var t = this; return t.initialized || !1 === t.mount(e) || (t.emit("beforeInit"), t.params.breakpoints && t.setBreakpoint(), t.addClasses(), t.params.loop && t.loopCreate(), t.updateSize(), t.updateSlides(), t.params.watchOverflow && t.checkOverflow(), t.params.grabCursor && t.setGrabCursor(), t.params.preloadImages && t.preloadImages(), t.params.loop ? t.slideTo(t.params.initialSlide + t.loopedSlides, 0, t.params.runCallbacksOnInit) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit), t.attachEvents(), t.initialized = !0, t.emit("init"), t.emit("afterInit")), t }, r.destroy = function(e, t) { void 0 === e && (e = !0), void 0 === t && (t = !0); var a, i = this,
          s = i.params,
          r = i.$el,
          n = i.$wrapperEl,
          l = i.slides; return void 0 === i.params || i.destroyed || (i.emit("beforeDestroy"), i.initialized = !1, i.detachEvents(), s.loop && i.loopDestroy(), t && (i.removeClasses(), r.removeAttr("style"), n.removeAttr("style"), l && l.length && l.removeClass([s.slideVisibleClass, s.slideActiveClass, s.slideNextClass, s.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")), i.emit("destroy"), Object.keys(i.eventsListeners).forEach((function(e) { i.off(e) })), !1 !== e && (i.$el[0].swiper = null, a = i, Object.keys(a).forEach((function(e) { try { a[e] = null } catch (e) {} try { delete a[e] } catch (e) {} }))), i.destroyed = !0), null }, t.extendDefaults = function(e) { S(V, e) }, t.installModule = function(e) { t.prototype.modules || (t.prototype.modules = {}); var a = e.name || Object.keys(t.prototype.modules).length + "_" + x();
        t.prototype.modules[a] = e }, t.use = function(e) { return Array.isArray(e) ? (e.forEach((function(e) { return t.installModule(e) })), t) : (t.installModule(e), t) }, a = t, s = [{ key: "extendedDefaults", get: function() { return V } }, { key: "defaults", get: function() { return Y } }], (i = null) && e(a.prototype, i), s && e(a, s), t }();
  Object.keys(R).forEach((function(e) { Object.keys(R[e]).forEach((function(t) { W.prototype[t] = R[e][t] })) })), W.use([L, I]); var F = { update: function(e) { var t = this,
          a = t.params,
          i = a.slidesPerView,
          s = a.slidesPerGroup,
          r = a.centeredSlides,
          n = t.params.virtual,
          l = n.addSlidesBefore,
          o = n.addSlidesAfter,
          d = t.virtual,
          p = d.from,
          u = d.to,
          c = d.slides,
          h = d.slidesGrid,
          v = d.renderSlide,
          f = d.offset;
        t.updateActiveIndex(); var m, g, w, y = t.activeIndex || 0;
        m = t.rtlTranslate ? "right" : t.isHorizontal() ? "left" : "top", r ? (g = Math.floor(i / 2) + s + o, w = Math.floor(i / 2) + s + l) : (g = i + (s - 1) + o, w = s + l); var b = Math.max((y || 0) - w, 0),
          E = Math.min((y || 0) + g, c.length - 1),
          x = (t.slidesGrid[b] || 0) - (t.slidesGrid[0] || 0);

        function T() { t.updateSlides(), t.updateProgress(), t.updateSlidesClasses(), t.lazy && t.params.lazy.enabled && t.lazy.load() } if (S(t.virtual, { from: b, to: E, offset: x, slidesGrid: t.slidesGrid }), p === b && u === E && !e) return t.slidesGrid !== h && x !== f && t.slides.css(m, x + "px"), void t.updateProgress(); if (t.params.virtual.renderExternal) return t.params.virtual.renderExternal.call(t, { offset: x, from: b, to: E, slides: function() { for (var e = [], t = b; t <= E; t += 1) e.push(c[t]); return e }() }), void(t.params.virtual.renderExternalUpdate && T()); var C = [],
          M = []; if (e) t.$wrapperEl.find("." + t.params.slideClass).remove();
        else
          for (var z = p; z <= u; z += 1)(z < b || z > E) && t.$wrapperEl.find("." + t.params.slideClass + '[data-swiper-slide-index="' + z + '"]').remove(); for (var P = 0; P < c.length; P += 1) P >= b && P <= E && (void 0 === u || e ? M.push(P) : (P > u && M.push(P), P < p && C.push(P)));
        M.forEach((function(e) { t.$wrapperEl.append(v(c[e], e)) })), C.sort((function(e, t) { return t - e })).forEach((function(e) { t.$wrapperEl.prepend(v(c[e], e)) })), t.$wrapperEl.children(".swiper-slide").css(m, x + "px"), T() }, renderSlide: function(e, t) { var a = this,
          i = a.params.virtual; if (i.cache && a.virtual.cache[t]) return a.virtual.cache[t]; var s = i.renderSlide ? m(i.renderSlide.call(a, e, t)) : m('<div class="' + a.params.slideClass + '" data-swiper-slide-index="' + t + '">' + e + "</div>"); return s.attr("data-swiper-slide-index") || s.attr("data-swiper-slide-index", t), i.cache && (a.virtual.cache[t] = s), s }, appendSlide: function(e) { var t = this; if ("object" == typeof e && "length" in e)
          for (var a = 0; a < e.length; a += 1) e[a] && t.virtual.slides.push(e[a]);
        else t.virtual.slides.push(e);
        t.virtual.update(!0) }, prependSlide: function(e) { var t = this,
          a = t.activeIndex,
          i = a + 1,
          s = 1; if (Array.isArray(e)) { for (var r = 0; r < e.length; r += 1) e[r] && t.virtual.slides.unshift(e[r]);
          i = a + e.length, s = e.length } else t.virtual.slides.unshift(e); if (t.params.virtual.cache) { var n = t.virtual.cache,
            l = {};
          Object.keys(n).forEach((function(e) { var t = n[e],
              a = t.attr("data-swiper-slide-index");
            a && t.attr("data-swiper-slide-index", parseInt(a, 10) + 1), l[parseInt(e, 10) + s] = t })), t.virtual.cache = l }
        t.virtual.update(!0), t.slideTo(i, 0) }, removeSlide: function(e) { var t = this; if (null != e) { var a = t.activeIndex; if (Array.isArray(e))
            for (var i = e.length - 1; i >= 0; i -= 1) t.virtual.slides.splice(e[i], 1), t.params.virtual.cache && delete t.virtual.cache[e[i]], e[i] < a && (a -= 1), a = Math.max(a, 0);
          else t.virtual.slides.splice(e, 1), t.params.virtual.cache && delete t.virtual.cache[e], e < a && (a -= 1), a = Math.max(a, 0);
          t.virtual.update(!0), t.slideTo(a, 0) } }, removeAllSlides: function() { var e = this;
        e.virtual.slides = [], e.params.virtual.cache && (e.virtual.cache = {}), e.virtual.update(!0), e.slideTo(0, 0) } },
    q = { name: "virtual", params: { virtual: { enabled: !1, slides: [], cache: !0, renderSlide: null, renderExternal: null, renderExternalUpdate: !0, addSlidesBefore: 0, addSlidesAfter: 0 } }, create: function() { M(this, { virtual: t({}, F, { slides: this.params.virtual.slides, cache: {} }) }) }, on: { beforeInit: function(e) { if (e.params.virtual.enabled) { e.classNames.push(e.params.containerModifierClass + "virtual"); var t = { watchSlidesProgress: !0 };
            S(e.params, t), S(e.originalParams, t), e.params.initialSlide || e.virtual.update() } }, setTranslate: function(e) { e.params.virtual.enabled && e.virtual.update() } } },
    j = { handle: function(e) { var t = this,
          a = l(),
          i = r(),
          s = t.rtlTranslate,
          n = e;
        n.originalEvent && (n = n.originalEvent); var o = n.keyCode || n.charCode,
          d = t.params.keyboard.pageUpDown,
          p = d && 33 === o,
          u = d && 34 === o,
          c = 37 === o,
          h = 39 === o,
          v = 38 === o,
          f = 40 === o; if (!t.allowSlideNext && (t.isHorizontal() && h || t.isVertical() && f || u)) return !1; if (!t.allowSlidePrev && (t.isHorizontal() && c || t.isVertical() && v || p)) return !1; if (!(n.shiftKey || n.altKey || n.ctrlKey || n.metaKey || i.activeElement && i.activeElement.nodeName && ("input" === i.activeElement.nodeName.toLowerCase() || "textarea" === i.activeElement.nodeName.toLowerCase()))) { if (t.params.keyboard.onlyInViewport && (p || u || c || h || v || f)) { var m = !1; if (t.$el.parents("." + t.params.slideClass).length > 0 && 0 === t.$el.parents("." + t.params.slideActiveClass).length) return; var g = a.innerWidth,
              w = a.innerHeight,
              y = t.$el.offset();
            s && (y.left -= t.$el[0].scrollLeft); for (var b = [
                [y.left, y.top],
                [y.left + t.width, y.top],
                [y.left, y.top + t.height],
                [y.left + t.width, y.top + t.height]
              ], E = 0; E < b.length; E += 1) { var x = b[E]; if (x[0] >= 0 && x[0] <= g && x[1] >= 0 && x[1] <= w) { if (0 === x[0] && 0 === x[1]) continue;
                m = !0 } } if (!m) return }
          t.isHorizontal() ? ((p || u || c || h) && (n.preventDefault ? n.preventDefault() : n.returnValue = !1), ((u || h) && !s || (p || c) && s) && t.slideNext(), ((p || c) && !s || (u || h) && s) && t.slidePrev()) : ((p || u || v || f) && (n.preventDefault ? n.preventDefault() : n.returnValue = !1), (u || f) && t.slideNext(), (p || v) && t.slidePrev()), t.emit("keyPress", o) } }, enable: function() { var e = this,
          t = r();
        e.keyboard.enabled || (m(t).on("keydown", e.keyboard.handle), e.keyboard.enabled = !0) }, disable: function() { var e = this,
          t = r();
        e.keyboard.enabled && (m(t).off("keydown", e.keyboard.handle), e.keyboard.enabled = !1) } },
    _ = { name: "keyboard", params: { keyboard: { enabled: !1, onlyInViewport: !0, pageUpDown: !0 } }, create: function() { M(this, { keyboard: t({ enabled: !1 }, j) }) }, on: { init: function(e) { e.params.keyboard.enabled && e.keyboard.enable() }, destroy: function(e) { e.keyboard.enabled && e.keyboard.disable() } } }; var U = { lastScrollTime: x(), lastEventBeforeSnap: void 0, recentWheelEvents: [], event: function() { return l().navigator.userAgent.indexOf("firefox") > -1 ? "DOMMouseScroll" : function() { var e = r(),
            t = "onwheel",
            a = t in e; if (!a) { var i = e.createElement("div");
            i.setAttribute(t, "return;"), a = "function" == typeof i.onwheel } return !a && e.implementation && e.implementation.hasFeature && !0 !== e.implementation.hasFeature("", "") && (a = e.implementation.hasFeature("Events.wheel", "3.0")), a }() ? "wheel" : "mousewheel" }, normalize: function(e) { var t = 0,
          a = 0,
          i = 0,
          s = 0; return "detail" in e && (a = e.detail), "wheelDelta" in e && (a = -e.wheelDelta / 120), "wheelDeltaY" in e && (a = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (t = a, a = 0), i = 10 * t, s = 10 * a, "deltaY" in e && (s = e.deltaY), "deltaX" in e && (i = e.deltaX), e.shiftKey && !i && (i = s, s = 0), (i || s) && e.deltaMode && (1 === e.deltaMode ? (i *= 40, s *= 40) : (i *= 800, s *= 800)), i && !t && (t = i < 1 ? -1 : 1), s && !a && (a = s < 1 ? -1 : 1), { spinX: t, spinY: a, pixelX: i, pixelY: s } }, handleMouseEnter: function() { this.mouseEntered = !0 }, handleMouseLeave: function() { this.mouseEntered = !1 }, handle: function(e) { var t = e,
          a = this,
          i = a.params.mousewheel;
        a.params.cssMode && t.preventDefault(); var s = a.$el; if ("container" !== a.params.mousewheel.eventsTarget && (s = m(a.params.mousewheel.eventsTarget)), !a.mouseEntered && !s[0].contains(t.target) && !i.releaseOnEdges) return !0;
        t.originalEvent && (t = t.originalEvent); var r = 0,
          n = a.rtlTranslate ? -1 : 1,
          l = U.normalize(t); if (i.forceToAxis)
          if (a.isHorizontal()) { if (!(Math.abs(l.pixelX) > Math.abs(l.pixelY))) return !0;
            r = -l.pixelX * n } else { if (!(Math.abs(l.pixelY) > Math.abs(l.pixelX))) return !0;
            r = -l.pixelY }
        else r = Math.abs(l.pixelX) > Math.abs(l.pixelY) ? -l.pixelX * n : -l.pixelY; if (0 === r) return !0;
        i.invert && (r = -r); var o = a.getTranslate() + r * i.sensitivity; if (o >= a.minTranslate() && (o = a.minTranslate()), o <= a.maxTranslate() && (o = a.maxTranslate()), (!!a.params.loop || !(o === a.minTranslate() || o === a.maxTranslate())) && a.params.nested && t.stopPropagation(), a.params.freeMode) { var d = { time: x(), delta: Math.abs(r), direction: Math.sign(r) },
            p = a.mousewheel.lastEventBeforeSnap,
            u = p && d.time < p.time + 500 && d.delta <= p.delta && d.direction === p.direction; if (!u) { a.mousewheel.lastEventBeforeSnap = void 0, a.params.loop && a.loopFix(); var c = a.getTranslate() + r * i.sensitivity,
              h = a.isBeginning,
              v = a.isEnd; if (c >= a.minTranslate() && (c = a.minTranslate()), c <= a.maxTranslate() && (c = a.maxTranslate()), a.setTransition(0), a.setTranslate(c), a.updateProgress(), a.updateActiveIndex(), a.updateSlidesClasses(), (!h && a.isBeginning || !v && a.isEnd) && a.updateSlidesClasses(), a.params.freeModeSticky) { clearTimeout(a.mousewheel.timeout), a.mousewheel.timeout = void 0; var f = a.mousewheel.recentWheelEvents;
              f.length >= 15 && f.shift(); var g = f.length ? f[f.length - 1] : void 0,
                w = f[0]; if (f.push(d), g && (d.delta > g.delta || d.direction !== g.direction)) f.splice(0);
              else if (f.length >= 15 && d.time - w.time < 500 && w.delta - d.delta >= 1 && d.delta <= 6) { var y = r > 0 ? .8 : .2;
                a.mousewheel.lastEventBeforeSnap = d, f.splice(0), a.mousewheel.timeout = E((function() { a.slideToClosest(a.params.speed, !0, void 0, y) }), 0) }
              a.mousewheel.timeout || (a.mousewheel.timeout = E((function() { a.mousewheel.lastEventBeforeSnap = d, f.splice(0), a.slideToClosest(a.params.speed, !0, void 0, .5) }), 500)) } if (u || a.emit("scroll", t), a.params.autoplay && a.params.autoplayDisableOnInteraction && a.autoplay.stop(), c === a.minTranslate() || c === a.maxTranslate()) return !0 } } else { var b = { time: x(), delta: Math.abs(r), direction: Math.sign(r), raw: e },
            T = a.mousewheel.recentWheelEvents;
          T.length >= 2 && T.shift(); var C = T.length ? T[T.length - 1] : void 0; if (T.push(b), C ? (b.direction !== C.direction || b.delta > C.delta || b.time > C.time + 150) && a.mousewheel.animateSlider(b) : a.mousewheel.animateSlider(b), a.mousewheel.releaseScroll(b)) return !0 } return t.preventDefault ? t.preventDefault() : t.returnValue = !1, !1 }, animateSlider: function(e) { var t = this,
          a = l(); return !(this.params.mousewheel.thresholdDelta && e.delta < this.params.mousewheel.thresholdDelta) && (!(this.params.mousewheel.thresholdTime && x() - t.mousewheel.lastScrollTime < this.params.mousewheel.thresholdTime) && (e.delta >= 6 && x() - t.mousewheel.lastScrollTime < 60 || (e.direction < 0 ? t.isEnd && !t.params.loop || t.animating || (t.slideNext(), t.emit("scroll", e.raw)) : t.isBeginning && !t.params.loop || t.animating || (t.slidePrev(), t.emit("scroll", e.raw)), t.mousewheel.lastScrollTime = (new a.Date).getTime(), !1))) }, releaseScroll: function(e) { var t = this,
          a = t.params.mousewheel; if (e.direction < 0) { if (t.isEnd && !t.params.loop && a.releaseOnEdges) return !0 } else if (t.isBeginning && !t.params.loop && a.releaseOnEdges) return !0; return !1 }, enable: function() { var e = this,
          t = U.event(); if (e.params.cssMode) return e.wrapperEl.removeEventListener(t, e.mousewheel.handle), !0; if (!t) return !1; if (e.mousewheel.enabled) return !1; var a = e.$el; return "container" !== e.params.mousewheel.eventsTarget && (a = m(e.params.mousewheel.eventsTarget)), a.on("mouseenter", e.mousewheel.handleMouseEnter), a.on("mouseleave", e.mousewheel.handleMouseLeave), a.on(t, e.mousewheel.handle), e.mousewheel.enabled = !0, !0 }, disable: function() { var e = this,
          t = U.event(); if (e.params.cssMode) return e.wrapperEl.addEventListener(t, e.mousewheel.handle), !0; if (!t) return !1; if (!e.mousewheel.enabled) return !1; var a = e.$el; return "container" !== e.params.mousewheel.eventsTarget && (a = m(e.params.mousewheel.eventsTarget)), a.off(t, e.mousewheel.handle), e.mousewheel.enabled = !1, !0 } },
    K = { update: function() { var e = this,
          t = e.params.navigation; if (!e.params.loop) { var a = e.navigation,
            i = a.$nextEl,
            s = a.$prevEl;
          s && s.length > 0 && (e.isBeginning ? s.addClass(t.disabledClass) : s.removeClass(t.disabledClass), s[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](t.lockClass)), i && i.length > 0 && (e.isEnd ? i.addClass(t.disabledClass) : i.removeClass(t.disabledClass), i[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](t.lockClass)) } }, onPrevClick: function(e) { var t = this;
        e.preventDefault(), t.isBeginning && !t.params.loop || t.slidePrev() }, onNextClick: function(e) { var t = this;
        e.preventDefault(), t.isEnd && !t.params.loop || t.slideNext() }, init: function() { var e, t, a = this,
          i = a.params.navigation;
        (i.nextEl || i.prevEl) && (i.nextEl && (e = m(i.nextEl), a.params.uniqueNavElements && "string" == typeof i.nextEl && e.length > 1 && 1 === a.$el.find(i.nextEl).length && (e = a.$el.find(i.nextEl))), i.prevEl && (t = m(i.prevEl), a.params.uniqueNavElements && "string" == typeof i.prevEl && t.length > 1 && 1 === a.$el.find(i.prevEl).length && (t = a.$el.find(i.prevEl))), e && e.length > 0 && e.on("click", a.navigation.onNextClick), t && t.length > 0 && t.on("click", a.navigation.onPrevClick), S(a.navigation, { $nextEl: e, nextEl: e && e[0], $prevEl: t, prevEl: t && t[0] })) }, destroy: function() { var e = this,
          t = e.navigation,
          a = t.$nextEl,
          i = t.$prevEl;
        a && a.length && (a.off("click", e.navigation.onNextClick), a.removeClass(e.params.navigation.disabledClass)), i && i.length && (i.off("click", e.navigation.onPrevClick), i.removeClass(e.params.navigation.disabledClass)) } },
    Z = { update: function() { var e = this,
          t = e.rtl,
          a = e.params.pagination; if (a.el && e.pagination.el && e.pagination.$el && 0 !== e.pagination.$el.length) { var i, s = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length,
            r = e.pagination.$el,
            n = e.params.loop ? Math.ceil((s - 2 * e.loopedSlides) / e.params.slidesPerGroup) : e.snapGrid.length; if (e.params.loop ? ((i = Math.ceil((e.activeIndex - e.loopedSlides) / e.params.slidesPerGroup)) > s - 1 - 2 * e.loopedSlides && (i -= s - 2 * e.loopedSlides), i > n - 1 && (i -= n), i < 0 && "bullets" !== e.params.paginationType && (i = n + i)) : i = void 0 !== e.snapIndex ? e.snapIndex : e.activeIndex || 0, "bullets" === a.type && e.pagination.bullets && e.pagination.bullets.length > 0) { var l, o, d, p = e.pagination.bullets; if (a.dynamicBullets && (e.pagination.bulletSize = p.eq(0)[e.isHorizontal() ? "outerWidth" : "outerHeight"](!0), r.css(e.isHorizontal() ? "width" : "height", e.pagination.bulletSize * (a.dynamicMainBullets + 4) + "px"), a.dynamicMainBullets > 1 && void 0 !== e.previousIndex && (e.pagination.dynamicBulletIndex += i - e.previousIndex, e.pagination.dynamicBulletIndex > a.dynamicMainBullets - 1 ? e.pagination.dynamicBulletIndex = a.dynamicMainBullets - 1 : e.pagination.dynamicBulletIndex < 0 && (e.pagination.dynamicBulletIndex = 0)), l = i - e.pagination.dynamicBulletIndex, d = ((o = l + (Math.min(p.length, a.dynamicMainBullets) - 1)) + l) / 2), p.removeClass(a.bulletActiveClass + " " + a.bulletActiveClass + "-next " + a.bulletActiveClass + "-next-next " + a.bulletActiveClass + "-prev " + a.bulletActiveClass + "-prev-prev " + a.bulletActiveClass + "-main"), r.length > 1) p.each((function(e) { var t = m(e),
                s = t.index();
              s === i && t.addClass(a.bulletActiveClass), a.dynamicBullets && (s >= l && s <= o && t.addClass(a.bulletActiveClass + "-main"), s === l && t.prev().addClass(a.bulletActiveClass + "-prev").prev().addClass(a.bulletActiveClass + "-prev-prev"), s === o && t.next().addClass(a.bulletActiveClass + "-next").next().addClass(a.bulletActiveClass + "-next-next")) }));
            else { var u = p.eq(i),
                c = u.index(); if (u.addClass(a.bulletActiveClass), a.dynamicBullets) { for (var h = p.eq(l), v = p.eq(o), f = l; f <= o; f += 1) p.eq(f).addClass(a.bulletActiveClass + "-main"); if (e.params.loop)
                  if (c >= p.length - a.dynamicMainBullets) { for (var g = a.dynamicMainBullets; g >= 0; g -= 1) p.eq(p.length - g).addClass(a.bulletActiveClass + "-main");
                    p.eq(p.length - a.dynamicMainBullets - 1).addClass(a.bulletActiveClass + "-prev") } else h.prev().addClass(a.bulletActiveClass + "-prev").prev().addClass(a.bulletActiveClass + "-prev-prev"), v.next().addClass(a.bulletActiveClass + "-next").next().addClass(a.bulletActiveClass + "-next-next");
                else h.prev().addClass(a.bulletActiveClass + "-prev").prev().addClass(a.bulletActiveClass + "-prev-prev"), v.next().addClass(a.bulletActiveClass + "-next").next().addClass(a.bulletActiveClass + "-next-next") } } if (a.dynamicBullets) { var w = Math.min(p.length, a.dynamicMainBullets + 4),
                y = (e.pagination.bulletSize * w - e.pagination.bulletSize) / 2 - d * e.pagination.bulletSize,
                b = t ? "right" : "left";
              p.css(e.isHorizontal() ? b : "top", y + "px") } } if ("fraction" === a.type && (r.find("." + a.currentClass).text(a.formatFractionCurrent(i + 1)), r.find("." + a.totalClass).text(a.formatFractionTotal(n))), "progressbar" === a.type) { var E;
            E = a.progressbarOpposite ? e.isHorizontal() ? "vertical" : "horizontal" : e.isHorizontal() ? "horizontal" : "vertical"; var x = (i + 1) / n,
              T = 1,
              C = 1; "horizontal" === E ? T = x : C = x, r.find("." + a.progressbarFillClass).transform("translate3d(0,0,0) scaleX(" + T + ") scaleY(" + C + ")").transition(e.params.speed) } "custom" === a.type && a.renderCustom ? (r.html(a.renderCustom(e, i + 1, n)), e.emit("paginationRender", r[0])) : e.emit("paginationUpdate", r[0]), r[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](a.lockClass) } }, render: function() { var e = this,
          t = e.params.pagination; if (t.el && e.pagination.el && e.pagination.$el && 0 !== e.pagination.$el.length) { var a = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length,
            i = e.pagination.$el,
            s = ""; if ("bullets" === t.type) { var r = e.params.loop ? Math.ceil((a - 2 * e.loopedSlides) / e.params.slidesPerGroup) : e.snapGrid.length;
            e.params.freeMode && !e.params.loop && r > a && (r = a); for (var n = 0; n < r; n += 1) t.renderBullet ? s += t.renderBullet.call(e, n, t.bulletClass) : s += "<" + t.bulletElement + ' class="' + t.bulletClass + '"></' + t.bulletElement + ">";
            i.html(s), e.pagination.bullets = i.find("." + t.bulletClass.replace(/ /g, ".")) } "fraction" === t.type && (s = t.renderFraction ? t.renderFraction.call(e, t.currentClass, t.totalClass) : '<span class="' + t.currentClass + '"></span> / <span class="' + t.totalClass + '"></span>', i.html(s)), "progressbar" === t.type && (s = t.renderProgressbar ? t.renderProgressbar.call(e, t.progressbarFillClass) : '<span class="' + t.progressbarFillClass + '"></span>', i.html(s)), "custom" !== t.type && e.emit("paginationRender", e.pagination.$el[0]) } }, init: function() { var e = this,
          t = e.params.pagination; if (t.el) { var a = m(t.el);
          0 !== a.length && (e.params.uniqueNavElements && "string" == typeof t.el && a.length > 1 && (a = e.$el.find(t.el)), "bullets" === t.type && t.clickable && a.addClass(t.clickableClass), a.addClass(t.modifierClass + t.type), "bullets" === t.type && t.dynamicBullets && (a.addClass("" + t.modifierClass + t.type + "-dynamic"), e.pagination.dynamicBulletIndex = 0, t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)), "progressbar" === t.type && t.progressbarOpposite && a.addClass(t.progressbarOppositeClass), t.clickable && a.on("click", "." + t.bulletClass.replace(/ /g, "."), (function(t) { t.preventDefault(); var a = m(this).index() * e.params.slidesPerGroup;
            e.params.loop && (a += e.loopedSlides), e.slideTo(a) })), S(e.pagination, { $el: a, el: a[0] })) } }, destroy: function() { var e = this,
          t = e.params.pagination; if (t.el && e.pagination.el && e.pagination.$el && 0 !== e.pagination.$el.length) { var a = e.pagination.$el;
          a.removeClass(t.hiddenClass), a.removeClass(t.modifierClass + t.type), e.pagination.bullets && e.pagination.bullets.removeClass(t.bulletActiveClass), t.clickable && a.off("click", "." + t.bulletClass.replace(/ /g, ".")) } } },
    J = { setTranslate: function() { var e = this; if (e.params.scrollbar.el && e.scrollbar.el) { var t = e.scrollbar,
            a = e.rtlTranslate,
            i = e.progress,
            s = t.dragSize,
            r = t.trackSize,
            n = t.$dragEl,
            l = t.$el,
            o = e.params.scrollbar,
            d = s,
            p = (r - s) * i;
          a ? (p = -p) > 0 ? (d = s - p, p = 0) : -p + s > r && (d = r + p) : p < 0 ? (d = s + p, p = 0) : p + s > r && (d = r - p), e.isHorizontal() ? (n.transform("translate3d(" + p + "px, 0, 0)"), n[0].style.width = d + "px") : (n.transform("translate3d(0px, " + p + "px, 0)"), n[0].style.height = d + "px"), o.hide && (clearTimeout(e.scrollbar.timeout), l[0].style.opacity = 1, e.scrollbar.timeout = setTimeout((function() { l[0].style.opacity = 0, l.transition(400) }), 1e3)) } }, setTransition: function(e) { var t = this;
        t.params.scrollbar.el && t.scrollbar.el && t.scrollbar.$dragEl.transition(e) }, updateSize: function() { var e = this; if (e.params.scrollbar.el && e.scrollbar.el) { var t = e.scrollbar,
            a = t.$dragEl,
            i = t.$el;
          a[0].style.width = "", a[0].style.height = ""; var s, r = e.isHorizontal() ? i[0].offsetWidth : i[0].offsetHeight,
            n = e.size / e.virtualSize,
            l = n * (r / e.size);
          s = "auto" === e.params.scrollbar.dragSize ? r * n : parseInt(e.params.scrollbar.dragSize, 10), e.isHorizontal() ? a[0].style.width = s + "px" : a[0].style.height = s + "px", i[0].style.display = n >= 1 ? "none" : "", e.params.scrollbar.hide && (i[0].style.opacity = 0), S(t, { trackSize: r, divider: n, moveDivider: l, dragSize: s }), t.$el[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](e.params.scrollbar.lockClass) } }, getPointerPosition: function(e) { return this.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientX : e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientY : e.clientY }, setDragPosition: function(e) { var t, a = this,
          i = a.scrollbar,
          s = a.rtlTranslate,
          r = i.$el,
          n = i.dragSize,
          l = i.trackSize,
          o = i.dragStartPos;
        t = (i.getPointerPosition(e) - r.offset()[a.isHorizontal() ? "left" : "top"] - (null !== o ? o : n / 2)) / (l - n), t = Math.max(Math.min(t, 1), 0), s && (t = 1 - t); var d = a.minTranslate() + (a.maxTranslate() - a.minTranslate()) * t;
        a.updateProgress(d), a.setTranslate(d), a.updateActiveIndex(), a.updateSlidesClasses() }, onDragStart: function(e) { var t = this,
          a = t.params.scrollbar,
          i = t.scrollbar,
          s = t.$wrapperEl,
          r = i.$el,
          n = i.$dragEl;
        t.scrollbar.isTouched = !0, t.scrollbar.dragStartPos = e.target === n[0] || e.target === n ? i.getPointerPosition(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? "left" : "top"] : null, e.preventDefault(), e.stopPropagation(), s.transition(100), n.transition(100), i.setDragPosition(e), clearTimeout(t.scrollbar.dragTimeout), r.transition(0), a.hide && r.css("opacity", 1), t.params.cssMode && t.$wrapperEl.css("scroll-snap-type", "none"), t.emit("scrollbarDragStart", e) }, onDragMove: function(e) { var t = this,
          a = t.scrollbar,
          i = t.$wrapperEl,
          s = a.$el,
          r = a.$dragEl;
        t.scrollbar.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, a.setDragPosition(e), i.transition(0), s.transition(0), r.transition(0), t.emit("scrollbarDragMove", e)) }, onDragEnd: function(e) { var t = this,
          a = t.params.scrollbar,
          i = t.scrollbar,
          s = t.$wrapperEl,
          r = i.$el;
        t.scrollbar.isTouched && (t.scrollbar.isTouched = !1, t.params.cssMode && (t.$wrapperEl.css("scroll-snap-type", ""), s.transition("")), a.hide && (clearTimeout(t.scrollbar.dragTimeout), t.scrollbar.dragTimeout = E((function() { r.css("opacity", 0), r.transition(400) }), 1e3)), t.emit("scrollbarDragEnd", e), a.snapOnRelease && t.slideToClosest()) }, enableDraggable: function() { var e = this; if (e.params.scrollbar.el) { var t = r(),
            a = e.scrollbar,
            i = e.touchEventsTouch,
            s = e.touchEventsDesktop,
            n = e.params,
            l = e.support,
            o = a.$el[0],
            d = !(!l.passiveListener || !n.passiveListeners) && { passive: !1, capture: !1 },
            p = !(!l.passiveListener || !n.passiveListeners) && { passive: !0, capture: !1 };
          o && (l.touch ? (o.addEventListener(i.start, e.scrollbar.onDragStart, d), o.addEventListener(i.move, e.scrollbar.onDragMove, d), o.addEventListener(i.end, e.scrollbar.onDragEnd, p)) : (o.addEventListener(s.start, e.scrollbar.onDragStart, d), t.addEventListener(s.move, e.scrollbar.onDragMove, d), t.addEventListener(s.end, e.scrollbar.onDragEnd, p))) } }, disableDraggable: function() { var e = this; if (e.params.scrollbar.el) { var t = r(),
            a = e.scrollbar,
            i = e.touchEventsTouch,
            s = e.touchEventsDesktop,
            n = e.params,
            l = e.support,
            o = a.$el[0],
            d = !(!l.passiveListener || !n.passiveListeners) && { passive: !1, capture: !1 },
            p = !(!l.passiveListener || !n.passiveListeners) && { passive: !0, capture: !1 };
          o && (l.touch ? (o.removeEventListener(i.start, e.scrollbar.onDragStart, d), o.removeEventListener(i.move, e.scrollbar.onDragMove, d), o.removeEventListener(i.end, e.scrollbar.onDragEnd, p)) : (o.removeEventListener(s.start, e.scrollbar.onDragStart, d), t.removeEventListener(s.move, e.scrollbar.onDragMove, d), t.removeEventListener(s.end, e.scrollbar.onDragEnd, p))) } }, init: function() { var e = this; if (e.params.scrollbar.el) { var t = e.scrollbar,
            a = e.$el,
            i = e.params.scrollbar,
            s = m(i.el);
          e.params.uniqueNavElements && "string" == typeof i.el && s.length > 1 && 1 === a.find(i.el).length && (s = a.find(i.el)); var r = s.find("." + e.params.scrollbar.dragClass);
          0 === r.length && (r = m('<div class="' + e.params.scrollbar.dragClass + '"></div>'), s.append(r)), S(t, { $el: s, el: s[0], $dragEl: r, dragEl: r[0] }), i.draggable && t.enableDraggable() } }, destroy: function() { this.scrollbar.disableDraggable() } },
    Q = { setTransform: function(e, t) { var a = this.rtl,
          i = m(e),
          s = a ? -1 : 1,
          r = i.attr("data-swiper-parallax") || "0",
          n = i.attr("data-swiper-parallax-x"),
          l = i.attr("data-swiper-parallax-y"),
          o = i.attr("data-swiper-parallax-scale"),
          d = i.attr("data-swiper-parallax-opacity"); if (n || l ? (n = n || "0", l = l || "0") : this.isHorizontal() ? (n = r, l = "0") : (l = r, n = "0"), n = n.indexOf("%") >= 0 ? parseInt(n, 10) * t * s + "%" : n * t * s + "px", l = l.indexOf("%") >= 0 ? parseInt(l, 10) * t + "%" : l * t + "px", null != d) { var p = d - (d - 1) * (1 - Math.abs(t));
          i[0].style.opacity = p } if (null == o) i.transform("translate3d(" + n + ", " + l + ", 0px)");
        else { var u = o - (o - 1) * (1 - Math.abs(t));
          i.transform("translate3d(" + n + ", " + l + ", 0px) scale(" + u + ")") } }, setTranslate: function() { var e = this,
          t = e.$el,
          a = e.slides,
          i = e.progress,
          s = e.snapGrid;
        t.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t) { e.parallax.setTransform(t, i) })), a.each((function(t, a) { var r = t.progress;
          e.params.slidesPerGroup > 1 && "auto" !== e.params.slidesPerView && (r += Math.ceil(a / 2) - i * (s.length - 1)), r = Math.min(Math.max(r, -1), 1), m(t).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t) { e.parallax.setTransform(t, r) })) })) }, setTransition: function(e) { void 0 === e && (e = this.params.speed);
        this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t) { var a = m(t),
            i = parseInt(a.attr("data-swiper-parallax-duration"), 10) || e;
          0 === e && (i = 0), a.transition(i) })) } },
    ee = { getDistanceBetweenTouches: function(e) { if (e.targetTouches.length < 2) return 1; var t = e.targetTouches[0].pageX,
          a = e.targetTouches[0].pageY,
          i = e.targetTouches[1].pageX,
          s = e.targetTouches[1].pageY; return Math.sqrt(Math.pow(i - t, 2) + Math.pow(s - a, 2)) }, onGestureStart: function(e) { var t = this,
          a = t.support,
          i = t.params.zoom,
          s = t.zoom,
          r = s.gesture; if (s.fakeGestureTouched = !1, s.fakeGestureMoved = !1, !a.gestures) { if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2) return;
          s.fakeGestureTouched = !0, r.scaleStart = ee.getDistanceBetweenTouches(e) }
        r.$slideEl && r.$slideEl.length || (r.$slideEl = m(e.target).closest("." + t.params.slideClass), 0 === r.$slideEl.length && (r.$slideEl = t.slides.eq(t.activeIndex)), r.$imageEl = r.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"), r.$imageWrapEl = r.$imageEl.parent("." + i.containerClass), r.maxRatio = r.$imageWrapEl.attr("data-swiper-zoom") || i.maxRatio, 0 !== r.$imageWrapEl.length) ? (r.$imageEl && r.$imageEl.transition(0), t.zoom.isScaling = !0) : r.$imageEl = void 0 }, onGestureChange: function(e) { var t = this,
          a = t.support,
          i = t.params.zoom,
          s = t.zoom,
          r = s.gesture; if (!a.gestures) { if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2) return;
          s.fakeGestureMoved = !0, r.scaleMove = ee.getDistanceBetweenTouches(e) }
        r.$imageEl && 0 !== r.$imageEl.length ? (a.gestures ? s.scale = e.scale * s.currentScale : s.scale = r.scaleMove / r.scaleStart * s.currentScale, s.scale > r.maxRatio && (s.scale = r.maxRatio - 1 + Math.pow(s.scale - r.maxRatio + 1, .5)), s.scale < i.minRatio && (s.scale = i.minRatio + 1 - Math.pow(i.minRatio - s.scale + 1, .5)), r.$imageEl.transform("translate3d(0,0,0) scale(" + s.scale + ")")) : "gesturechange" === e.type && s.onGestureStart(e) }, onGestureEnd: function(e) { var t = this,
          a = t.device,
          i = t.support,
          s = t.params.zoom,
          r = t.zoom,
          n = r.gesture; if (!i.gestures) { if (!r.fakeGestureTouched || !r.fakeGestureMoved) return; if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !a.android) return;
          r.fakeGestureTouched = !1, r.fakeGestureMoved = !1 }
        n.$imageEl && 0 !== n.$imageEl.length && (r.scale = Math.max(Math.min(r.scale, n.maxRatio), s.minRatio), n.$imageEl.transition(t.params.speed).transform("translate3d(0,0,0) scale(" + r.scale + ")"), r.currentScale = r.scale, r.isScaling = !1, 1 === r.scale && (n.$slideEl = void 0)) }, onTouchStart: function(e) { var t = this.device,
          a = this.zoom,
          i = a.gesture,
          s = a.image;
        i.$imageEl && 0 !== i.$imageEl.length && (s.isTouched || (t.android && e.cancelable && e.preventDefault(), s.isTouched = !0, s.touchesStart.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, s.touchesStart.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY)) }, onTouchMove: function(e) { var t = this,
          a = t.zoom,
          i = a.gesture,
          s = a.image,
          r = a.velocity; if (i.$imageEl && 0 !== i.$imageEl.length && (t.allowClick = !1, s.isTouched && i.$slideEl)) { s.isMoved || (s.width = i.$imageEl[0].offsetWidth, s.height = i.$imageEl[0].offsetHeight, s.startX = T(i.$imageWrapEl[0], "x") || 0, s.startY = T(i.$imageWrapEl[0], "y") || 0, i.slideWidth = i.$slideEl[0].offsetWidth, i.slideHeight = i.$slideEl[0].offsetHeight, i.$imageWrapEl.transition(0), t.rtl && (s.startX = -s.startX, s.startY = -s.startY)); var n = s.width * a.scale,
            l = s.height * a.scale; if (!(n < i.slideWidth && l < i.slideHeight)) { if (s.minX = Math.min(i.slideWidth / 2 - n / 2, 0), s.maxX = -s.minX, s.minY = Math.min(i.slideHeight / 2 - l / 2, 0), s.maxY = -s.minY, s.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, s.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, !s.isMoved && !a.isScaling) { if (t.isHorizontal() && (Math.floor(s.minX) === Math.floor(s.startX) && s.touchesCurrent.x < s.touchesStart.x || Math.floor(s.maxX) === Math.floor(s.startX) && s.touchesCurrent.x > s.touchesStart.x)) return void(s.isTouched = !1); if (!t.isHorizontal() && (Math.floor(s.minY) === Math.floor(s.startY) && s.touchesCurrent.y < s.touchesStart.y || Math.floor(s.maxY) === Math.floor(s.startY) && s.touchesCurrent.y > s.touchesStart.y)) return void(s.isTouched = !1) }
            e.cancelable && e.preventDefault(), e.stopPropagation(), s.isMoved = !0, s.currentX = s.touchesCurrent.x - s.touchesStart.x + s.startX, s.currentY = s.touchesCurrent.y - s.touchesStart.y + s.startY, s.currentX < s.minX && (s.currentX = s.minX + 1 - Math.pow(s.minX - s.currentX + 1, .8)), s.currentX > s.maxX && (s.currentX = s.maxX - 1 + Math.pow(s.currentX - s.maxX + 1, .8)), s.currentY < s.minY && (s.currentY = s.minY + 1 - Math.pow(s.minY - s.currentY + 1, .8)), s.currentY > s.maxY && (s.currentY = s.maxY - 1 + Math.pow(s.currentY - s.maxY + 1, .8)), r.prevPositionX || (r.prevPositionX = s.touchesCurrent.x), r.prevPositionY || (r.prevPositionY = s.touchesCurrent.y), r.prevTime || (r.prevTime = Date.now()), r.x = (s.touchesCurrent.x - r.prevPositionX) / (Date.now() - r.prevTime) / 2, r.y = (s.touchesCurrent.y - r.prevPositionY) / (Date.now() - r.prevTime) / 2, Math.abs(s.touchesCurrent.x - r.prevPositionX) < 2 && (r.x = 0), Math.abs(s.touchesCurrent.y - r.prevPositionY) < 2 && (r.y = 0), r.prevPositionX = s.touchesCurrent.x, r.prevPositionY = s.touchesCurrent.y, r.prevTime = Date.now(), i.$imageWrapEl.transform("translate3d(" + s.currentX + "px, " + s.currentY + "px,0)") } } }, onTouchEnd: function() { var e = this.zoom,
          t = e.gesture,
          a = e.image,
          i = e.velocity; if (t.$imageEl && 0 !== t.$imageEl.length) { if (!a.isTouched || !a.isMoved) return a.isTouched = !1, void(a.isMoved = !1);
          a.isTouched = !1, a.isMoved = !1; var s = 300,
            r = 300,
            n = i.x * s,
            l = a.currentX + n,
            o = i.y * r,
            d = a.currentY + o;
          0 !== i.x && (s = Math.abs((l - a.currentX) / i.x)), 0 !== i.y && (r = Math.abs((d - a.currentY) / i.y)); var p = Math.max(s, r);
          a.currentX = l, a.currentY = d; var u = a.width * e.scale,
            c = a.height * e.scale;
          a.minX = Math.min(t.slideWidth / 2 - u / 2, 0), a.maxX = -a.minX, a.minY = Math.min(t.slideHeight / 2 - c / 2, 0), a.maxY = -a.minY, a.currentX = Math.max(Math.min(a.currentX, a.maxX), a.minX), a.currentY = Math.max(Math.min(a.currentY, a.maxY), a.minY), t.$imageWrapEl.transition(p).transform("translate3d(" + a.currentX + "px, " + a.currentY + "px,0)") } }, onTransitionEnd: function() { var e = this,
          t = e.zoom,
          a = t.gesture;
        a.$slideEl && e.previousIndex !== e.activeIndex && (a.$imageEl && a.$imageEl.transform("translate3d(0,0,0) scale(1)"), a.$imageWrapEl && a.$imageWrapEl.transform("translate3d(0,0,0)"), t.scale = 1, t.currentScale = 1, a.$slideEl = void 0, a.$imageEl = void 0, a.$imageWrapEl = void 0) }, toggle: function(e) { var t = this.zoom;
        t.scale && 1 !== t.scale ? t.out() : t.in(e) }, in: function(e) { var t, a, i, s, r, n, o, d, p, u, c, h, v, f, m, g, w = this,
          y = l(),
          b = w.zoom,
          E = w.params.zoom,
          x = b.gesture,
          T = b.image;
        (x.$slideEl || (w.params.virtual && w.params.virtual.enabled && w.virtual ? x.$slideEl = w.$wrapperEl.children("." + w.params.slideActiveClass) : x.$slideEl = w.slides.eq(w.activeIndex), x.$imageEl = x.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"), x.$imageWrapEl = x.$imageEl.parent("." + E.containerClass)), x.$imageEl && 0 !== x.$imageEl.length) && (x.$slideEl.addClass("" + E.zoomedSlideClass), void 0 === T.touchesStart.x && e ? (t = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX, a = "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY) : (t = T.touchesStart.x, a = T.touchesStart.y), b.scale = x.$imageWrapEl.attr("data-swiper-zoom") || E.maxRatio, b.currentScale = x.$imageWrapEl.attr("data-swiper-zoom") || E.maxRatio, e ? (m = x.$slideEl[0].offsetWidth, g = x.$slideEl[0].offsetHeight, i = x.$slideEl.offset().left + y.scrollX + m / 2 - t, s = x.$slideEl.offset().top + y.scrollY + g / 2 - a, o = x.$imageEl[0].offsetWidth, d = x.$imageEl[0].offsetHeight, p = o * b.scale, u = d * b.scale, v = -(c = Math.min(m / 2 - p / 2, 0)), f = -(h = Math.min(g / 2 - u / 2, 0)), (r = i * b.scale) < c && (r = c), r > v && (r = v), (n = s * b.scale) < h && (n = h), n > f && (n = f)) : (r = 0, n = 0), x.$imageWrapEl.transition(300).transform("translate3d(" + r + "px, " + n + "px,0)"), x.$imageEl.transition(300).transform("translate3d(0,0,0) scale(" + b.scale + ")")) }, out: function() { var e = this,
          t = e.zoom,
          a = e.params.zoom,
          i = t.gesture;
        i.$slideEl || (e.params.virtual && e.params.virtual.enabled && e.virtual ? i.$slideEl = e.$wrapperEl.children("." + e.params.slideActiveClass) : i.$slideEl = e.slides.eq(e.activeIndex), i.$imageEl = i.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"), i.$imageWrapEl = i.$imageEl.parent("." + a.containerClass)), i.$imageEl && 0 !== i.$imageEl.length && (t.scale = 1, t.currentScale = 1, i.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"), i.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"), i.$slideEl.removeClass("" + a.zoomedSlideClass), i.$slideEl = void 0) }, toggleGestures: function(e) { var t = this,
          a = t.zoom,
          i = a.slideSelector,
          s = a.passiveListener;
        t.$wrapperEl[e]("gesturestart", i, a.onGestureStart, s), t.$wrapperEl[e]("gesturechange", i, a.onGestureChange, s), t.$wrapperEl[e]("gestureend", i, a.onGestureEnd, s) }, enableGestures: function() { this.zoom.gesturesEnabled || (this.zoom.gesturesEnabled = !0, this.zoom.toggleGestures("on")) }, disableGestures: function() { this.zoom.gesturesEnabled && (this.zoom.gesturesEnabled = !1, this.zoom.toggleGestures("off")) }, enable: function() { var e = this,
          t = e.support,
          a = e.zoom; if (!a.enabled) { a.enabled = !0; var i = !("touchstart" !== e.touchEvents.start || !t.passiveListener || !e.params.passiveListeners) && { passive: !0, capture: !1 },
            s = !t.passiveListener || { passive: !1, capture: !0 },
            r = "." + e.params.slideClass;
          e.zoom.passiveListener = i, e.zoom.slideSelector = r, t.gestures ? (e.$wrapperEl.on(e.touchEvents.start, e.zoom.enableGestures, i), e.$wrapperEl.on(e.touchEvents.end, e.zoom.disableGestures, i)) : "touchstart" === e.touchEvents.start && (e.$wrapperEl.on(e.touchEvents.start, r, a.onGestureStart, i), e.$wrapperEl.on(e.touchEvents.move, r, a.onGestureChange, s), e.$wrapperEl.on(e.touchEvents.end, r, a.onGestureEnd, i), e.touchEvents.cancel && e.$wrapperEl.on(e.touchEvents.cancel, r, a.onGestureEnd, i)), e.$wrapperEl.on(e.touchEvents.move, "." + e.params.zoom.containerClass, a.onTouchMove, s) } }, disable: function() { var e = this,
          t = e.zoom; if (t.enabled) { var a = e.support;
          e.zoom.enabled = !1; var i = !("touchstart" !== e.touchEvents.start || !a.passiveListener || !e.params.passiveListeners) && { passive: !0, capture: !1 },
            s = !a.passiveListener || { passive: !1, capture: !0 },
            r = "." + e.params.slideClass;
          a.gestures ? (e.$wrapperEl.off(e.touchEvents.start, e.zoom.enableGestures, i), e.$wrapperEl.off(e.touchEvents.end, e.zoom.disableGestures, i)) : "touchstart" === e.touchEvents.start && (e.$wrapperEl.off(e.touchEvents.start, r, t.onGestureStart, i), e.$wrapperEl.off(e.touchEvents.move, r, t.onGestureChange, s), e.$wrapperEl.off(e.touchEvents.end, r, t.onGestureEnd, i), e.touchEvents.cancel && e.$wrapperEl.off(e.touchEvents.cancel, r, t.onGestureEnd, i)), e.$wrapperEl.off(e.touchEvents.move, "." + e.params.zoom.containerClass, t.onTouchMove, s) } } },
    te = { loadInSlide: function(e, t) { void 0 === t && (t = !0); var a = this,
          i = a.params.lazy; if (void 0 !== e && 0 !== a.slides.length) { var s = a.virtual && a.params.virtual.enabled ? a.$wrapperEl.children("." + a.params.slideClass + '[data-swiper-slide-index="' + e + '"]') : a.slides.eq(e),
            r = s.find("." + i.elementClass + ":not(." + i.loadedClass + "):not(." + i.loadingClass + ")");!s.hasClass(i.elementClass) || s.hasClass(i.loadedClass) || s.hasClass(i.loadingClass) || r.push(s[0]), 0 !== r.length && r.each((function(e) { var r = m(e);
            r.addClass(i.loadingClass); var n = r.attr("data-background"),
              l = r.attr("data-src"),
              o = r.attr("data-srcset"),
              d = r.attr("data-sizes"),
              p = r.parent("picture");
            a.loadImage(r[0], l || n, o, d, !1, (function() { if (null != a && a && (!a || a.params) && !a.destroyed) { if (n ? (r.css("background-image", 'url("' + n + '")'), r.removeAttr("data-background")) : (o && (r.attr("srcset", o), r.removeAttr("data-srcset")), d && (r.attr("sizes", d), r.removeAttr("data-sizes")), p.length && p.children("source").each((function(e) { var t = m(e);
                    t.attr("data-srcset") && (t.attr("srcset", t.attr("data-srcset")), t.removeAttr("data-srcset")) })), l && (r.attr("src", l), r.removeAttr("data-src"))), r.addClass(i.loadedClass).removeClass(i.loadingClass), s.find("." + i.preloaderClass).remove(), a.params.loop && t) { var e = s.attr("data-swiper-slide-index"); if (s.hasClass(a.params.slideDuplicateClass)) { var u = a.$wrapperEl.children('[data-swiper-slide-index="' + e + '"]:not(.' + a.params.slideDuplicateClass + ")");
                    a.lazy.loadInSlide(u.index(), !1) } else { var c = a.$wrapperEl.children("." + a.params.slideDuplicateClass + '[data-swiper-slide-index="' + e + '"]');
                    a.lazy.loadInSlide(c.index(), !1) } }
                a.emit("lazyImageReady", s[0], r[0]), a.params.autoHeight && a.updateAutoHeight() } })), a.emit("lazyImageLoad", s[0], r[0]) })) } }, load: function() { var e = this,
          t = e.$wrapperEl,
          a = e.params,
          i = e.slides,
          s = e.activeIndex,
          r = e.virtual && a.virtual.enabled,
          n = a.lazy,
          l = a.slidesPerView;

        function o(e) { if (r) { if (t.children("." + a.slideClass + '[data-swiper-slide-index="' + e + '"]').length) return !0 } else if (i[e]) return !0; return !1 }

        function d(e) { return r ? m(e).attr("data-swiper-slide-index") : m(e).index() } if ("auto" === l && (l = 0), e.lazy.initialImageLoaded || (e.lazy.initialImageLoaded = !0), e.params.watchSlidesVisibility) t.children("." + a.slideVisibleClass).each((function(t) { var a = r ? m(t).attr("data-swiper-slide-index") : m(t).index();
          e.lazy.loadInSlide(a) }));
        else if (l > 1)
          for (var p = s; p < s + l; p += 1) o(p) && e.lazy.loadInSlide(p);
        else e.lazy.loadInSlide(s); if (n.loadPrevNext)
          if (l > 1 || n.loadPrevNextAmount && n.loadPrevNextAmount > 1) { for (var u = n.loadPrevNextAmount, c = l, h = Math.min(s + c + Math.max(u, c), i.length), v = Math.max(s - Math.max(c, u), 0), f = s + l; f < h; f += 1) o(f) && e.lazy.loadInSlide(f); for (var g = v; g < s; g += 1) o(g) && e.lazy.loadInSlide(g) } else { var w = t.children("." + a.slideNextClass);
            w.length > 0 && e.lazy.loadInSlide(d(w)); var y = t.children("." + a.slidePrevClass);
            y.length > 0 && e.lazy.loadInSlide(d(y)) } }, checkInViewOnLoad: function() { var e = l(),
          t = this; if (t && !t.destroyed) { var a = t.params.lazy.scrollingElement ? m(t.params.lazy.scrollingElement) : m(e),
            i = a[0] === e,
            s = i ? e.innerWidth : a[0].offsetWidth,
            r = i ? e.innerHeight : a[0].offsetHeight,
            n = t.$el.offset(),
            o = !1;
          t.rtlTranslate && (n.left -= t.$el[0].scrollLeft); for (var d = [
              [n.left, n.top],
              [n.left + t.width, n.top],
              [n.left, n.top + t.height],
              [n.left + t.width, n.top + t.height]
            ], p = 0; p < d.length; p += 1) { var u = d[p]; if (u[0] >= 0 && u[0] <= s && u[1] >= 0 && u[1] <= r) { if (0 === u[0] && 0 === u[1]) continue;
              o = !0 } }
          o ? (t.lazy.load(), a.off("scroll", t.lazy.checkInViewOnLoad)) : t.lazy.scrollHandlerAttached || (t.lazy.scrollHandlerAttached = !0, a.on("scroll", t.lazy.checkInViewOnLoad)) } } },
    ae = { LinearSpline: function(e, t) { var a, i, s, r, n, l = function(e, t) { for (i = -1, a = e.length; a - i > 1;) e[s = a + i >> 1] <= t ? i = s : a = s; return a }; return this.x = e, this.y = t, this.lastIndex = e.length - 1, this.interpolate = function(e) { return e ? (n = l(this.x, e), r = n - 1, (e - this.x[r]) * (this.y[n] - this.y[r]) / (this.x[n] - this.x[r]) + this.y[r]) : 0 }, this }, getInterpolateFunction: function(e) { var t = this;
        t.controller.spline || (t.controller.spline = t.params.loop ? new ae.LinearSpline(t.slidesGrid, e.slidesGrid) : new ae.LinearSpline(t.snapGrid, e.snapGrid)) }, setTranslate: function(e, t) { var a, i, s = this,
          r = s.controller.control,
          n = s.constructor;

        function l(e) { var t = s.rtlTranslate ? -s.translate : s.translate; "slide" === s.params.controller.by && (s.controller.getInterpolateFunction(e), i = -s.controller.spline.interpolate(-t)), i && "container" !== s.params.controller.by || (a = (e.maxTranslate() - e.minTranslate()) / (s.maxTranslate() - s.minTranslate()), i = (t - s.minTranslate()) * a + e.minTranslate()), s.params.controller.inverse && (i = e.maxTranslate() - i), e.updateProgress(i), e.setTranslate(i, s), e.updateActiveIndex(), e.updateSlidesClasses() } if (Array.isArray(r))
          for (var o = 0; o < r.length; o += 1) r[o] !== t && r[o] instanceof n && l(r[o]);
        else r instanceof n && t !== r && l(r) }, setTransition: function(e, t) { var a, i = this,
          s = i.constructor,
          r = i.controller.control;

        function n(t) { t.setTransition(e, i), 0 !== e && (t.transitionStart(), t.params.autoHeight && E((function() { t.updateAutoHeight() })), t.$wrapperEl.transitionEnd((function() { r && (t.params.loop && "slide" === i.params.controller.by && t.loopFix(), t.transitionEnd()) }))) } if (Array.isArray(r))
          for (a = 0; a < r.length; a += 1) r[a] !== t && r[a] instanceof s && n(r[a]);
        else r instanceof s && t !== r && n(r) } },
    ie = { getRandomNumber: function(e) { void 0 === e && (e = 16); return "x".repeat(e).replace(/x/g, (function() { return Math.round(16 * Math.random()).toString(16) })) }, makeElFocusable: function(e) { return e.attr("tabIndex", "0"), e }, makeElNotFocusable: function(e) { return e.attr("tabIndex", "-1"), e }, addElRole: function(e, t) { return e.attr("role", t), e }, addElRoleDescription: function(e, t) { return e.attr("aria-role-description", t), e }, addElControls: function(e, t) { return e.attr("aria-controls", t), e }, addElLabel: function(e, t) { return e.attr("aria-label", t), e }, addElId: function(e, t) { return e.attr("id", t), e }, addElLive: function(e, t) { return e.attr("aria-live", t), e }, disableEl: function(e) { return e.attr("aria-disabled", !0), e }, enableEl: function(e) { return e.attr("aria-disabled", !1), e }, onEnterKey: function(e) { var t = this,
          a = t.params.a11y; if (13 === e.keyCode) { var i = m(e.target);
          t.navigation && t.navigation.$nextEl && i.is(t.navigation.$nextEl) && (t.isEnd && !t.params.loop || t.slideNext(), t.isEnd ? t.a11y.notify(a.lastSlideMessage) : t.a11y.notify(a.nextSlideMessage)), t.navigation && t.navigation.$prevEl && i.is(t.navigation.$prevEl) && (t.isBeginning && !t.params.loop || t.slidePrev(), t.isBeginning ? t.a11y.notify(a.firstSlideMessage) : t.a11y.notify(a.prevSlideMessage)), t.pagination && i.is("." + t.params.pagination.bulletClass.replace(/ /g, ".")) && i[0].click() } }, notify: function(e) { var t = this.a11y.liveRegion;
        0 !== t.length && (t.html(""), t.html(e)) }, updateNavigation: function() { var e = this; if (!e.params.loop && e.navigation) { var t = e.navigation,
            a = t.$nextEl,
            i = t.$prevEl;
          i && i.length > 0 && (e.isBeginning ? (e.a11y.disableEl(i), e.a11y.makeElNotFocusable(i)) : (e.a11y.enableEl(i), e.a11y.makeElFocusable(i))), a && a.length > 0 && (e.isEnd ? (e.a11y.disableEl(a), e.a11y.makeElNotFocusable(a)) : (e.a11y.enableEl(a), e.a11y.makeElFocusable(a))) } }, updatePagination: function() { var e = this,
          t = e.params.a11y;
        e.pagination && e.params.pagination.clickable && e.pagination.bullets && e.pagination.bullets.length && e.pagination.bullets.each((function(a) { var i = m(a);
          e.a11y.makeElFocusable(i), e.params.pagination.renderBullet || (e.a11y.addElRole(i, "button"), e.a11y.addElLabel(i, t.paginationBulletMessage.replace(/\{\{index\}\}/, i.index() + 1))) })) }, init: function() { var e = this,
          t = e.params.a11y;
        e.$el.append(e.a11y.liveRegion); var a = e.$el;
        t.containerRoleDescriptionMessage && e.a11y.addElRoleDescription(a, t.containerRoleDescriptionMessage), t.containerMessage && e.a11y.addElLabel(a, t.containerMessage); var i, s, r, n = e.$wrapperEl,
          l = n.attr("id") || "swiper-wrapper-" + e.a11y.getRandomNumber(16);
        e.a11y.addElId(n, l), i = e.params.autoplay && e.params.autoplay.enabled ? "off" : "polite", e.a11y.addElLive(n, i), t.itemRoleDescriptionMessage && e.a11y.addElRoleDescription(m(e.slides), t.itemRoleDescriptionMessage), e.a11y.addElRole(m(e.slides), "group"), e.slides.each((function(t) { var a = m(t);
          e.a11y.addElLabel(a, a.index() + 1 + " / " + e.slides.length) })), e.navigation && e.navigation.$nextEl && (s = e.navigation.$nextEl), e.navigation && e.navigation.$prevEl && (r = e.navigation.$prevEl), s && s.length && (e.a11y.makeElFocusable(s), "BUTTON" !== s[0].tagName && (e.a11y.addElRole(s, "button"), s.on("keydown", e.a11y.onEnterKey)), e.a11y.addElLabel(s, t.nextSlideMessage), e.a11y.addElControls(s, l)), r && r.length && (e.a11y.makeElFocusable(r), "BUTTON" !== r[0].tagName && (e.a11y.addElRole(r, "button"), r.on("keydown", e.a11y.onEnterKey)), e.a11y.addElLabel(r, t.prevSlideMessage), e.a11y.addElControls(r, l)), e.pagination && e.params.pagination.clickable && e.pagination.bullets && e.pagination.bullets.length && e.pagination.$el.on("keydown", "." + e.params.pagination.bulletClass.replace(/ /g, "."), e.a11y.onEnterKey) }, destroy: function() { var e, t, a = this;
        a.a11y.liveRegion && a.a11y.liveRegion.length > 0 && a.a11y.liveRegion.remove(), a.navigation && a.navigation.$nextEl && (e = a.navigation.$nextEl), a.navigation && a.navigation.$prevEl && (t = a.navigation.$prevEl), e && e.off("keydown", a.a11y.onEnterKey), t && t.off("keydown", a.a11y.onEnterKey), a.pagination && a.params.pagination.clickable && a.pagination.bullets && a.pagination.bullets.length && a.pagination.$el.off("keydown", "." + a.params.pagination.bulletClass.replace(/ /g, "."), a.a11y.onEnterKey) } },
    se = { init: function() { var e = this,
          t = l(); if (e.params.history) { if (!t.history || !t.history.pushState) return e.params.history.enabled = !1, void(e.params.hashNavigation.enabled = !0); var a = e.history;
          a.initialized = !0, a.paths = se.getPathValues(e.params.url), (a.paths.key || a.paths.value) && (a.scrollToSlide(0, a.paths.value, e.params.runCallbacksOnInit), e.params.history.replaceState || t.addEventListener("popstate", e.history.setHistoryPopState)) } }, destroy: function() { var e = l();
        this.params.history.replaceState || e.removeEventListener("popstate", this.history.setHistoryPopState) }, setHistoryPopState: function() { var e = this;
        e.history.paths = se.getPathValues(e.params.url), e.history.scrollToSlide(e.params.speed, e.history.paths.value, !1) }, getPathValues: function(e) { var t = l(),
          a = (e ? new URL(e) : t.location).pathname.slice(1).split("/").filter((function(e) { return "" !== e })),
          i = a.length; return { key: a[i - 2], value: a[i - 1] } }, setHistory: function(e, t) { var a = this,
          i = l(); if (a.history.initialized && a.params.history.enabled) { var s;
          s = a.params.url ? new URL(a.params.url) : i.location; var r = a.slides.eq(t),
            n = se.slugify(r.attr("data-history"));
          s.pathname.includes(e) || (n = e + "/" + n); var o = i.history.state;
          o && o.value === n || (a.params.history.replaceState ? i.history.replaceState({ value: n }, null, n) : i.history.pushState({ value: n }, null, n)) } }, slugify: function(e) { return e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "") }, scrollToSlide: function(e, t, a) { var i = this; if (t)
          for (var s = 0, r = i.slides.length; s < r; s += 1) { var n = i.slides.eq(s); if (se.slugify(n.attr("data-history")) === t && !n.hasClass(i.params.slideDuplicateClass)) { var l = n.index();
              i.slideTo(l, e, a) } } else i.slideTo(0, e, a) } },
    re = { onHashCange: function() { var e = this,
          t = r();
        e.emit("hashChange"); var a = t.location.hash.replace("#", ""); if (a !== e.slides.eq(e.activeIndex).attr("data-hash")) { var i = e.$wrapperEl.children("." + e.params.slideClass + '[data-hash="' + a + '"]').index(); if (void 0 === i) return;
          e.slideTo(i) } }, setHash: function() { var e = this,
          t = l(),
          a = r(); if (e.hashNavigation.initialized && e.params.hashNavigation.enabled)
          if (e.params.hashNavigation.replaceState && t.history && t.history.replaceState) t.history.replaceState(null, null, "#" + e.slides.eq(e.activeIndex).attr("data-hash") || ""), e.emit("hashSet");
          else { var i = e.slides.eq(e.activeIndex),
              s = i.attr("data-hash") || i.attr("data-history");
            a.location.hash = s || "", e.emit("hashSet") } }, init: function() { var e = this,
          t = r(),
          a = l(); if (!(!e.params.hashNavigation.enabled || e.params.history && e.params.history.enabled)) { e.hashNavigation.initialized = !0; var i = t.location.hash.replace("#", ""); if (i)
            for (var s = 0, n = e.slides.length; s < n; s += 1) { var o = e.slides.eq(s); if ((o.attr("data-hash") || o.attr("data-history")) === i && !o.hasClass(e.params.slideDuplicateClass)) { var d = o.index();
                e.slideTo(d, 0, e.params.runCallbacksOnInit, !0) } }
          e.params.hashNavigation.watchState && m(a).on("hashchange", e.hashNavigation.onHashCange) } }, destroy: function() { var e = l();
        this.params.hashNavigation.watchState && m(e).off("hashchange", this.hashNavigation.onHashCange) } },
    ne = { run: function() { var e = this,
          t = e.slides.eq(e.activeIndex),
          a = e.params.autoplay.delay;
        t.attr("data-swiper-autoplay") && (a = t.attr("data-swiper-autoplay") || e.params.autoplay.delay), clearTimeout(e.autoplay.timeout), e.autoplay.timeout = E((function() { var t;
          e.params.autoplay.reverseDirection ? e.params.loop ? (e.loopFix(), t = e.slidePrev(e.params.speed, !0, !0), e.emit("autoplay")) : e.isBeginning ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (t = e.slideTo(e.slides.length - 1, e.params.speed, !0, !0), e.emit("autoplay")) : (t = e.slidePrev(e.params.speed, !0, !0), e.emit("autoplay")) : e.params.loop ? (e.loopFix(), t = e.slideNext(e.params.speed, !0, !0), e.emit("autoplay")) : e.isEnd ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (t = e.slideTo(0, e.params.speed, !0, !0), e.emit("autoplay")) : (t = e.slideNext(e.params.speed, !0, !0), e.emit("autoplay")), (e.params.cssMode && e.autoplay.running || !1 === t) && e.autoplay.run() }), a) }, start: function() { var e = this; return void 0 === e.autoplay.timeout && (!e.autoplay.running && (e.autoplay.running = !0, e.emit("autoplayStart"), e.autoplay.run(), !0)) }, stop: function() { var e = this; return !!e.autoplay.running && (void 0 !== e.autoplay.timeout && (e.autoplay.timeout && (clearTimeout(e.autoplay.timeout), e.autoplay.timeout = void 0), e.autoplay.running = !1, e.emit("autoplayStop"), !0)) }, pause: function(e) { var t = this;
        t.autoplay.running && (t.autoplay.paused || (t.autoplay.timeout && clearTimeout(t.autoplay.timeout), t.autoplay.paused = !0, 0 !== e && t.params.autoplay.waitForTransition ? (t.$wrapperEl[0].addEventListener("transitionend", t.autoplay.onTransitionEnd), t.$wrapperEl[0].addEventListener("webkitTransitionEnd", t.autoplay.onTransitionEnd)) : (t.autoplay.paused = !1, t.autoplay.run()))) }, onVisibilityChange: function() { var e = this,
          t = r(); "hidden" === t.visibilityState && e.autoplay.running && e.autoplay.pause(), "visible" === t.visibilityState && e.autoplay.paused && (e.autoplay.run(), e.autoplay.paused = !1) }, onTransitionEnd: function(e) { var t = this;
        t && !t.destroyed && t.$wrapperEl && e.target === t.$wrapperEl[0] && (t.$wrapperEl[0].removeEventListener("transitionend", t.autoplay.onTransitionEnd), t.$wrapperEl[0].removeEventListener("webkitTransitionEnd", t.autoplay.onTransitionEnd), t.autoplay.paused = !1, t.autoplay.running ? t.autoplay.run() : t.autoplay.stop()) } },
    le = { setTranslate: function() { for (var e = this, t = e.slides, a = 0; a < t.length; a += 1) { var i = e.slides.eq(a),
            s = -i[0].swiperSlideOffset;
          e.params.virtualTranslate || (s -= e.translate); var r = 0;
          e.isHorizontal() || (r = s, s = 0); var n = e.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(i[0].progress), 0) : 1 + Math.min(Math.max(i[0].progress, -1), 0);
          i.css({ opacity: n }).transform("translate3d(" + s + "px, " + r + "px, 0px)") } }, setTransition: function(e) { var t = this,
          a = t.slides,
          i = t.$wrapperEl; if (a.transition(e), t.params.virtualTranslate && 0 !== e) { var s = !1;
          a.transitionEnd((function() { if (!s && t && !t.destroyed) { s = !0, t.animating = !1; for (var e = ["webkitTransitionEnd", "transitionend"], a = 0; a < e.length; a += 1) i.trigger(e[a]) } })) } } },
    oe = { setTranslate: function() { var e, t = this,
          a = t.$el,
          i = t.$wrapperEl,
          s = t.slides,
          r = t.width,
          n = t.height,
          l = t.rtlTranslate,
          o = t.size,
          d = t.browser,
          p = t.params.cubeEffect,
          u = t.isHorizontal(),
          c = t.virtual && t.params.virtual.enabled,
          h = 0;
        p.shadow && (u ? (0 === (e = i.find(".swiper-cube-shadow")).length && (e = m('<div class="swiper-cube-shadow"></div>'), i.append(e)), e.css({ height: r + "px" })) : 0 === (e = a.find(".swiper-cube-shadow")).length && (e = m('<div class="swiper-cube-shadow"></div>'), a.append(e))); for (var v = 0; v < s.length; v += 1) { var f = s.eq(v),
            g = v;
          c && (g = parseInt(f.attr("data-swiper-slide-index"), 10)); var w = 90 * g,
            y = Math.floor(w / 360);
          l && (w = -w, y = Math.floor(-w / 360)); var b = Math.max(Math.min(f[0].progress, 1), -1),
            E = 0,
            x = 0,
            T = 0;
          g % 4 == 0 ? (E = 4 * -y * o, T = 0) : (g - 1) % 4 == 0 ? (E = 0, T = 4 * -y * o) : (g - 2) % 4 == 0 ? (E = o + 4 * y * o, T = o) : (g - 3) % 4 == 0 && (E = -o, T = 3 * o + 4 * o * y), l && (E = -E), u || (x = E, E = 0); var C = "rotateX(" + (u ? 0 : -w) + "deg) rotateY(" + (u ? w : 0) + "deg) translate3d(" + E + "px, " + x + "px, " + T + "px)"; if (b <= 1 && b > -1 && (h = 90 * g + 90 * b, l && (h = 90 * -g - 90 * b)), f.transform(C), p.slideShadows) { var S = u ? f.find(".swiper-slide-shadow-left") : f.find(".swiper-slide-shadow-top"),
              M = u ? f.find(".swiper-slide-shadow-right") : f.find(".swiper-slide-shadow-bottom");
            0 === S.length && (S = m('<div class="swiper-slide-shadow-' + (u ? "left" : "top") + '"></div>'), f.append(S)), 0 === M.length && (M = m('<div class="swiper-slide-shadow-' + (u ? "right" : "bottom") + '"></div>'), f.append(M)), S.length && (S[0].style.opacity = Math.max(-b, 0)), M.length && (M[0].style.opacity = Math.max(b, 0)) } } if (i.css({ "-webkit-transform-origin": "50% 50% -" + o / 2 + "px", "-moz-transform-origin": "50% 50% -" + o / 2 + "px", "-ms-transform-origin": "50% 50% -" + o / 2 + "px", "transform-origin": "50% 50% -" + o / 2 + "px" }), p.shadow)
          if (u) e.transform("translate3d(0px, " + (r / 2 + p.shadowOffset) + "px, " + -r / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + p.shadowScale + ")");
          else { var z = Math.abs(h) - 90 * Math.floor(Math.abs(h) / 90),
              P = 1.5 - (Math.sin(2 * z * Math.PI / 360) / 2 + Math.cos(2 * z * Math.PI / 360) / 2),
              k = p.shadowScale,
              L = p.shadowScale / P,
              $ = p.shadowOffset;
            e.transform("scale3d(" + k + ", 1, " + L + ") translate3d(0px, " + (n / 2 + $) + "px, " + -n / 2 / L + "px) rotateX(-90deg)") }
        var I = d.isSafari || d.isWebView ? -o / 2 : 0;
        i.transform("translate3d(0px,0," + I + "px) rotateX(" + (t.isHorizontal() ? 0 : h) + "deg) rotateY(" + (t.isHorizontal() ? -h : 0) + "deg)") }, setTransition: function(e) { var t = this,
          a = t.$el;
        t.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), t.params.cubeEffect.shadow && !t.isHorizontal() && a.find(".swiper-cube-shadow").transition(e) } },
    de = { setTranslate: function() { for (var e = this, t = e.slides, a = e.rtlTranslate, i = 0; i < t.length; i += 1) { var s = t.eq(i),
            r = s[0].progress;
          e.params.flipEffect.limitRotation && (r = Math.max(Math.min(s[0].progress, 1), -1)); var n = -180 * r,
            l = 0,
            o = -s[0].swiperSlideOffset,
            d = 0; if (e.isHorizontal() ? a && (n = -n) : (d = o, o = 0, l = -n, n = 0), s[0].style.zIndex = -Math.abs(Math.round(r)) + t.length, e.params.flipEffect.slideShadows) { var p = e.isHorizontal() ? s.find(".swiper-slide-shadow-left") : s.find(".swiper-slide-shadow-top"),
              u = e.isHorizontal() ? s.find(".swiper-slide-shadow-right") : s.find(".swiper-slide-shadow-bottom");
            0 === p.length && (p = m('<div class="swiper-slide-shadow-' + (e.isHorizontal() ? "left" : "top") + '"></div>'), s.append(p)), 0 === u.length && (u = m('<div class="swiper-slide-shadow-' + (e.isHorizontal() ? "right" : "bottom") + '"></div>'), s.append(u)), p.length && (p[0].style.opacity = Math.max(-r, 0)), u.length && (u[0].style.opacity = Math.max(r, 0)) }
          s.transform("translate3d(" + o + "px, " + d + "px, 0px) rotateX(" + l + "deg) rotateY(" + n + "deg)") } }, setTransition: function(e) { var t = this,
          a = t.slides,
          i = t.activeIndex,
          s = t.$wrapperEl; if (a.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), t.params.virtualTranslate && 0 !== e) { var r = !1;
          a.eq(i).transitionEnd((function() { if (!r && t && !t.destroyed) { r = !0, t.animating = !1; for (var e = ["webkitTransitionEnd", "transitionend"], a = 0; a < e.length; a += 1) s.trigger(e[a]) } })) } } },
    pe = { setTranslate: function() { for (var e = this, t = e.width, a = e.height, i = e.slides, s = e.slidesSizesGrid, r = e.params.coverflowEffect, n = e.isHorizontal(), l = e.translate, o = n ? t / 2 - l : a / 2 - l, d = n ? r.rotate : -r.rotate, p = r.depth, u = 0, c = i.length; u < c; u += 1) { var h = i.eq(u),
            v = s[u],
            f = (o - h[0].swiperSlideOffset - v / 2) / v * r.modifier,
            g = n ? d * f : 0,
            w = n ? 0 : d * f,
            y = -p * Math.abs(f),
            b = r.stretch; "string" == typeof b && -1 !== b.indexOf("%") && (b = parseFloat(r.stretch) / 100 * v); var E = n ? 0 : b * f,
            x = n ? b * f : 0,
            T = 1 - (1 - r.scale) * Math.abs(f);
          Math.abs(x) < .001 && (x = 0), Math.abs(E) < .001 && (E = 0), Math.abs(y) < .001 && (y = 0), Math.abs(g) < .001 && (g = 0), Math.abs(w) < .001 && (w = 0), Math.abs(T) < .001 && (T = 0); var C = "translate3d(" + x + "px," + E + "px," + y + "px)  rotateX(" + w + "deg) rotateY(" + g + "deg) scale(" + T + ")"; if (h.transform(C), h[0].style.zIndex = 1 - Math.abs(Math.round(f)), r.slideShadows) { var S = n ? h.find(".swiper-slide-shadow-left") : h.find(".swiper-slide-shadow-top"),
              M = n ? h.find(".swiper-slide-shadow-right") : h.find(".swiper-slide-shadow-bottom");
            0 === S.length && (S = m('<div class="swiper-slide-shadow-' + (n ? "left" : "top") + '"></div>'), h.append(S)), 0 === M.length && (M = m('<div class="swiper-slide-shadow-' + (n ? "right" : "bottom") + '"></div>'), h.append(M)), S.length && (S[0].style.opacity = f > 0 ? f : 0), M.length && (M[0].style.opacity = -f > 0 ? -f : 0) } } }, setTransition: function(e) { this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e) } },
    ue = { init: function() { var e = this,
          t = e.params.thumbs; if (e.thumbs.initialized) return !1;
        e.thumbs.initialized = !0; var a = e.constructor; return t.swiper instanceof a ? (e.thumbs.swiper = t.swiper, S(e.thumbs.swiper.originalParams, { watchSlidesProgress: !0, slideToClickedSlide: !1 }), S(e.thumbs.swiper.params, { watchSlidesProgress: !0, slideToClickedSlide: !1 })) : C(t.swiper) && (e.thumbs.swiper = new a(S({}, t.swiper, { watchSlidesVisibility: !0, watchSlidesProgress: !0, slideToClickedSlide: !1 })), e.thumbs.swiperCreated = !0), e.thumbs.swiper.$el.addClass(e.params.thumbs.thumbsContainerClass), e.thumbs.swiper.on("tap", e.thumbs.onThumbClick), !0 }, onThumbClick: function() { var e = this,
          t = e.thumbs.swiper; if (t) { var a = t.clickedIndex,
            i = t.clickedSlide; if (!(i && m(i).hasClass(e.params.thumbs.slideThumbActiveClass) || null == a)) { var s; if (s = t.params.loop ? parseInt(m(t.clickedSlide).attr("data-swiper-slide-index"), 10) : a, e.params.loop) { var r = e.activeIndex;
              e.slides.eq(r).hasClass(e.params.slideDuplicateClass) && (e.loopFix(), e._clientLeft = e.$wrapperEl[0].clientLeft, r = e.activeIndex); var n = e.slides.eq(r).prevAll('[data-swiper-slide-index="' + s + '"]').eq(0).index(),
                l = e.slides.eq(r).nextAll('[data-swiper-slide-index="' + s + '"]').eq(0).index();
              s = void 0 === n ? l : void 0 === l ? n : l - r < r - n ? l : n }
            e.slideTo(s) } } }, update: function(e) { var t = this,
          a = t.thumbs.swiper; if (a) { var i = "auto" === a.params.slidesPerView ? a.slidesPerViewDynamic() : a.params.slidesPerView,
            s = t.params.thumbs.autoScrollOffset,
            r = s && !a.params.loop; if (t.realIndex !== a.realIndex || r) { var n, l, o = a.activeIndex; if (a.params.loop) { a.slides.eq(o).hasClass(a.params.slideDuplicateClass) && (a.loopFix(), a._clientLeft = a.$wrapperEl[0].clientLeft, o = a.activeIndex); var d = a.slides.eq(o).prevAll('[data-swiper-slide-index="' + t.realIndex + '"]').eq(0).index(),
                p = a.slides.eq(o).nextAll('[data-swiper-slide-index="' + t.realIndex + '"]').eq(0).index();
              n = void 0 === d ? p : void 0 === p ? d : p - o == o - d ? o : p - o < o - d ? p : d, l = t.activeIndex > t.previousIndex ? "next" : "prev" } else l = (n = t.realIndex) > t.previousIndex ? "next" : "prev";
            r && (n += "next" === l ? s : -1 * s), a.visibleSlidesIndexes && a.visibleSlidesIndexes.indexOf(n) < 0 && (a.params.centeredSlides ? n = n > o ? n - Math.floor(i / 2) + 1 : n + Math.floor(i / 2) - 1 : n > o && (n = n - i + 1), a.slideTo(n, e ? 0 : void 0)) } var u = 1,
            c = t.params.thumbs.slideThumbActiveClass; if (t.params.slidesPerView > 1 && !t.params.centeredSlides && (u = t.params.slidesPerView), t.params.thumbs.multipleActiveThumbs || (u = 1), u = Math.floor(u), a.slides.removeClass(c), a.params.loop || a.params.virtual && a.params.virtual.enabled)
            for (var h = 0; h < u; h += 1) a.$wrapperEl.children('[data-swiper-slide-index="' + (t.realIndex + h) + '"]').addClass(c);
          else
            for (var v = 0; v < u; v += 1) a.slides.eq(t.realIndex + v).addClass(c) } } },
    ce = [q, _, { name: "mousewheel", params: { mousewheel: { enabled: !1, releaseOnEdges: !1, invert: !1, forceToAxis: !1, sensitivity: 1, eventsTarget: "container", thresholdDelta: null, thresholdTime: null } }, create: function() { M(this, { mousewheel: { enabled: !1, lastScrollTime: x(), lastEventBeforeSnap: void 0, recentWheelEvents: [], enable: U.enable, disable: U.disable, handle: U.handle, handleMouseEnter: U.handleMouseEnter, handleMouseLeave: U.handleMouseLeave, animateSlider: U.animateSlider, releaseScroll: U.releaseScroll } }) }, on: { init: function(e) {!e.params.mousewheel.enabled && e.params.cssMode && e.mousewheel.disable(), e.params.mousewheel.enabled && e.mousewheel.enable() }, destroy: function(e) { e.params.cssMode && e.mousewheel.enable(), e.mousewheel.enabled && e.mousewheel.disable() } } }, { name: "navigation", params: { navigation: { nextEl: null, prevEl: null, hideOnClick: !1, disabledClass: "swiper-button-disabled", hiddenClass: "swiper-button-hidden", lockClass: "swiper-button-lock" } }, create: function() { M(this, { navigation: t({}, K) }) }, on: { init: function(e) { e.navigation.init(), e.navigation.update() }, toEdge: function(e) { e.navigation.update() }, fromEdge: function(e) { e.navigation.update() }, destroy: function(e) { e.navigation.destroy() }, click: function(e, t) { var a, i = e.navigation,
            s = i.$nextEl,
            r = i.$prevEl;!e.params.navigation.hideOnClick || m(t.target).is(r) || m(t.target).is(s) || (s ? a = s.hasClass(e.params.navigation.hiddenClass) : r && (a = r.hasClass(e.params.navigation.hiddenClass)), !0 === a ? e.emit("navigationShow") : e.emit("navigationHide"), s && s.toggleClass(e.params.navigation.hiddenClass), r && r.toggleClass(e.params.navigation.hiddenClass)) } } }, { name: "pagination", params: { pagination: { el: null, bulletElement: "span", clickable: !1, hideOnClick: !1, renderBullet: null, renderProgressbar: null, renderFraction: null, renderCustom: null, progressbarOpposite: !1, type: "bullets", dynamicBullets: !1, dynamicMainBullets: 1, formatFractionCurrent: function(e) { return e }, formatFractionTotal: function(e) { return e }, bulletClass: "swiper-pagination-bullet", bulletActiveClass: "swiper-pagination-bullet-active", modifierClass: "swiper-pagination-", currentClass: "swiper-pagination-current", totalClass: "swiper-pagination-total", hiddenClass: "swiper-pagination-hidden", progressbarFillClass: "swiper-pagination-progressbar-fill", progressbarOppositeClass: "swiper-pagination-progressbar-opposite", clickableClass: "swiper-pagination-clickable", lockClass: "swiper-pagination-lock" } }, create: function() { M(this, { pagination: t({ dynamicBulletIndex: 0 }, Z) }) }, on: { init: function(e) { e.pagination.init(), e.pagination.render(), e.pagination.update() }, activeIndexChange: function(e) {
          (e.params.loop || void 0 === e.snapIndex) && e.pagination.update() }, snapIndexChange: function(e) { e.params.loop || e.pagination.update() }, slidesLengthChange: function(e) { e.params.loop && (e.pagination.render(), e.pagination.update()) }, snapGridLengthChange: function(e) { e.params.loop || (e.pagination.render(), e.pagination.update()) }, destroy: function(e) { e.pagination.destroy() }, click: function(e, t) { e.params.pagination.el && e.params.pagination.hideOnClick && e.pagination.$el.length > 0 && !m(t.target).hasClass(e.params.pagination.bulletClass) && (!0 === e.pagination.$el.hasClass(e.params.pagination.hiddenClass) ? e.emit("paginationShow") : e.emit("paginationHide"), e.pagination.$el.toggleClass(e.params.pagination.hiddenClass)) } } }, { name: "scrollbar", params: { scrollbar: { el: null, dragSize: "auto", hide: !1, draggable: !1, snapOnRelease: !0, lockClass: "swiper-scrollbar-lock", dragClass: "swiper-scrollbar-drag" } }, create: function() { M(this, { scrollbar: t({ isTouched: !1, timeout: null, dragTimeout: null }, J) }) }, on: { init: function(e) { e.scrollbar.init(), e.scrollbar.updateSize(), e.scrollbar.setTranslate() }, update: function(e) { e.scrollbar.updateSize() }, resize: function(e) { e.scrollbar.updateSize() }, observerUpdate: function(e) { e.scrollbar.updateSize() }, setTranslate: function(e) { e.scrollbar.setTranslate() }, setTransition: function(e, t) { e.scrollbar.setTransition(t) }, destroy: function(e) { e.scrollbar.destroy() } } }, { name: "parallax", params: { parallax: { enabled: !1 } }, create: function() { M(this, { parallax: t({}, Q) }) }, on: { beforeInit: function(e) { e.params.parallax.enabled && (e.params.watchSlidesProgress = !0, e.originalParams.watchSlidesProgress = !0) }, init: function(e) { e.params.parallax.enabled && e.parallax.setTranslate() }, setTranslate: function(e) { e.params.parallax.enabled && e.parallax.setTranslate() }, setTransition: function(e, t) { e.params.parallax.enabled && e.parallax.setTransition(t) } } }, { name: "zoom", params: { zoom: { enabled: !1, maxRatio: 3, minRatio: 1, toggle: !0, containerClass: "swiper-zoom-container", zoomedSlideClass: "swiper-slide-zoomed" } }, create: function() { var e = this;
        M(e, { zoom: t({ enabled: !1, scale: 1, currentScale: 1, isScaling: !1, gesture: { $slideEl: void 0, slideWidth: void 0, slideHeight: void 0, $imageEl: void 0, $imageWrapEl: void 0, maxRatio: 3 }, image: { isTouched: void 0, isMoved: void 0, currentX: void 0, currentY: void 0, minX: void 0, minY: void 0, maxX: void 0, maxY: void 0, width: void 0, height: void 0, startX: void 0, startY: void 0, touchesStart: {}, touchesCurrent: {} }, velocity: { x: void 0, y: void 0, prevPositionX: void 0, prevPositionY: void 0, prevTime: void 0 } }, ee) }); var a = 1;
        Object.defineProperty(e.zoom, "scale", { get: function() { return a }, set: function(t) { if (a !== t) { var i = e.zoom.gesture.$imageEl ? e.zoom.gesture.$imageEl[0] : void 0,
                s = e.zoom.gesture.$slideEl ? e.zoom.gesture.$slideEl[0] : void 0;
              e.emit("zoomChange", t, i, s) }
            a = t } }) }, on: { init: function(e) { e.params.zoom.enabled && e.zoom.enable() }, destroy: function(e) { e.zoom.disable() }, touchStart: function(e, t) { e.zoom.enabled && e.zoom.onTouchStart(t) }, touchEnd: function(e, t) { e.zoom.enabled && e.zoom.onTouchEnd(t) }, doubleTap: function(e, t) { e.params.zoom.enabled && e.zoom.enabled && e.params.zoom.toggle && e.zoom.toggle(t) }, transitionEnd: function(e) { e.zoom.enabled && e.params.zoom.enabled && e.zoom.onTransitionEnd() }, slideChange: function(e) { e.zoom.enabled && e.params.zoom.enabled && e.params.cssMode && e.zoom.onTransitionEnd() } } }, { name: "lazy", params: { lazy: { checkInView: !1, enabled: !1, loadPrevNext: !1, loadPrevNextAmount: 1, loadOnTransitionStart: !1, scrollingElement: "", elementClass: "swiper-lazy", loadingClass: "swiper-lazy-loading", loadedClass: "swiper-lazy-loaded", preloaderClass: "swiper-lazy-preloader" } }, create: function() { M(this, { lazy: t({ initialImageLoaded: !1 }, te) }) }, on: { beforeInit: function(e) { e.params.lazy.enabled && e.params.preloadImages && (e.params.preloadImages = !1) }, init: function(e) { e.params.lazy.enabled && !e.params.loop && 0 === e.params.initialSlide && (e.params.lazy.checkInView ? e.lazy.checkInViewOnLoad() : e.lazy.load()) }, scroll: function(e) { e.params.freeMode && !e.params.freeModeSticky && e.lazy.load() }, resize: function(e) { e.params.lazy.enabled && e.lazy.load() }, scrollbarDragMove: function(e) { e.params.lazy.enabled && e.lazy.load() }, transitionStart: function(e) { e.params.lazy.enabled && (e.params.lazy.loadOnTransitionStart || !e.params.lazy.loadOnTransitionStart && !e.lazy.initialImageLoaded) && e.lazy.load() }, transitionEnd: function(e) { e.params.lazy.enabled && !e.params.lazy.loadOnTransitionStart && e.lazy.load() }, slideChange: function(e) { e.params.lazy.enabled && e.params.cssMode && e.lazy.load() } } }, { name: "controller", params: { controller: { control: void 0, inverse: !1, by: "slide" } }, create: function() { M(this, { controller: t({ control: this.params.controller.control }, ae) }) }, on: { update: function(e) { e.controller.control && e.controller.spline && (e.controller.spline = void 0, delete e.controller.spline) }, resize: function(e) { e.controller.control && e.controller.spline && (e.controller.spline = void 0, delete e.controller.spline) }, observerUpdate: function(e) { e.controller.control && e.controller.spline && (e.controller.spline = void 0, delete e.controller.spline) }, setTranslate: function(e, t, a) { e.controller.control && e.controller.setTranslate(t, a) }, setTransition: function(e, t, a) { e.controller.control && e.controller.setTransition(t, a) } } }, { name: "a11y", params: { a11y: { enabled: !0, notificationClass: "swiper-notification", prevSlideMessage: "Previous slide", nextSlideMessage: "Next slide", firstSlideMessage: "This is the first slide", lastSlideMessage: "This is the last slide", paginationBulletMessage: "Go to slide {{index}}", containerMessage: null, containerRoleDescriptionMessage: null, itemRoleDescriptionMessage: null } }, create: function() { M(this, { a11y: t({}, ie, { liveRegion: m('<span class="' + this.params.a11y.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>') }) }) }, on: { afterInit: function(e) { e.params.a11y.enabled && (e.a11y.init(), e.a11y.updateNavigation()) }, toEdge: function(e) { e.params.a11y.enabled && e.a11y.updateNavigation() }, fromEdge: function(e) { e.params.a11y.enabled && e.a11y.updateNavigation() }, paginationUpdate: function(e) { e.params.a11y.enabled && e.a11y.updatePagination() }, destroy: function(e) { e.params.a11y.enabled && e.a11y.destroy() } } }, { name: "history", params: { history: { enabled: !1, replaceState: !1, key: "slides" } }, create: function() { M(this, { history: t({}, se) }) }, on: { init: function(e) { e.params.history.enabled && e.history.init() }, destroy: function(e) { e.params.history.enabled && e.history.destroy() }, transitionEnd: function(e) { e.history.initialized && e.history.setHistory(e.params.history.key, e.activeIndex) }, slideChange: function(e) { e.history.initialized && e.params.cssMode && e.history.setHistory(e.params.history.key, e.activeIndex) } } }, { name: "hash-navigation", params: { hashNavigation: { enabled: !1, replaceState: !1, watchState: !1 } }, create: function() { M(this, { hashNavigation: t({ initialized: !1 }, re) }) }, on: { init: function(e) { e.params.hashNavigation.enabled && e.hashNavigation.init() }, destroy: function(e) { e.params.hashNavigation.enabled && e.hashNavigation.destroy() }, transitionEnd: function(e) { e.hashNavigation.initialized && e.hashNavigation.setHash() }, slideChange: function(e) { e.hashNavigation.initialized && e.params.cssMode && e.hashNavigation.setHash() } } }, { name: "autoplay", params: { autoplay: { enabled: !1, delay: 3e3, waitForTransition: !0, disableOnInteraction: !0, stopOnLastSlide: !1, reverseDirection: !1 } }, create: function() { M(this, { autoplay: t({}, ne, { running: !1, paused: !1 }) }) }, on: { init: function(e) { e.params.autoplay.enabled && (e.autoplay.start(), r().addEventListener("visibilitychange", e.autoplay.onVisibilityChange)) }, beforeTransitionStart: function(e, t, a) { e.autoplay.running && (a || !e.params.autoplay.disableOnInteraction ? e.autoplay.pause(t) : e.autoplay.stop()) }, sliderFirstMove: function(e) { e.autoplay.running && (e.params.autoplay.disableOnInteraction ? e.autoplay.stop() : e.autoplay.pause()) }, touchEnd: function(e) { e.params.cssMode && e.autoplay.paused && !e.params.autoplay.disableOnInteraction && e.autoplay.run() }, destroy: function(e) { e.autoplay.running && e.autoplay.stop(), r().removeEventListener("visibilitychange", e.autoplay.onVisibilityChange) } } }, { name: "effect-fade", params: { fadeEffect: { crossFade: !1 } }, create: function() { M(this, { fadeEffect: t({}, le) }) }, on: { beforeInit: function(e) { if ("fade" === e.params.effect) { e.classNames.push(e.params.containerModifierClass + "fade"); var t = { slidesPerView: 1, slidesPerColumn: 1, slidesPerGroup: 1, watchSlidesProgress: !0, spaceBetween: 0, virtualTranslate: !0 };
            S(e.params, t), S(e.originalParams, t) } }, setTranslate: function(e) { "fade" === e.params.effect && e.fadeEffect.setTranslate() }, setTransition: function(e, t) { "fade" === e.params.effect && e.fadeEffect.setTransition(t) } } }, { name: "effect-cube", params: { cubeEffect: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: .94 } }, create: function() { M(this, { cubeEffect: t({}, oe) }) }, on: { beforeInit: function(e) { if ("cube" === e.params.effect) { e.classNames.push(e.params.containerModifierClass + "cube"), e.classNames.push(e.params.containerModifierClass + "3d"); var t = { slidesPerView: 1, slidesPerColumn: 1, slidesPerGroup: 1, watchSlidesProgress: !0, resistanceRatio: 0, spaceBetween: 0, centeredSlides: !1, virtualTranslate: !0 };
            S(e.params, t), S(e.originalParams, t) } }, setTranslate: function(e) { "cube" === e.params.effect && e.cubeEffect.setTranslate() }, setTransition: function(e, t) { "cube" === e.params.effect && e.cubeEffect.setTransition(t) } } }, { name: "effect-flip", params: { flipEffect: { slideShadows: !0, limitRotation: !0 } }, create: function() { M(this, { flipEffect: t({}, de) }) }, on: { beforeInit: function(e) { if ("flip" === e.params.effect) { e.classNames.push(e.params.containerModifierClass + "flip"), e.classNames.push(e.params.containerModifierClass + "3d"); var t = { slidesPerView: 1, slidesPerColumn: 1, slidesPerGroup: 1, watchSlidesProgress: !0, spaceBetween: 0, virtualTranslate: !0 };
            S(e.params, t), S(e.originalParams, t) } }, setTranslate: function(e) { "flip" === e.params.effect && e.flipEffect.setTranslate() }, setTransition: function(e, t) { "flip" === e.params.effect && e.flipEffect.setTransition(t) } } }, { name: "effect-coverflow", params: { coverflowEffect: { rotate: 50, stretch: 0, depth: 100, scale: 1, modifier: 1, slideShadows: !0 } }, create: function() { M(this, { coverflowEffect: t({}, pe) }) }, on: { beforeInit: function(e) { "coverflow" === e.params.effect && (e.classNames.push(e.params.containerModifierClass + "coverflow"), e.classNames.push(e.params.containerModifierClass + "3d"), e.params.watchSlidesProgress = !0, e.originalParams.watchSlidesProgress = !0) }, setTranslate: function(e) { "coverflow" === e.params.effect && e.coverflowEffect.setTranslate() }, setTransition: function(e, t) { "coverflow" === e.params.effect && e.coverflowEffect.setTransition(t) } } }, { name: "thumbs", params: { thumbs: { swiper: null, multipleActiveThumbs: !0, autoScrollOffset: 0, slideThumbActiveClass: "swiper-slide-thumb-active", thumbsContainerClass: "swiper-container-thumbs" } }, create: function() { M(this, { thumbs: t({ swiper: null, initialized: !1 }, ue) }) }, on: { beforeInit: function(e) { var t = e.params.thumbs;
          t && t.swiper && (e.thumbs.init(), e.thumbs.update(!0)) }, slideChange: function(e) { e.thumbs.swiper && e.thumbs.update() }, update: function(e) { e.thumbs.swiper && e.thumbs.update() }, resize: function(e) { e.thumbs.swiper && e.thumbs.update() }, observerUpdate: function(e) { e.thumbs.swiper && e.thumbs.update() }, setTransition: function(e, t) { var a = e.thumbs.swiper;
          a && a.setTransition(t) }, beforeDestroy: function(e) { var t = e.thumbs.swiper;
          t && e.thumbs.swiperCreated && t && t.destroy() } } }]; return W.use(ce), W }));
//# sourceMappingURL=swiper-bundle.min.js.map

const coords = {
  coords: [53.892500, 27.422628],
  name: 'Perfect.potolki.by',
  description: "улица Скрипникова, 14",
};


class YmapsInitializer {
  constructor(container, placeCoords = coords) {
    this.container = container;
    this.coords = placeCoords;
    this.url = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=fbcde106-6537-4b4c-830a-9755cc84a508>';
    this.myMap = null;
    this.mapContainer = null;
    this.apiScript = null;
    this.myPlacemark = null;
    this.observer = null;
    this.loadMap = this.loadMap.bind(this);
    this.intersectionHandler = this.intersectionHandler.bind(this);
    this.getElementPosition(this.container);
  }

  addMapDetails(mapCoords) {
    const init = () => {
      this.myMap = new ymaps.Map("map", {
        center: this.coords.coords,
        zoom: 17
      });
      this.myPlacemark = new ymaps.Placemark(this.myMap.getCenter(), {
        hintContent: this.coords.name,
        balloonContent: mapCoords.description
      }, {

        preset: "islands#circleDotIcon",
        // Задаем цвет метки (в формате RGB).
        iconColor: '#ff0000'
      });
      this.myMap.geoObjects.add(this.myPlacemark);
      this.myMap.behaviors.disable('scrollZoom');
    }

    ymaps.ready(init);
  }

  changeCenter(newCoords) {
    this.myMap.setCenter(newCoords.coords);
    if (this.myPlacemark) this.myPlacemark = null;
    this.myPlacemark = new ymaps.Placemark(this.myMap.getCenter(), {
      hintContent: newCoords.name,
      balloonContent: newCoords.description
    }, {
      preset: "islands#circleDotIcon",
      // Задаем цвет метки (в формате RGB).
      iconColor: '#ff0000'
    });
    this.myMap.geoObjects.add(this.myPlacemark);
  }

  loadApikey(url) {
    if (this.apiScript) return;
    this.apiScript = document.createElement('script');
    this.apiScript.src = url;
    this.container.prepend(this.apiScript);
    this.apiScript.onload = () => this.addMapDetails(this.coords);
  }

  getElementPosition(target) {
    this.observer = new IntersectionObserver(this.intersectionHandler);
    this.observer.observe(target);
  }

  intersectionHandler(entries) {
    entries.map(entry => {
      if (entry.isIntersecting) {
        this.createMapContainer();
        this.loadApikey(this.url);
        this.observer.unobserve(this.container);
        this.observer = null;
      }
    })
  }

  loadMap() {
    this.createMapContainer();
    this.loadApikey(this.url);
  }

  createMapContainer() {
    if (this.mapContainer) return;
    this.mapContainer = document.createElement('div');
    this.mapContainer.id = 'map';
    this.mapContainer.setAttribute('style', 'width:100%; height: 100%;');
    this.container.appendChild(this.mapContainer);
  }
}