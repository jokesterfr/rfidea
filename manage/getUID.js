#!/usr/bin/env node

/******************************************************************************\
*                                                                              *
* @file getUID.js                                                              *
* @author Clément Désiles <main@jokester.fr>                                   *
* @date 2013-07-28                                                             *
*                                                                              *
* A simple script to retrieve the UID of a presented CD                        *
* to the RFID tag reader.                                                      *
*                                                                              *
* Disclaimer: as libnfc shows up to much warnings on my installation           *
* I do prefer separate the getUID thing and the addDisc interface.             *
*                                                                              *
\******************************************************************************/
'use strict';

// Some requirements
var join = require('path').join;
var fs = require('fs');
var sys = require('sys');
var db = require('../lib/database');
var nfc = require('nfc').nfc;

// UID flag not to handle to much nfc events
var flag = null;

// NFC reader
var n = new nfc();
n.on('uid', function(uid) {
	if (flag === uid) return;
	flag = uid;
	setTimeout(function(){ flag = null }, 1000);
	uid = uid.toString('hex');
	db.findOne('disc', { uid: uid }, function(err, result) {
		if (err || !result) return console.log(uid);
		console.log(uid, result.path);
	});
});
n.start();