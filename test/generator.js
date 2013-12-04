'use strict';

// native
var util = require('util'),
	path = require('path'),
	fs = require('fs');

var should = require('should'),
	yeoman = require('yeoman-generator'),
	helpers = yeoman.test;

var yutils = require('../src/yeoman-utils'),
	ygutils = yutils.generator;



describe('yutils.generator', function () {

	/**
	 * Mock Generator
	 */
	var MockGen = function MockGen(args, options, config) {

	};

	MockGen.prototype.destinationRoot = function() {
		return 'some-node-module';
	};

	MockGen.prototype.sourceRoot = function() {
		return 'mock-gen-root';
	};


	beforeEach(function (done) {
/*
		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				return done(err);
			}

			this.app = helpers.createGenerator('mock:app', [
				'../generator-mock/app'
			]);
			done();
		}.bind(this));
*/
		done();
	});

	it('exists (:', function () {
		should(yutils.generator).ok;
	});

	describe('jsonReader', function() {
		it('should return a function', function() {
			var reader = ygutils.jsonReader({});

			reader.should.be.type('function');
		});

		it('should read a json file given some generator mocking', function() {

			var readPackageJson = ygutils.jsonReader({
				file: 'package.json',
				base: 'destinationRoot',

				properties: {
					'moduleName': 'name',
					'moduleVersion': 'version'
				},

				destination: 'modulePackageJson',
			});



			var MockGen = function MockGen(args, options, config) {
				this.__name = 'aaa'
			};

			// mock destination root
			MockGen.prototype.destinationRoot = function() {
				return path.join(__dirname, 'temp');
			};

			// mock readFileAsString
			MockGen.prototype.readFileAsString = yeoman.generators.Base.prototype.readFileAsString;

			// put reader method on MockGen prototype
			MockGen.prototype.readPackageJson = readPackageJson;



			// "instantiate generator"
			var mock = new MockGen();

			// "read"
			mock.readPackageJson();

			mock.moduleName.should.eql('mock-module');
			mock.moduleVersion.should.eql(JSON.parse(fs.readFileSync(path.join(__dirname, 'temp/package.json'))).version);
		});
	});
});
