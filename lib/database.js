/**
 * @module Database
 * @date 2013-03-04
 * @author Clément Désiles <clement.desiles@telecomsante.com>
 * @copyright © Télécom Santé
 * @requires mongoskin
 * @description
 *
 * This module is a MongoDB abstraction, and does not care about which
 * ressource and collection it accesses.
 *
 * Controls and computing are done by the ./class/*.js files.
 *
 * Check uniqueness of some fields at startup, and peacefuly closes
 * database on exit.
 */
'use strict';

// Some requirements
// ------------------
var mongo = require('mongoskin');

// BusinessApps database
var db = mongo.db('localhost/rfidea', { safe: true });

// Ensure cardUID is unique
db.collection('disc').ensureIndex( { 'uid': 1 }, { unique: true }, function(err, result) {
	console.info('Mongo index disc.uid ensured unique');
});

// Intent to protect database integrity on exit
process.on('exit', function() {
	if (db) db.close();
});

/**
 * Return a simpler error report from a MongoDB Error.
 * For more information about existing error codes, please see the 
 * {@link https://github.com/mongodb/mongo/blob/master/docs/errors.md|MongoDB documentation}.
 *
 * @method module:Database#getError
 * @param err {Object} Mongo error object
 * @return {String} A simple error label
 */
var getError = function(err) {
	if (err && err.code) {
		switch (err.code) {
			case 11000:
			case 11001: 
				return 'duplicate key error';
			case 12010:
			case 12011:
			case 12012:
				return 'can’t modify an indexed field'
		}
	}
	console.error(err);
	return 'Internal Database Error';
};

var Database = module.exports = {

	/**
	 * Insert a ressource in the specified collection
	 *
	 * @param {String} collection - Mongo collection name
	 * @param {Object} ressource - ressource to act with
	 * @param {Function} callback - takes (err, result)
	 * @return none
	 */
	insert: function(collection, ressource, callback) {
		var callback = callback || function() {};
		db.collection(collection).insert(ressource, function(err, result) {
			if (err || !result) return callback( getError(err) );
			return callback( null, result[0] );
		});
	},

	/**
	 * Update ressources corresponding to the search criterias
	 *
	 * @param collection {String} Mongo collection name
	 * @param search {Object} search criterias
	 * @param ressource {Object} ressource to act with
	 * @param callback {Function} takes (err, result)
	 * @return none
	 */
	update: function(collection, search, ressource, callback) {
		var self = this;
		var callback = callback || function() {};
		db.collection(collection).update(search, { $set: ressource }, function(err, result) {
			if (err) return callback( getError(err) );
			for (var i in ressource){ if (search.hasOwnProperty(i)) delete search[i] }
			if (result === 1) return self.findOne(collection, search, callback);
			else if (result > 1) return self.find(collection, search, {}, callback);
			else return callback( null, false );
		});
	},

	/**
	 * Remove a ressource from the specified collection
	 *
	 * @param collection {String} Mongo collection name
	 * @param ressource {Object} ressource to act with
	 * @param callback {Function} takes (err, result)
	 * @return none
	 */
	remove: function(collection, ressource, callback) {
		if (!callback) callback = function() {};
		db.collection(collection).remove(ressource, function(err, result) {
			if (err) return callback( getError(err) );
			if (!result) return callback('Cannot find ressource to remove');
			return callback();
		});
	},

	/**
	 * Retrieve some ressources from the specified collection
	 *
	 * @param collection {String} Mongo collection name
	 * @param search {Object} search criterias
	 * @param filters {Object} filter the searched contents
	 * @param callback {Function} takes (err, result)
	 * @return none
	 */
	find: function(collection, search, filters, callback) {
		if (!callback) return;
		db.collection(collection).find(search, filters).toArray(function(err, results) {
			if (err) return callback( getError(err) );
			return callback( null, results );
		});
	},

	/**
	 * Retrieve one ressource from the specified collection
	 *
	 * @param collection {String} Mongo collection name
	 * @param search {Object} search criterias
	 * @param callback {Function} takes (err, result)
	 * @return none
	 */
	findOne: function(collection, search, callback) {
		if (!callback) return;
		db.collection(collection).findOne(search, function(err, result) {
			if (err) return callback( getError(err) );
			callback(null, result);
		});
	},

	/**
	 * Get ObjectID from 12/24 Hex String
	 *
	 * @param {String} id
	 * @return ObjectID from 12/24 Hex String
	 */
	getObjID: function(id) {
		return db.ObjectID.createFromHexString( id );
	}
};
