#!/usr/bin/env node

var http = require('http');
var mustache = require('Mu');
var music = require('./music.js').Music;

/**
 *  Create a server and serve up the audio tags
 */

mustache.templateRoot = "./templates";

http.createServer(function (req, res) {

  res.writeHead(200, {'Content-Type': 'text/html'});

  // declare the scale we are constructing from
  scale = music.constructScale( 440 , music.scales.major );

  // intialize the template context
  var templateContext = {
    "audioNodes" : [ ]
  };

  // add a data uri for the frequency into the template context
  for ( var freq in scale ) {
    console.log("writing audio tag for frequency: "+scale[freq]);
    templateContext.audioNodes.push( {"audioDataURI" : music.dataURIFromFreq( scale[freq] , 1  ) } );
  }

  // render the template and write it to the browser
  mustache.render('index.html', templateContext, {}, function(err, output) {

    if(err) {
      throw err;
    }

    var buffer = '';
    output.addListener('data', function(c) {
      buffer += c;
    }).addListener('end', function() {
      res.end(buffer);
    });

  });

}).listen( 6775, "127.0.0.1");

// repl.start('music.js > ');
console.log( "...server listening on port 6775");
