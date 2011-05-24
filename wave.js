/*
 *  wave.js: javascript wrapper for the wave format
 */

var Wave = function(settings, waveData) {

  // Expose version
  this.version = [0,0,1];
  self = this;
  
  // Parse settings and load wave data
  settings        = settings            || {};
  this.sampleRate = settings.sampleRate || 44100;
  this.channels   = settings.channels   || 2;
  this.bitsPerSample = 8;

  // Load wave data
  this.waveData   = waveData            || [0];

  // Data SubChunk
  this.dataSubChunk = {
    subChunk2Id:    'data',
    subChunk2Size:  self.waveData.length,
    data:           self.waveData
  }

  // Format SubChunk
  this.fmtSubChunk = {
    subChunk1Id:    'fmt ',
    subChunk1Size:  16,
    audioFormat:    1,
    numChannels:    self.channels,
    sampleRate:     self.sampleRate,
    bitsPerSample:  8,
    byteRate:       self.sampleRate * self.channels * (self.bitsPerSample / 8),
    blockAlign:     self.channels * (self.bitsPerSample / 8)
  }

  // Header Chunk
  this.headerChunk = {
    chunkId:        'RIFF',
    chunkSize:      36 + self.dataSubChunk.subChunk2Size,
    format:         'WAVE'
  }

  this.toBinary = function() {

    header = self.headerChunk;
    fmt    = self.fmtSubChunk;
    data   = self.dataSubChunk;
    
    waveBin = [];
  
    var intToBinary = function( integer, bitFrame ) {
      if(bitFrame == 16) {
        return [integer&0xFF, (integer>>8)&0xFF];
      } else if(bitFrame == 32) {
        return [integer&0xFF, (integer>>8)&0xFF, (integer>>16)&0xFF, (integer>>24)&0xFF];
      }
    }
  
    var stringToBinary = function(str) {
      strBin = [];
      for( i = 0; i < str.length; i++) {
        strBin.push( str.charCodeAt(i) );
      }
      return strBin;
    }
    
    return waveBin.concat(
      stringToBinary(header.chunkId), 
      intToBinary(header.chunkSize, 32),
      stringToBinary(header.format),
      stringToBinary(fmt.subChunk1Id),
      intToBinary(fmt.subChunk1Size, 32),
      intToBinary(fmt.audioFormat, 16),
      intToBinary(fmt.numChannels, 16),
      intToBinary(fmt.sampleRate, 32),
      intToBinary(fmt.byteRate, 32),
      intToBinary(fmt.blockAlign, 16),
      intToBinary(fmt.bitsPerSample, 16),
      stringToBinary(data.subChunk2Id),
      intToBinary(data.subChunk2Size, 32),
      data.data
    );
  
  }

  this.toDataURI = function() {
    wavBin = self.toBinary();

    var dataURI = 'data:audio/wav;base64,';
    dataURI += (new Buffer(wavBin)).toString('base64');
//    dataURI += btoa(wavBin);

    return dataURI;
    
  }

}


// if we are being loaded as a node module
try {
  exports.Wave = Wave;
}
catch (ReferenceError) {
}
