try {
  var Wave = require('./wave.js').Wave;
} catch( ReferenceError) {
}

Music = {

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

try {
  exports.Music = Music;
}
catch (ReferenceError) { 
}

