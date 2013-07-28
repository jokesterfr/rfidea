#!/usr/bin/env node
'use strict';

// Some requirements
var join = require('path').join;
var fs = require('fs');
var sys = require('sys');
var db = require('./lib/database');
var nfc = require('nfc').nfc;
var mpd = require('mpd');

// Compact Disk UID
var UID = '';

// Start MPD Client
var client = mpd.connect({
	port: 6600,
	host: 'localhost',
});
client.on('ready', function() { console.log('MPD ready') });
client.on('system', function(name) { console.log('MPD update', name) });

// Get UID of RFID tag
var n = new nfc();
n.on('uid', function(uid) {
	uid = uid.toString('hex');
    if (UID === uid) return;
	UID = uid;
	db.findOne('disc', { uid: UID }, function(err, result) {
		if (err || !result) return console.error('Disc no registered in DB');
		playAlbum(result.path);
	});
});
n.start();

/**
 * Play an album with MPD
 * @param {String} path
 * @return none
 */
function playAlbum( path ) {
	console.log("Going to play", path);
	client.sendCommand( mpd.cmd('clear', []), function(err, msg) {
		if (err) return console.error('mpd clear err', err);
		client.sendCommand( mpd.cmd('add', [path]), function(err, msg) {
			if (err) return console.error('mpd add err', err);
			console.log('MPD added new playlist:', msg);
			client.sendCommand( mpd.cmd('playid', []), function(err, msg) {
				if (err) return console.error('mpd add err', err);
				console.log('MPD started playin:', msg);
			});
		});
	});
}
