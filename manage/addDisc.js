#!/usr/bin/env node

/******************************************************************************\
*                                                                              *
* @file addDisc.js                                                             *
* @author Clément Désiles <main@jokester.fr>                                   *
* @date 2013-07-28                                                             *
*                                                                              *
* A simple script to add a new UID reference and path of a CD                  *
*                                                                              *
\******************************************************************************/
'use strict';

// Some requirements
var join = require('path').join;
var fs = require('fs');
var sys = require('sys');
var db = require('../lib/database');
var readline = require('readline');

// Readline interface
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Ask forever questions
function ask() {
	rl.question("UID|path: ", function(answer) {
		if (!answer || typeof(answer)!=='string') return ask();

		answer = answer.split('|');
		if (answer.length!=2) return ask();

		var uid = answer[0];
		var path = answer[1];

		db.findOne('disc', { uid: uid }, function(err, result) {
			if (err || !result) addDisc(uid, path);
			else updateDisk(uid, path);
			
			// Ask for new one
			ask();
		});
	});
}
setTimeout(ask,500);

/**
 * Add a disc in DB
 * @param {String} uid - disc unique ID from RFID tag
 * @param {String} path
 * @return none
 */
function addDisc(uid, path) {
	db.insert('disc', { uid:uid, path:path}, function(err, result) {
		if (err) return console.error('Err cannot insert disc');
		console.log('INSERTED', uid, path);
	});
}

/**
 * Update a disc in DB
 * @param {String} uid - disc unique ID from RFID tag
 * @param {String} path
 * @return none
 */
function updateDisk(uid, path) {
	db.update('disc', { uid:uid }, { path:path}, function(err, result) {
		if (err) return console.error('Err cannot update disc');
		console.log('UPDATED', uid, path);
	});
}