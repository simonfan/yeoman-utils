'use strict';
/**
 * @module yeoman-utils
 * @submodule generator
 */

/**
 * @class generator
 * @static
 */

var path = require('path');

var _ = require('lodash');


/**
 * Creates a .json file reader.
 *
 * @method jsonReader
 * @param options {Object}
 *     @param file {String}
 *          Name of the file. Relative to this.destinationRoot().
 *     @param [properties] {Object|Array|Boolean}
 *          Object: A map of how the properties read from the .json file
 *            should be made available on `this`. { toThisGeneratorInstanceProperty: fromJsonFileProperty }
 *          Array: Properties will be made available on `this` using the
 *            same names they are founf on the json file.
 *          Boolean(true): Store all properties with their names directly
 *            on `this`.
 *     @param [destination] {String}
 *          Store the whole object on `this[destination]`
 *     @param [base] {String} defaults to 'destinationRoot'
 *          Name of the method to be called (`this.destinationRoot()`)
 *          to get the base path for the file.
 */
exports.jsonReader = function jsonReader(options) {

	// normalize options to the
	// { toThisGeneratorInstanceProperty: fromJsonFileProperty }
	var properties;
	if (_.isArray(options.properties)) {
		// from array
		properties = _.zipObject(options.properties, options.properties);
	} else if (_.isString(options.properties)) {
		// from string
		properties = {};
		properties[ options.properties ] = options.properties;
	} else if (_.isObject(options.properties)) {
		// good format
		properties = options.properties;
	}

	return function readJson() {

		// remember: `this` is bound to the instantiated generator object.
		// this function will become a method from the generator's instance.
		var base = this[options.base](),
			fpath = path.join(base, options.file);

		var fdata = this.readFileAsString(fpath),
			fjson = JSON.parse(fdata);

		// save whole object to destination
		if (options.destination) {
			this.destination = fjson;
		}

		// save properties
		_.each(properties, function(jsonPropName, thisObjPropName) {

			this[thisObjPropName] = fjson[jsonPropName];

		}.bind(this));
	};

};




/**
 * Creates a package.json file reader.
 * Proxies functionality from jsonReader.
 *
 * @method packageJsonReader
 * @return {Function} readJson
 */
exports.packageJsonReader = function packageJsonReader(options) {
	options.file = 'package.json';

	return exports.jsonReader(options);
};
