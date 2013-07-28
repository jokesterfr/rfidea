#!/usr/bin/env node

/******************************************************************************\
*                                                                              *
* @file playAlbum.js                                                           *
* @author Clément Désiles <main@jokester.fr>                                   *
* @date 2013-07-28                                                             *
*                                                                              *
* A simple script change the MPD playlist.                                     *
*                                                                              *
* The purpose of this is to test if the MPD daemon can find the input,         *
* path of the CD you are willing to play.                                      *
*                                                                              *
\******************************************************************************/
'use strict';

// Some requirements
var join = require('path').join;
var fs = require('fs');
var sys = require('sys');
var mpd = require('mpd');

// Base path
// var ROOT = '/media/Sombrero/Albums';
var ROOT = '/home/jokester/Musique';

// Start MPD Client
var client = mpd.connect({
	port: 6600,
	host: 'localhost',
});
client.on('ready', function() { console.log('MPD ready') });
client.on('system', function(name) { console.log('MPD update', name) });


/**
 * Play an album with MPD
 * @param {String} album_path
 * @return none
 */
function playAlbum(album_path) {
	var path = join(ROOT, album_path);
	console.log("Going to play", path);
	client.sendCommand( mpd.cmd('clear', []), function(err, msg) {
		if (err) return console.error('mpd clear err', err);
		client.sendCommand( mpd.cmd('add', ['Peer Kusiv/Natur & Techno']), function(err, msg) {
			if (err) return console.error('mpd add err', err);
			console.log('MPD added new playlist:', msg);
			client.sendCommand( mpd.cmd('playid', []), function(err, msg) {
				if (err) return console.error('mpd add err', err);
				console.log('MPD started playin', msg);
			});
		});
	});
}

setTimeout(function(){
	playAlbum('Peer Kusiv');
},1500);
