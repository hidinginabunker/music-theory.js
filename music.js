var repl = require('repl');
var http = require('http');
var mustache = require('Mu');
var Wave = require('./wave.js').Wave;

music = {

  wholeStep: 2,
  halfStep:  1,
  scales: {
    major:        [ 2,2,1,2,2,2,1 ], 
    minor:        [ 2,1,2,2,1,2,2 ],
    harmonicMin:  [ 2,1,2,2,1,3,1 ],
    wholeTone:    [ 2,2,2,2,2 ],
    pentatonic:   [ 2,3,2,2 ],
    penta2ndForm: [ 2,2,3,2 ],
  },

  /**
  * Returns the frequency of the note which is located
  * a given halfsteps away from the given note
  * 
  * @param noteFreq
  * @param halfSteps
  *
  */

  freqHalfStepsAway: function (noteFreq, halfSteps) {
    return (Math.pow(2, (halfSteps/12))) * noteFreq;
  },


  /**
   * Constructs a scale from the given tonic note and
   * the given scale intervals
   *
   * @param tonic
   * @param scaleIntervals
   *
   */

  constructScale: function ( tonic, scaleIntervals ) {
    var scale = [];
    scale.push(tonic);

    intervalFromTonic = 0;
    for( i in scaleIntervals) {
      intervalFromTonic += scaleIntervals[i];
      scale.push( this.freqHalfStepsAway(tonic, intervalFromTonic ) );
    }
    return scale;
  },

  
  /**
   *  Constructs a dataURI in base64 encoding from a freq and given seconds
   */
  dataURIFromFreq: function(freq, seconds) {
    var samples = [];
    var samples_length = 44100 * seconds;
    for (var i = 0; i < samples_length; i++) {
      var t = i/samples_length;
      samples[i] = 128+Math.round(127*Math.sin(freq*2*Math.PI*t));
    }

    var wave = new Wave({sampleRate: 44100, channels: 1}, samples);
    return wave.toDataURI();
  }


};









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
